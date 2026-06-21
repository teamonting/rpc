import { messagePortRPC as rpc } from 'message-port-rpc';
import type { InferClient } from '../types/internal/InferClient.ts';
import type { InferHandshake } from '../types/internal/InferHandshake.ts';
import type { Stub } from '../types/Stub.ts';
import type { StubDeclaration } from '../types/StubDeclaration.ts';

function lazyStub<TArgs extends unknown[], TSyncReturn>(
  fnFactory: () => Promise<(...args: TArgs) => Promise<TSyncReturn>>
): (...args: TArgs) => Promise<TSyncReturn> {
  let fnPromise: Promise<(...args: TArgs) => Promise<TSyncReturn>> | undefined;

  return async (...args) => (await (fnPromise ?? (fnPromise = fnFactory())))(...args);
}

const CROSS = '❌';
const PASSTHRU_FN = (value: unknown): unknown => value;
const TICK = '✔️';

function createClientStub<S extends Stub>(
  declaration: StubDeclaration<S>,
  messagePort: MessagePort,
  init?:
    | {
        readonly marshal?: ((value: unknown) => unknown) | undefined;
        readonly unmarshal?: ((value: unknown) => unknown) | undefined;
      }
    | undefined
): InferClient<S> {
  type Handshake = InferHandshake<S>;

  const marshal = init?.marshal ?? PASSTHRU_FN;
  const unmarshal = init?.unmarshal ?? PASSTHRU_FN;

  const clientStubMap = new Map<keyof S, (...args: unknown[]) => Promise<unknown>>();

  const handshakePromise = rpc<() => Handshake>(messagePort)();

  (async () => {
    const serverKeys = new Set(Object.keys(await handshakePromise));
    const clientKeys = new Set(Array.from(declaration.keys).map(key => key.toString()));

    if (clientKeys.symmetricDifference(serverKeys).size) {
      console.warn(
        '%cONTING%c Client and server stub mismatch',
        'background-color: green; border-radius: 4px; color: white; font-size: 125%; font-weight: bold; padding: .1em .3em 0;',
        ''
      );

      const data = [];

      for (const key of Array.from(clientKeys.union(serverKeys)).sort()) {
        data.push({
          client: clientKeys.has(key) ? TICK : CROSS,
          key,
          server: serverKeys.has(key) ? TICK : CROSS
        });
      }

      console.table(data, ['key', 'client', 'server']);
    }
  })();

  for (const key of declaration.keys) {
    clientStubMap.set(
      key,
      lazyStub(async () => {
        const messagePort = (await handshakePromise)[key];

        if (!messagePort) {
          throw new Error(`Server stub does not has function named "${key.toString()}"`);
        }

        return async (...args: unknown[]): Promise<unknown> =>
          await unmarshal(await rpc(messagePort)(...(await Promise.all(args.map(marshal)))));
      })
    );
  }

  return Object.fromEntries(clientStubMap.entries()) satisfies Record<
    string,
    (...args: unknown[]) => Promise<unknown>
    // TODO: We should not use "as unknown".
  > as unknown as InferClient<S>;
}

export default createClientStub;

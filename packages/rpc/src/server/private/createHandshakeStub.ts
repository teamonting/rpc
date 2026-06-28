import { messagePortRPC as rpc } from 'message-port-rpc';
import type { InferStub } from '../../types/InferStub.ts';
import type { InferHandshake } from '../../types/internal/InferHandshake.ts';
import type { Stub } from '../../types/Stub.ts';
import type { StubContract } from '../../types/StubContract.ts';

function createHandshakeStub<T extends StubContract<S>, S extends Stub>(
  contract: T,
  instance: S,
  {
    marshal,
    unmarshal
  }: {
    readonly marshal: (value: unknown) => unknown;
    readonly unmarshal: (value: unknown) => unknown;
  }
): {
  readonly fn: () => InferHandshake<T>;
  readonly teardown: () => void;
} {
  const openedPorts = new Set<MessagePort>();

  return {
    fn() {
      const handshakeResultMap = new Map<keyof InferStub<T>, MessagePort>();

      // Prefer StubContract.keys over Object.getOwnPropertyNames(stubInstance).
      for (const key of contract.keys) {
        const value = instance[key];

        // We already verified the implementation in `listen()`.
        if (value) {
          const { port1, port2 } = new MessageChannel();

          rpc(port1, async (...args) => await marshal(await value(...(await Promise.all(args.map(unmarshal))))));
          handshakeResultMap.set(key, port2);

          openedPorts.add(port1);
        }
      }

      return Object.fromEntries(handshakeResultMap.entries()) satisfies Record<
        string,
        MessagePort
      > as InferHandshake<T>;
    },
    teardown() {
      for (const port of openedPorts) {
        port.close();
      }
    }
  };
}

export default createHandshakeStub;

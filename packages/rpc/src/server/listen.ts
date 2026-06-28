import { messagePortRPC as rpc } from 'message-port-rpc';
import type { InferStub } from '../types/InferStub.ts';
import type { StubEnvironment } from '../types/StubEnvironment.ts';
import type { StubImplementation } from '../types/StubImplementation.ts';
import createHandshakeStub from './private/createHandshakeStub.ts';
import verifyInstance from './private/verifyInstance.ts';

const PASSTHRU_FN = (value: unknown): unknown => value;

function listen<
  T extends StubImplementation<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  any>
>(
  implementation: T,
  environment: StubEnvironment,
  messagePort: MessagePort,
  init?:
    | {
        readonly marshal?: ((value: unknown) => unknown) | undefined;
        readonly unmarshal?: ((value: unknown) => unknown) | undefined;
      }
    | undefined
): () => void {
  const marshal = init?.marshal ?? PASSTHRU_FN;
  const unmarshal = init?.unmarshal ?? PASSTHRU_FN;
  const instance: InferStub<T> = implementation.implement(environment);

  verifyInstance(implementation, instance);

  const { fn, teardown } = createHandshakeStub(implementation, instance, {
    marshal,
    unmarshal
  });

  rpc(messagePort, fn);

  return teardown;
}

export default listen;

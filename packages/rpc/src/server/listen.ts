import { messagePortRPC as rpc } from 'message-port-rpc';
import type { StubDeclaration } from '../types/StubDeclaration.ts';
import type { StubEnvironment } from '../types/StubEnvironment.ts';
import type { StubImplementation } from '../types/StubImplementation.ts';
import createHandshakeStub from './private/createHandshakeStub.ts';
import verifyImplementation from './private/verifyImplementation.ts';

const PASSTHRU_FN = (value: unknown): unknown => value;

function listen<T extends StubDeclaration<S>, S extends StubImplementation>(
  declaration: T,
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
  const implementation: S = declaration.implement(environment);

  verifyImplementation(declaration, implementation);

  const { fn, teardown } = createHandshakeStub(declaration, implementation, {
    marshal,
    unmarshal
  });

  rpc(messagePort, fn);

  return teardown;
}

export default listen;

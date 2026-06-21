import type { Stub } from './Stub';
import type { StubDeclaration } from './StubDeclaration';
import type { StubEnvironment } from './StubEnvironment';

type StubImplementation<T extends Stub> = StubDeclaration<T> & {
  implement(environment: StubEnvironment): T;
};

export type { StubImplementation };

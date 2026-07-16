import type { AnyStub } from './AnyStub.ts';
import type { StubContract } from './StubContract.ts';
import type { StubEnvironment } from './StubEnvironment.ts';

type StubImplementation<T extends AnyStub> = StubContract<T> & {
  implement(environment: StubEnvironment): Promise<T>;
};

export type { StubImplementation };

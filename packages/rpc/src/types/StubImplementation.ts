import type { Stub } from './Stub.ts';
import type { StubContract } from './StubContract.ts';
import type { StubEnvironment } from './StubEnvironment.ts';

type StubImplementation<T extends Stub> = StubContract<T> & {
  implement(environment: StubEnvironment): T;
};

export type { StubImplementation };

import type { InferStub } from './InferStub.ts';
import type { StubContract } from './StubContract.ts';
import type { StubEnvironment } from './StubEnvironment.ts';
import type { StubImplementation } from './StubImplementation.ts';

export default function defineImplementation<
  T extends StubContract<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  any>
>(
  contract: T,
  implementation: {
    implement(environment: StubEnvironment): Promise<InferStub<T>>;
  }
): StubImplementation<InferStub<T>> {
  return {
    ...contract,
    implement: implementation.implement
  };
}

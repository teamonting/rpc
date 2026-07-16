import type { InferStub } from './InferStub.ts';
import type { PromisifyFunction } from './internal/PromisifyFunction.ts';
import type { StubContract } from './StubContract.ts';

type InferClient<
  T extends StubContract<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  any>
> = {
  readonly [P in keyof InferStub<T>]: PromisifyFunction<InferStub<T>[P]>;
};

export type { InferClient };

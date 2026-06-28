import type { InferStub } from './InferStub.ts';
import type { Promisify } from './internal/Promisify.ts';
import type { StubContract } from './StubContract.ts';

type InferClient<
  T extends StubContract<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  any>
> = {
  readonly [P in keyof InferStub<T>]: (...args: Parameters<InferStub<T>[P]>) => Promisify<ReturnType<InferStub<T>[P]>>;
};

export type { InferClient };

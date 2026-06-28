import type { StubContract } from './StubContract.ts';

type InferStub<T> =
  T extends StubContract<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  any>
    ? T['~types']['Stub']
    : never;

export type { InferStub };

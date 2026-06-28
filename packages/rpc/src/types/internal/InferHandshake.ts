import type { InferStub } from '../InferStub.ts';
import type { StubContract } from '../StubContract.ts';

type InferHandshake<
  T extends StubContract<// eslint-disable-next-line @typescript-eslint/no-explicit-any
  any>
> = Record<keyof InferStub<T>, MessagePort>;

export type { InferHandshake };

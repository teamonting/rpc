import type { Stub } from './Stub.ts';

type StubContract<T extends Stub> = {
  readonly keys: readonly (keyof T)[];

  ['~types']: {
    readonly Stub: T;
  };
};

export type { StubContract };

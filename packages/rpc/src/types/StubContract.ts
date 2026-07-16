import type { AnyStub } from './AnyStub.ts';

type StubContract<T extends AnyStub> = {
  readonly keys: readonly (keyof T)[];

  ['~types']: {
    readonly Stub: T;
  };
};

export type { StubContract };

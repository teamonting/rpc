import type { Stub } from './Stub.ts';

type StubDeclaration<T extends Stub> = {
  readonly keys: readonly (keyof T)[];
};

export type { StubDeclaration };

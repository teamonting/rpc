import type { Stub } from './Stub.ts';
import type { StubContract } from './StubContract.ts';

export default function defineContract<S extends Stub>(contract: { get keys(): Iterable<keyof S> }): StubContract<S> {
  return {
    keys: Object.freeze([...contract.keys]),
    '~types': {
      Stub: undefined as unknown as S
    }
  };
}

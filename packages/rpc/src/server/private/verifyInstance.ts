import type { Stub } from '../../types/Stub';
import type { StubContract } from '../../types/StubContract';

function verifyInstance<T extends StubContract<S>, S extends Stub>(contract: T, instance: S) {
  const declaredKeySet = new Set(contract.keys);
  const implementedKeySet = new Set(Object.getOwnPropertyNames(instance));

  const differences = declaredKeySet.symmetricDifference(implementedKeySet);

  if (differences.size) {
    throw new Error(`Keys in stub contract does not match implementation: ${Array.from(differences).join(', ')}`);
  }
}

export default verifyInstance;

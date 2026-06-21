import type { Stub } from '../../types/Stub';
import type { StubDeclaration } from '../../types/StubDeclaration';

function verifyImplementation<T extends StubDeclaration<S>, S extends Stub>(declaration: T, implementation: S) {
  const declaredKeySet = new Set(declaration.keys);
  const implementedKeySet = new Set(Object.getOwnPropertyNames(implementation));

  const differences = declaredKeySet.symmetricDifference(implementedKeySet);

  if (differences.size) {
    throw new Error(`Keys in stub declaration does not match implementation: ${Array.from(differences).join(', ')}`);
  }
}

export default verifyImplementation;

import type { Stub } from '../Stub.ts';

type InferHandshake<S extends Stub> = Record<keyof S, MessagePort>;

export type { InferHandshake };

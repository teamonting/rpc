import type { Promisify } from './Promisify';

type PromisifyFunction<T extends (...args: readonly unknown[]) => unknown> = (
  ...args: Parameters<T>
) => Promisify<ReturnType<T>>;

export type { PromisifyFunction };

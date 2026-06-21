/**
 * @module Identity
 *
 * Funciones de identidad y composicion funcional basicas.
 */

/** Devuelve el valor sin modificar. Util como default fn en generics. */
export const identity = <T>(value: T): T => value;

/** Funcion que siempre devuelve el mismo valor. */
export const constant =
  <T>(value: T) =>
  (): T =>
    value;

/** No-op. Util como placeholder de callbacks vacios. */
export const noop = (): void => undefined;

/**
 * Pipe — aplica funciones de izquierda a derecha.
 *
 * Uso:
 *   const result = pipe(value, fn1, fn2, fn3);
 */
// Firmas de sobrecarga: contratos para TypeScript, no son funciones runtime.
// Cada firma cubre una cantidad distinta de funciones y conserva el tipo final.
export function pipe<A>(a: A): A;
export function pipe<A, B>(a: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe<A, B, C, D>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D;

// Implementacion real: la unica con cuerpo `{}`. Las firmas anteriores solo tipan.
export function pipe(a: unknown, ...fns: Array<(x: unknown) => unknown>): unknown {
  // `...fns` junta las funciones en un array; reduce aplica una tras otra.
  // pipe(a, f1, f2, f3) equivale a f3(f2(f1(a))).
  return fns.reduce((acc, fn) => fn(acc), a);
}

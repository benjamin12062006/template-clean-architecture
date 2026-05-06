/**
 * @module Result
 *
 * Implementacion del patron Result para manejo de errores sin excepciones.
 * Todo use case devuelve Promise<Result<Output, Failure>>.
 *
 * Uso:
 *   const result = await useCase.execute(input);
 *   if (Result.isOk(result)) { ... result.value ... }
 *   else { ... result.failure ... }
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

export type Ok<T> = Readonly<{
  readonly _tag: 'Ok';
  readonly value: T;
}>;

export type Err<F> = Readonly<{
  readonly _tag: 'Err';
  readonly failure: F;
}>;

export type Result<T, F> = Ok<T> | Err<F>;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function ok<T>(value: T): Ok<T> {
  return { _tag: 'Ok', value } as const;
}

export function err<F>(failure: F): Err<F> {
  return { _tag: 'Err', failure } as const;
}

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

export function isOk<T, F>(result: Result<T, F>): result is Ok<T> {
  return result._tag === 'Ok';
}

export function isErr<T, F>(result: Result<T, F>): result is Err<F> {
  return result._tag === 'Err';
}

// ---------------------------------------------------------------------------
// Combinators
// ---------------------------------------------------------------------------

/**
 * Aplica una funcion al valor si es Ok, propagando el Err sin tocarlo.
 */
export function map<T, U, F>(
  result: Result<T, F>,
  fn: (value: T) => U,
): Result<U, F> {
  return isOk(result) ? ok(fn(result.value)) : result;
}

/**
 * Aplica una funcion que devuelve Result al valor si es Ok.
 */
export function flatMap<T, U, F>(
  result: Result<T, F>,
  fn: (value: T) => Result<U, F>,
): Result<U, F> {
  return isOk(result) ? fn(result.value) : result;
}

/**
 * Mapea el failure si es Err, propagando el Ok sin tocarlo.
 */
export function mapErr<T, F, G>(
  result: Result<T, F>,
  fn: (failure: F) => G,
): Result<T, G> {
  return isErr(result) ? err(fn(result.failure)) : result;
}

/**
 * Extrae el valor de un Ok o devuelve el fallback.
 */
export function getOrElse<T, F>(result: Result<T, F>, fallback: T): T {
  return isOk(result) ? result.value : fallback;
}

/**
 * Extrae el valor de un Ok o lanza una excepcion.
 * Solo para tests o bootstrapping — NO usar en produccion como contrato.
 */
export function unwrap<T, F>(result: Result<T, F>): T {
  if (isOk(result)) return result.value;
  throw new Error(
    `[Result.unwrap] Called on Err: ${JSON.stringify(result.failure)}`,
  );
}

/**
 * Fold — bifurca el resultado hacia dos funciones.
 */
export function fold<T, F, R>(
  result: Result<T, F>,
  onOk: (value: T) => R,
  onErr: (failure: F) => R,
): R {
  return isOk(result) ? onOk(result.value) : onErr(result.failure);
}

/**
 * Combina un array de Results en un Result de array.
 * Falla con el primer Err encontrado.
 */
export function combineAll<T, F>(results: ReadonlyArray<Result<T, F>>): Result<ReadonlyArray<T>, F> {
  const values: T[] = [];
  for (const r of results) {
    if (isErr(r)) return r;
    values.push(r.value);
  }
  return ok(values);
}

// ---------------------------------------------------------------------------
// Async helpers
// ---------------------------------------------------------------------------

/**
 * Wrappea una Promise que puede lanzar en un Result<T, F>.
 */
export async function tryCatch<T, F>(
  fn: () => Promise<T>,
  onError: (error: unknown) => F,
): Promise<Result<T, F>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(onError(e));
  }
}

// ---------------------------------------------------------------------------
// Namespace export (uso ergonomico: Result.ok, Result.isOk, etc.)
// ---------------------------------------------------------------------------

export const Result = {
  ok,
  err,
  isOk,
  isErr,
  map,
  flatMap,
  mapErr,
  getOrElse,
  unwrap,
  fold,
  combineAll,
  tryCatch,
} as const;

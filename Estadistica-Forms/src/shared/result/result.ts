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
// ---

type Tag<T> = Readonly<{
    readonly _tag: T;
}>;

export type Ok<T> = Tag<"OK"> & Readonly <{
    readonly value: T;
}>;

export type Err<F> = Tag<"ERR"> & Readonly <{
    readonly failure: F;
}>;

export type Result<T, F> = Ok<T> | Err<F>


// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function ok<T>(value: T): Ok<T> {
    return {
        _tag: "OK",
        value,
    } as const;
}

export function err<F>(failure: F): Err<F> {
    return { _tag: "ERR", failure } as const;
}

// ---------------------------------------------------------------------------
// Type guard
// ---------------------------------------------------------------------------

export function isOk<T,F>(result: Result<T,F>) : result is Ok<T> {
    return result._tag === 'OK';
}

export function isErr<T,F>(result: Result<T,F>) : result is Err<F> {
    return result._tag === 'ERR';
}
// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function map<T,U,F>(
    result: Result<T,F>,
    fn_obtenemos_valor: (value: T) => U //este value es realmente result.value
) : Result<U,F>{
    return isOk(result) ? ok(fn_obtenemos_valor(result.value)) : result;
}

/* Toma valor de afuer le da conexto adentro y retorna al segun parametro de la funcion el valor par auqe lo utlize desde afuera
 * NOTA LÓGICA (Simil Rust):
 * - `T` es el puente: `result` asegura traer un éxito de tipo `T`, y `fn` exige recibir ese mismo tipo `T`.
 * - `isOk(result)` le garantiza a TypeScript que es seguro extraer `result.value` (T) para dárselo a la función `fn`.
 * - Entonces la funcion se usara afuera pero le pasamos el valor que podra usar afuera como result.value; 
 *   retorna un valor en este caso U que es tipo Ok<U> y eso hacepta result <U,F> y eso lo retornara ok(U) 
 */

/**
 * Aplica una funcion que devuelve Result al valor si es Ok.
 */

export function flatMap<T,U,F>(
    result: Result<T,F>,
    fn: (value:T) => Result<U,F>
): Result<U,F>{
    return isOk(result) ? fn(result.value) : result;
}

/**
 * Mapea el failure si es Err, propagando el Ok sin tocarlo.
 */

export function mapErr<T,F,G>(
    result: Result<T,F>,
    fn:(failure:F) => G
): Result<T,G> {
    return isErr(result) ? err(fn(result.failure)) : result;
}

/**
 * Extrae el valor de un Ok o devuelve el fallback.
 */
export function getOrElse<T,F>(result:Result<T,F>, fallback:T): T {
    return (isOk(result)) ? result.value : fallback
}

/**
 * Extrae el valor de un Ok o lanza una excepcion.
 * Solo para tests o bootstrapping — NO usar en produccion como contrato.
 */
export function unwrap<T,F>(result: Result<T,F>): T {
    if (isOk(result)) return result.value;
    throw new Error(
        `[Result::unwrap]: Se esperaba un Ok, pero se recibió Err con valor: ${
            JSON.stringify(result.failure)
        }`
    )   
}

/**
 * Fold — bifurca el resultado hacia dos funciones.
 */

export function fold<T, F, R>(
    result: Result<T,F>,
    onOk: (value:T) => R,
    onErr: (failure:F) => R
): R {
    return isOk(result) ? onOk(result.value) : onErr(result.failure);
}



/**
 * Combina un array de Results en un Result de array.
 * Falla con el primer Err encontrado.
 */

export function combineAll<T,F>(results:ReadonlyArray<Result<T,F>>)
: Result<ReadonlyArray<T>,F> {
    const values: T[] = [];
    for (const r of results ) {
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



export async function tryCatch<T,F>(
    fn: () => Promise<T>,
    onError: (error: unknown)=>F
) :Promise<Result<T,F>>{
    try{
        return ok(await fn())
    }catch (e){
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

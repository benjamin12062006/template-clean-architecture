/**
 * @module Invariant
 *
 * Asercion de invariantes en runtime.
 * Lanza un error si la condicion es falsa.
 * Distinto de assertNever: invariant verifica condiciones booleanas,
 * assertNever verifica exhaustividad de tipos.
 *
 * Uso:
 *   invariant(user !== null, 'Usuario requerido para continuar');
 *   invariantDefined(config.apiUrl, 'NEXT_PUBLIC_API_BASE_URL no configurada');
 */

export function invariant(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(`[invariant] ${message}`);
  }
}

/**
 * Verifica que un valor no sea null ni undefined.
 * Devuelve el valor tipado correctamente.
 */
export function invariantDefined<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(`[invariantDefined] ${message}`);
  }
  return value;
}

/**
 * @module AssertNever
 *
 * Garantia de exhaustividad en switches discriminados.
 * Si el compilador llega aqui, hay un caso no manejado en la union.
 *
 * Uso:
 *   switch (failure.kind) {
 *     case 'NETWORK_ERROR': ...
 *     case 'HTTP_ERROR': ...
 *     default: assertNever(failure);  // <- error de compilacion si falta un case
 *   }
 */
export function assertNever(value: never, message?: string): never {
  // `never` en entrada: este punto deberia ser inalcanzable si el switch es exhaustivo.
  // `never` en salida: siempre lanza, nunca retorna.
  throw new Error(
    // `??`: usa `message` si existe; si no, usa el texto por defecto.
    message ?? `[assertNever] Unhandled discriminated union value: ${JSON.stringify(value)}`,
  );
}

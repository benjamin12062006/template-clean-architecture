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
  throw new Error(
    message ?? `[assertNever] Unhandled discriminated union value: ${JSON.stringify(value)}`,
  );
}

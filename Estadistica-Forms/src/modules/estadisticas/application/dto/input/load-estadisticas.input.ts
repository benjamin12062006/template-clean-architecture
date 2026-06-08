/**
 * @module LoadEstadisticasInput — DTO de entrada
 */

import type { EstadisticasFilter } from '../../../domain/ports/outbound/estadisticas-gateway.port';

export type LoadEstadisticasInput = Readonly<{
  // `filter` agrupa criterios opcionales de consulta; asi el caso de uso recibe un solo bloque coherente
  // y luego dentro de ese bloque puedes pasar cosas como `categoria` o `limite` sin llenar la firma de params sueltos.
  readonly filter?: EstadisticasFilter;
}>;

/**
 * @module LoadEstadisticasInput — DTO de entrada
 */

import type { EstadisticasFilter } from '../../../domain/ports/outbound/estadisticas-gateway.port';

export type LoadEstadisticasInput = Readonly<{
  readonly filter?: EstadisticasFilter;
}>;

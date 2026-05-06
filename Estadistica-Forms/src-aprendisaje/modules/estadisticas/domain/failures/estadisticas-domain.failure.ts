/**
 * @module EstadisticasDomainFailure
 *
 * Failures especificos del dominio del modulo estadisticas.
 * Extiende los failures del shared kernel con contexto del modulo.
 */

import type { DomainFailure as DomainFailureType } from '@shared/failures/domain-failure';

export type EstadisticasNotFoundFailure = Readonly<{
  readonly kind: 'ESTADISTICAS_NOT_FOUND';
  readonly filters?: Record<string, unknown>;
}>;

export type EstadisticaInvalidaFailure = Readonly<{
  readonly kind: 'ESTADISTICA_INVALIDA';
  readonly field: string;
  readonly reason: string;
}>;

/** Union de failures del dominio estadisticas + failures compartidos. */
export type EstadisticasDomainFailure =
  | DomainFailureType
  | EstadisticasNotFoundFailure
  | EstadisticaInvalidaFailure;

export const EstadisticasDomainFailure = {
  notFound: (filters?: Record<string, unknown>): EstadisticasNotFoundFailure => ({
    kind: 'ESTADISTICAS_NOT_FOUND',
    filters,
  }),

  invalida: (field: string, reason: string): EstadisticaInvalidaFailure => ({
    kind: 'ESTADISTICA_INVALIDA',
    field,
    reason,
  }),
} as const;

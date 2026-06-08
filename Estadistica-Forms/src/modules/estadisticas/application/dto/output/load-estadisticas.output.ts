/**
 * @module LoadEstadisticasOutput — DTO de salida
 *
 * Representa el resultado exitoso del use case.
 * No expone la entidad interna directamente — la presenta de forma estable.
 */

import type { Estadistica } from '../../../domain/entities/estadistica.entity';

export type LoadEstadisticasOutput = Readonly<{
  // Output = forma estable del exito; no ejecuta nada por si solo.
  readonly items: ReadonlyArray<Estadistica>;
  readonly total: number;
  readonly loadedAt: number; // Date.now()
}>;

/**
 * @module Estadistica — Entity
 *
 * Entidad central del modulo estadisticas.
 * Modela los datos que el frontend necesita para mostrar metricas.
 *
 * Reglas:
 *  - Readonly en todos los campos.
 *  - Sin React, sin fetch, sin Zustand.
 *  - El factory valida invariantes y devuelve Result.
 */

import type { EstadisticaId } from '../value-objects/estadistica-id.vo';
import type { IsoTimestamp } from '@shared/types/primitive';
import type { Result } from '@shared/result/result';
import { ok, err } from '@shared/result/result';
import {
  DomainFailure,
  type DomainFailure as DomainFailureType,
} from '@shared/failures/domain-failure';

// ---------------------------------------------------------------------------
// Tipo
// ---------------------------------------------------------------------------

export type Estadistica = Readonly<{
  readonly id: EstadisticaId;
  readonly titulo: string;
  readonly valor: number;
  readonly unidad: string;
  readonly categoria: string;
  readonly fechaActualizacion: IsoTimestamp;
  readonly tendencia: EstadisticaTendencia;
}>;

export type EstadisticaTendencia = 'ALZA' | 'BAJA' | 'ESTABLE';

// ---------------------------------------------------------------------------
// Factory con validacion
// ---------------------------------------------------------------------------

export type CreateEstadisticaInput = {
  readonly id: EstadisticaId;
  readonly titulo: string;
  readonly valor: number;
  readonly unidad: string;
  readonly categoria: string;
  readonly fechaActualizacion: IsoTimestamp;
  readonly tendencia: EstadisticaTendencia;
};

export function createEstadistica(
  input: CreateEstadisticaInput,
): Result<Estadistica, DomainFailureType> {
  if (!input.titulo.trim()) {
    return err(
      DomainFailure.validation('titulo', 'El titulo no puede estar vacio'),
    );
  }
  if (!Number.isFinite(input.valor)) {
    return err(
      DomainFailure.validation(
        'valor',
        'El valor debe ser un numero finito',
        input.valor,
      ),
    );
  }
  if (!input.unidad.trim()) {
    return err(
      DomainFailure.validation('unidad', 'La unidad no puede estar vacia'),
    );
  }

  return ok({ ...input } satisfies Estadistica);
}

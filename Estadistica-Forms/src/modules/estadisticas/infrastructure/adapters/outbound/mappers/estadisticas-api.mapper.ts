/**
 * @module EstadisticasApiMapper
 *
 * Traduce la respuesta cruda de la API remota al modelo interno Estadistica.
 * Esta es la frontera DTO: ningun tipo de la API escapa hacia capas superiores.
 *
 * Regla: si la API cambia su contrato, solo este archivo cambia.
 */

import type { Result } from '@shared/result/result';
import { ok, err } from '@shared/result/result';
import { InfrastructureFailure } from '@shared/failures/infrastructure-failure';
import { createEstadistica, type Estadistica, type EstadisticaTendencia } from '@modules/estadisticas/domain/entities/estadistica.entity';
import { EstadisticaId } from '@modules/estadisticas/domain/value-objects/estadistica-id.vo';
import type { IsoTimestamp } from '@shared/types/primitive';

// ---------------------------------------------------------------------------
// DTO remoto — refleja exactamente lo que devuelve la API
// ---------------------------------------------------------------------------

export type EstadisticaApiDto = {
  readonly id: string;
  readonly title: string;
  readonly value: number;
  readonly unit: string;
  readonly category: string;
  readonly updated_at: string;
  readonly trend: string;
};

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

const TREND_MAP: Record<string, EstadisticaTendencia> = {
  up: 'ALZA',
  down: 'BAJA',
  stable: 'ESTABLE',
};

export function mapEstadisticaApiDtoToEntity(
  dto: EstadisticaApiDto,
): Result<Estadistica, InfrastructureFailure> {
  const tendencia = TREND_MAP[dto.trend];
  if (!tendencia) {
    return err(
      InfrastructureFailure.parse(
        'EstadisticaApiDto.trend',
        `Valor desconocido: ${dto.trend}`,
      ),
    );
  }

  const fecha = new Date(dto.updated_at);
  if (isNaN(fecha.getTime())) {
    return err(
      InfrastructureFailure.parse(
        'EstadisticaApiDto.updated_at',
        `Fecha invalida: ${dto.updated_at}`,
      ),
    );
  }

  const entityResult = createEstadistica({
    id: EstadisticaId.create(dto.id),
    titulo: dto.title,
    valor: dto.value,
    unidad: dto.unit,
    categoria: dto.category,
    fechaActualizacion: dto.updated_at as IsoTimestamp,
    tendencia,
  });

  if (entityResult._tag === 'Err') {
    return err(
      InfrastructureFailure.parse('EstadisticaApiDto', entityResult.failure),
    );
  }

  return ok(entityResult.value);
}

export function mapEstadisticasApiDtoListToEntities(
  dtos: ReadonlyArray<EstadisticaApiDto>,
): Result<ReadonlyArray<Estadistica>, InfrastructureFailure> {
  const results: Estadistica[] = [];
  for (const dto of dtos) {
    const result = mapEstadisticaApiDtoToEntity(dto);
    if (result._tag === 'Err') return result;
    results.push(result.value);
  }
  return ok(results);
}

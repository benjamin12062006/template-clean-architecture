/**
 * @module EstadisticasGatewayPort — Puerto outbound
 *
 * Contrato que el dominio necesita para obtener estadisticas remotas.
 * La implementacion concreta vive en infrastructure/adapters.
 *
 * Reglas:
 *  - No filtra tipos de librerias externas.
 *  - No devuelve responses HTTP crudas.
 *  - Habla con DTOs internos (LoadEstadisticasOutput).
 */

import type { Result } from '@shared/result/result';
import type { InfrastructureFailure } from '@shared/failures/infrastructure-failure';
import type { Estadistica } from '@modules/estadisticas/domain/entities/estadistica.entity';

export type EstadisticasFilter = Readonly<{
  readonly categoria?: string;
  readonly limite?: number;
}>;

export interface EstadisticasGatewayPort {
  findAll(
    filter?: EstadisticasFilter,
  ): Promise<Result<ReadonlyArray<Estadistica>, InfrastructureFailure>>;

  findById(
    id: string,
  ): Promise<Result<Estadistica, InfrastructureFailure>>;
}

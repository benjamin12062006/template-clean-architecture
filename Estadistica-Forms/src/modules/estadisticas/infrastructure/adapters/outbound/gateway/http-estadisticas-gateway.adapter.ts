/**
 * @module HttpEstadisticasGatewayAdapter
 *
 * Implementacion concreta de EstadisticasGatewayPort.
 * Hace IO real via HttpClientPort y traduce la respuesta con el mapper.
 *
 * Reglas:
 *  - Solo hace IO y mapea.
 *  - No contiene reglas de negocio.
 *  - Traduce errores tecnicos a InfrastructureFailure.
 */

import type { Result } from '@shared/result/result';
import { isErr } from '@shared/result/result';
import type { InfrastructureFailure } from '@shared/failures/infrastructure-failure';
import type { HttpClientPort } from '@shared/http/http-types';
import type {
  EstadisticasGatewayPort,
  EstadisticasFilter,
} from '@modules/estadisticas/domain/ports/outbound/estadisticas-gateway.port';
import type { Estadistica } from '@modules/estadisticas/domain/entities/estadistica.entity';
import type { EstadisticaApiDto } from '../mappers/estadisticas-api.mapper';
import {
  mapEstadisticasApiDtoListToEntities,
  mapEstadisticaApiDtoToEntity,
} from '../mappers/estadisticas-api.mapper';

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

type Dependencies = Readonly<{
  readonly httpClient: HttpClientPort;
  readonly basePath?: string;
}>;

export function createHttpEstadisticasGatewayAdapter(
  deps: Dependencies,
): EstadisticasGatewayPort {
  const basePath = deps.basePath ?? '/api/estadisticas';

  return {
    async findAll(
      filter?: EstadisticasFilter,
    ): Promise<Result<ReadonlyArray<Estadistica>, InfrastructureFailure>> {
      // Adapter HTTP = implementacion concreta del port; aqui si se hace IO real.
      const params = new URLSearchParams();
      if (filter?.categoria) params.set('categoria', filter.categoria);
      if (filter?.limite) params.set('limite', String(filter.limite));

      const url = params.size > 0 ? `${basePath}?${params}` : basePath;

      const response = await deps.httpClient.get<EstadisticaApiDto[]>(url);
      if (isErr(response)) return response;

      return mapEstadisticasApiDtoListToEntities(response.value.data);
    },

    async findById(
      id: string,
    ): Promise<Result<Estadistica, InfrastructureFailure>> {
      const response = await deps.httpClient.get<EstadisticaApiDto>(
        `${basePath}/${id}`,
      );
      if (isErr(response)) return response;

      return mapEstadisticaApiDtoToEntity(response.value.data);
    },
  };
}

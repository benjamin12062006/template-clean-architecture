/**
 * @module HttpResourceGatewayAdapter
 *
 * Adapter HTTP generico para plantilla. El endpoint se inyecta desde composicion.
 */

import type { Result } from '@shared/result/result';
import { isErr, ok } from '@shared/result/result';
import { InfrastructureFailure } from '@shared/failures/infrastructure-failure';
import type { InfrastructureFailure as InfrastructureFailureType } from '@shared/failures/infrastructure-failure';
import type { HttpClientPort } from '@shared/http/http-types';
import type {
  ResourceGatewayPort,
  ResourceQuery,
} from '@modules/resource/domain/ports/outbound/resource-gateway.port';
import type { Resource } from '@modules/resource/domain/entities/resource.entity';
import type { ResourceApiDto } from './resource-api.mapper';
import { mapResourceApiDtoListToEntities } from './resource-api.mapper';

type Dependencies = Readonly<{
  readonly httpClient: HttpClientPort;
  readonly basePath: string;
}>;

export function createHttpResourceGatewayAdapter(
  deps: Dependencies,
): ResourceGatewayPort {
  return {
    async findAll(
      query?: ResourceQuery,
    ): Promise<Result<ReadonlyArray<Resource>, InfrastructureFailureType>> {
      const url = buildUrl(deps.basePath, query);
      const response = await deps.httpClient.get<unknown>(url);
      if (isErr(response)) return response;

      if (!Array.isArray(response.value.data)) {
        return {
          _tag: 'Err',
          failure: InfrastructureFailure.parse(
            'ResourceApiDto[]',
            'Expected an array payload',
          ),
        };
      }

      return ok(
        mapResourceApiDtoListToEntities(
          response.value.data as ReadonlyArray<ResourceApiDto>,
        ),
      );
    },
  };
}

function buildUrl(basePath: string, query?: ResourceQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    params.set(key, String(value));
  }

  return params.size > 0 ? `${basePath}?${params}` : basePath;
}

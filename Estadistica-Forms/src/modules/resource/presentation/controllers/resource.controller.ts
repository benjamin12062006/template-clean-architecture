/**
 * @module ResourceController
 *
 * Controller generico de presentation para cargar recursos.
 */

import type { Result } from '@shared/result/result';
import type {
  LoadResourceFailure,
  LoadResourceUseCase,
} from '@modules/resource/domain/ports/inbound/load-resource.use-case';
import type { ResourceQuery } from '@modules/resource/domain/ports/outbound/resource-gateway.port';
import type { LoadResourceOutput } from '@modules/resource/application/dto/output/load-resource.output';

export interface ResourceController {
  loadResources(
    query?: ResourceQuery,
  ): Promise<Result<LoadResourceOutput, LoadResourceFailure>>;
}

type Dependencies = Readonly<{
  readonly loadResourceUseCase: LoadResourceUseCase;
}>;

export function createResourceController(
  deps: Dependencies,
): ResourceController {
  const { loadResourceUseCase } = deps;

  return {
    loadResources(query) {
      return loadResourceUseCase.execute({ query });
    },
  };
}

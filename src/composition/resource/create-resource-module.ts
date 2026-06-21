/**
 * @module CreateResourceModule
 *
 * Composition root generico de plantilla.
 */

import { createHttpResourceGatewayAdapter } from '../../modules/resource/infrastructure/http-resource-gateway.adapter';
import { createLoadResourceUseCase } from '../../modules/resource/application/use-cases/load-resource.use-case';
import { createResourceController } from '../../modules/resource/presentation/controllers/resource.controller';
import type { HttpClientPort } from '@shared/http/http-types';

export type ResourceModule = Readonly<{
  readonly controller: ReturnType<typeof createResourceController>;
}>;

type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
  readonly resourcePath?: string;
}>;

export function createResourceModule(
  deps: CompositionDeps,
): ResourceModule {
  const resourceGateway = createHttpResourceGatewayAdapter({
    httpClient: deps.httpClient,
    basePath: deps.resourcePath ?? '/api/resources',
  });

  const loadResourceUseCase = createLoadResourceUseCase({
    resourceGateway,
  });

  const controller = createResourceController({
    loadResourceUseCase,
  });

  return { controller };
}

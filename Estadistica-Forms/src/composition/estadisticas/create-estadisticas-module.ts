/**
 * @module CreateEstadisticasModule — Composition Root
 *
 * Unico lugar donde se conectan implementaciones concretas del modulo estadisticas.
 * Instancia adapters → use cases → controller y expone API a capas superiores.
 *
 * Regla: ningun otro archivo fuera de composition/ puede hacer este wiring.
 */

import { createHttpEstadisticasGatewayAdapter } from '../../modules/estadisticas/infrastructure/adapters/outbound/gateway/http-estadisticas-gateway.adapter';
import { createConsoleTelemetryAdapter } from '../../modules/estadisticas/infrastructure/adapters/outbound/telemetry/console-telemetry.adapter';
import { createLoadEstadisticasUseCase } from '../../modules/estadisticas/application/use-cases/load-estadisticas.use-case';
import { createEstadisticasController } from '../../modules/estadisticas/presentation/controllers/estadisticas.controller';
import type { HttpClientPort } from '@shared/http/http-types';

// ---------------------------------------------------------------------------
// Modulo ensamblado — lo que se expone hacia app/ y providers
// ---------------------------------------------------------------------------

export type EstadisticasModule = Readonly<{
  readonly controller: ReturnType<typeof createEstadisticasController>;
}>;

// ---------------------------------------------------------------------------
// Factory de composicion
// ---------------------------------------------------------------------------

type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
}>;

export function createEstadisticasModule(
  deps: CompositionDeps,
): EstadisticasModule {
  // 1. Adapters concretos
  const estadisticasGateway = createHttpEstadisticasGatewayAdapter({
    httpClient: deps.httpClient,
  });
  const telemetry = createConsoleTelemetryAdapter();

  // 2. Use cases
  const loadEstadisticasUseCase = createLoadEstadisticasUseCase({
    estadisticasGateway,
    telemetry,
  });

  // 3. Controller
  const controller = createEstadisticasController({
    loadEstadisticasUseCase,
  });

  return { controller };
}

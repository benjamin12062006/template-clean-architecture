/**
 * @module LoadEstadisticasUseCase — Implementacion
 *
 * Caso de uso principal del modulo estadisticas.
 * Coordina: policy → gateway → output DTO.
 *
 * Reglas:
 *  - No renderiza nada.
 *  - No llama fetch directamente.
 *  - Recibe sus dependencias por inyeccion (factory pattern).
 *  - Devuelve siempre Result<Output, Failure>.
 */

import type { Result } from '@shared/result/result';
import { err, isErr } from '@shared/result/result';
import type {
  LoadEstadisticasUseCase,
  LoadEstadisticasFailure,
} from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';
import type { LoadEstadisticasInput } from '@modules/estadisticas/application/dto/input/load-estadisticas.input';
import type { LoadEstadisticasOutput } from '@modules/estadisticas/application/dto/output/load-estadisticas.output';
import type { EstadisticasGatewayPort } from '@modules/estadisticas/domain/ports/outbound/estadisticas-gateway.port';
import type { TelemetryPort } from '@modules/estadisticas/domain/ports/outbound/telemetry.port';
import { validateCategoriaFilter } from '../policies/estadisticas.policy';

// ---------------------------------------------------------------------------
// Dependencias
// ---------------------------------------------------------------------------

type Dependencies = Readonly<{
  readonly estadisticasGateway: EstadisticasGatewayPort;
  readonly telemetry: TelemetryPort;
}>;

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createLoadEstadisticasUseCase(
  deps: Dependencies,
): LoadEstadisticasUseCase {
  return {
    async execute(
      input: LoadEstadisticasInput,
    ): Promise<Result<LoadEstadisticasOutput, LoadEstadisticasFailure>> {
      const start = Date.now();

      // Application vive aqui: coordina reglas, puertos y output sin saber de React ni HTTP crudo.
      // 1. Policy
      const policyResult = validateCategoriaFilter(input.filter?.categoria);
      if (isErr(policyResult)) {
        deps.telemetry.trackEvent('estadisticas.load.policy_rejected', {
          reason: policyResult.failure.reason,
        });
        return err(policyResult.failure);
      }

      // 2. Gateway
      // Port outbound: el caso de uso pide datos sin conocer la implementacion tecnica.
      const gatewayResult = await deps.estadisticasGateway.findAll(input.filter);
      if (isErr(gatewayResult)) {
        deps.telemetry.trackError(gatewayResult.failure, {
          useCase: 'LoadEstadisticas',
        });
        return err(gatewayResult.failure);
      }

      const items = gatewayResult.value;

      // 3. Telemetria de exito
      deps.telemetry.trackTiming('estadisticas.load', Date.now() - start);
      deps.telemetry.trackEvent('estadisticas.load.success', {
        total: items.length,
      });

      // 4. Output DTO
      return {
        _tag: 'Ok',
        value: {
          items,
          total: items.length,
          loadedAt: Date.now(),
        },
      };
    },
  };
}

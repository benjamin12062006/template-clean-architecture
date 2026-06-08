/**
 * @module EstadisticasController
 *
 * Orquesta la interaccion de pantalla del modulo estadisticas.
 * Presentation delega aqui la carga de datos y nada mas.
 *
 * Reglas:
 *  - No renderiza JSX.
 *  - No contiene estado visual.
 *  - No llama adapters directamente.
 *  - No parsea respuestas HTTP.
 *  - Recibe solo el use case por inyeccion.
 */

import type { Result } from '@shared/result/result';
import type { LoadEstadisticasUseCase } from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';
import type {
  LoadEstadisticasFailure,
} from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';
import type { LoadEstadisticasOutput } from '@modules/estadisticas/application/dto/output/load-estadisticas.output';

// ---------------------------------------------------------------------------
// Controller interface
// ---------------------------------------------------------------------------

export interface EstadisticasController {
  loadEstadisticas(
    categoria?: string,
  ): Promise<Result<LoadEstadisticasOutput, LoadEstadisticasFailure>>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

type Dependencies = Readonly<{
  readonly loadEstadisticasUseCase: LoadEstadisticasUseCase;
}>;

export function createEstadisticasController(
  deps: Dependencies,
): EstadisticasController {
  const { loadEstadisticasUseCase } = deps;

  return {
    // Controller = puente fino entre UI y application; no guarda estado ni renderiza.
    loadEstadisticas(categoria) {
      return loadEstadisticasUseCase.execute({
        filter: categoria ? { categoria } : undefined,
      });
    },
  };
}

/**
 * @module EstadisticasController
 *
 * Orquesta la interaccion de pantalla del modulo estadisticas.
 * Invoca use cases y traduce resultados a cambios de estado en la store.
 *
 * Reglas:
 *  - No renderiza JSX.
 *  - No llama adapters directamente.
 *  - No parsea respuestas HTTP.
 *  - Recibe use case y store por inyeccion.
 */

import { isErr } from '@shared/result/result';
import type { LoadEstadisticasUseCase } from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';
import type { EstadisticasStoreInstance } from '@modules/estadisticas/presentation/state/estadisticas.store';

// ---------------------------------------------------------------------------
// Controller interface
// ---------------------------------------------------------------------------

export interface EstadisticasController {
  loadEstadisticas(categoria?: string): Promise<void>;
  selectCategoria(categoria: string | null): void;
  refresh(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

type Dependencies = Readonly<{
  readonly loadEstadisticasUseCase: LoadEstadisticasUseCase;
  readonly store: EstadisticasStoreInstance;
}>;

export function createEstadisticasController(
  deps: Dependencies,
): EstadisticasController {
  const { loadEstadisticasUseCase, store } = deps;

  async function loadEstadisticas(categoria?: string): Promise<void> {
    store.getState().setLoading();

    const result = await loadEstadisticasUseCase.execute({
      filter: categoria ? { categoria } : undefined,
    });

    if (isErr(result)) {
      store.getState().setFailure(result.failure);
      return;
    }

    store.getState().setSuccess(result.value);
  }

  return {
    loadEstadisticas,

    selectCategoria(categoria) {
      store.getState().setSelectedCategoria(categoria);
    },

    async refresh() {
      const currentCategoria = store.getState().selectedCategoria;
      await loadEstadisticas(currentCategoria ?? undefined);
    },
  };
}

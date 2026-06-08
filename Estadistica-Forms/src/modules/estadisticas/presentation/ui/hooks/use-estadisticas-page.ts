/**
 * @module useEstadisticasPage
 *
 * Hook de adaptacion React — conecta controller con estado local de la UI.
 * Expone datos y handlers listos para la view.
 *
 * Reglas:
 *  - No contiene llamadas HTTP.
 *  - No contiene reglas de negocio.
 *  - Solo adapta: Result → AsyncState → view model.
 */

'use client';

import { useEffect, useState } from 'react';
import { isErr } from '@shared/result/result';
import type { AsyncState } from '@shared/types/async-state';
import { AsyncState as AS } from '@shared/types/async-state';
import type { EstadisticasController } from '@modules/estadisticas/presentation/controllers/estadisticas.controller';
import { buildEstadisticasPageVM } from '@modules/estadisticas/presentation/view-models/estadisticas-page.view-model';
import type { EstadisticasPageVM } from '@modules/estadisticas/presentation/view-models/estadisticas-page.view-model';
import type { LoadEstadisticasOutput } from '@modules/estadisticas/application/dto/output/load-estadisticas.output';
import type { LoadEstadisticasFailure } from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';

type UseEstadisticasPageReturn = Readonly<{
  readonly vm: EstadisticasPageVM;
  readonly onRefresh: () => void;
}>;

type Deps = Readonly<{
  readonly controller: EstadisticasController;
}>;

async function loadEstadisticasIntoState(
  controller: EstadisticasController,
  setEstadisticas: (
    state: AsyncState<LoadEstadisticasOutput, LoadEstadisticasFailure>,
  ) => void,
  categoria?: string,
): Promise<void> {
  // Hook interno de presentation: traduce Result del controller a estado React simple.
  setEstadisticas(AS.loading());

  const result = await controller.loadEstadisticas(categoria);
  if (isErr(result)) {
    setEstadisticas(AS.failure(result.failure));
    return;
  }

  setEstadisticas(AS.success(result.value));
}

export function useEstadisticasPage(deps: Deps): UseEstadisticasPageReturn {
  const { controller } = deps;
  const [estadisticas, setEstadisticas] = useState<
    AsyncState<LoadEstadisticasOutput, LoadEstadisticasFailure>
  >(() => AS.idle());

  useEffect(() => {
    // La pantalla arranca cargando una vez; la logica de negocio sigue fuera del hook.
    void loadEstadisticasIntoState(controller, setEstadisticas);
  }, [controller]);

  const onRefresh = () => {
    void loadEstadisticasIntoState(controller, setEstadisticas);
  };

  return {
    vm: buildEstadisticasPageVM(estadisticas),
    onRefresh,
  };
}

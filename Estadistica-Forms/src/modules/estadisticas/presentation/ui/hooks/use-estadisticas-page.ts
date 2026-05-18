/**
 * @module useEstadisticasPage
 *
 * Hook de adaptacion React — conecta store y controller con la UI.
 * Expone datos y handlers listos para la view.
 *
 * Reglas:
 *  - No contiene llamadas HTTP.
 *  - No contiene reglas de negocio.
 *  - Solo adapta: store → view model + controller → handlers.
 */

'use client';

import { useEffect, useEffectEvent } from 'react';
import type { EstadisticasController } from '@modules/estadisticas/presentation/controllers/estadisticas.controller';
import type { EstadisticasStoreInstance } from '@modules/estadisticas/presentation/state/estadisticas.store';
import { buildEstadisticasPageVM } from '@modules/estadisticas/presentation/view-models/estadisticas-page.view-model';
import type { EstadisticasPageVM } from '@modules/estadisticas/presentation/view-models/estadisticas-page.view-model';

type UseEstadisticasPageReturn = Readonly<{
  readonly vm: EstadisticasPageVM;
  readonly onSelectCategoria: (categoria: string | null) => void;
  readonly onRefresh: () => void;
}>;

type Deps = Readonly<{
  readonly controller: EstadisticasController;
  readonly store: EstadisticasStoreInstance;
}>;

export function useEstadisticasPage(deps: Deps): UseEstadisticasPageReturn {
  const { controller, store } = deps;

  const estadisticas = store((s) => s.estadisticas);
  const selectedCategoria = store((s) => s.selectedCategoria);

  const loadInitial = useEffectEvent((categoria?: string) => {
    void controller.loadEstadisticas(categoria);
  });

  useEffect(() => {
    loadInitial(selectedCategoria ?? undefined);
  }, [selectedCategoria]);

  const onSelectCategoria = (categoria: string | null) => {
    controller.selectCategoria(categoria);
  };

  const onRefresh = () => {
    void controller.refresh();
  };

  return {
    vm: buildEstadisticasPageVM(estadisticas),
    onSelectCategoria,
    onRefresh,
  };
}

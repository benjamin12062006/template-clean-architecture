/**
 * @module EstadisticasStore
 *
 * Estado observable de la pantalla de estadisticas.
 * Contenedor de estado — la logica async vive en el controller, no aqui.
 *
 * Usa una store liviana basada en `useSyncExternalStore`.
 * El controller llama a las acciones; la view solo lee el estado.
 */

import { useSyncExternalStore } from 'react';
import type { AsyncState } from '@shared/types/async-state';
import { AsyncState as AS } from '@shared/types/async-state';
import type { LoadEstadisticasOutput } from '@modules/estadisticas/application/dto/output/load-estadisticas.output';
import type { LoadEstadisticasFailure } from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';

// ---------------------------------------------------------------------------
// State type
// ---------------------------------------------------------------------------

export type EstadisticasStoreState = Readonly<{
  readonly estadisticas: AsyncState<LoadEstadisticasOutput, LoadEstadisticasFailure>;
  readonly selectedCategoria: string | null;
}>;

// ---------------------------------------------------------------------------
// Actions type
// ---------------------------------------------------------------------------

export type EstadisticasStoreActions = {
  setLoading(): void;
  setSuccess(data: LoadEstadisticasOutput): void;
  setFailure(failure: LoadEstadisticasFailure): void;
  setSelectedCategoria(categoria: string | null): void;
  reset(): void;
};

// ---------------------------------------------------------------------------
// Combined
// ---------------------------------------------------------------------------

export type EstadisticasStore = EstadisticasStoreState & EstadisticasStoreActions;

type Listener = () => void;
type Selector<TSelected> = (state: EstadisticasStore) => TSelected;

export type EstadisticasStoreInstance = {
  <TSelected>(selector: Selector<TSelected>): TSelected;
  getState(): EstadisticasStore;
  subscribe(listener: Listener): () => void;
};

// ---------------------------------------------------------------------------
// Factory (permite instanciar una store por cada composition root)
// ---------------------------------------------------------------------------

export function createEstadisticasStore(): EstadisticasStoreInstance {
  const listeners = new Set<Listener>();
  let state = {} as EstadisticasStore;

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const setState = (
    updater: EstadisticasStore | ((current: EstadisticasStore) => EstadisticasStore),
  ) => {
    state =
      typeof updater === 'function'
        ? updater(state)
        : updater;
    emit();
  };

  state = {
    estadisticas: AS.idle(),
    selectedCategoria: null,
    setLoading: () =>
      setState((current) => ({ ...current, estadisticas: AS.loading() })),
    setSuccess: (data) =>
      setState((current) => ({ ...current, estadisticas: AS.success(data) })),
    setFailure: (failure) =>
      setState((current) => ({ ...current, estadisticas: AS.failure(failure) })),
    setSelectedCategoria: (categoria) =>
      setState((current) => ({ ...current, selectedCategoria: categoria })),
    reset: () =>
      setState((current) => ({
        ...current,
        estadisticas: AS.idle(),
        selectedCategoria: null,
      })),
  };

  const useStore = (<TSelected>(selector: Selector<TSelected>): TSelected =>
    useSyncExternalStore(
      (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      () => selector(state),
      () => selector(state),
    )) as EstadisticasStoreInstance;

  useStore.getState = () => state;
  useStore.subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return useStore;
}

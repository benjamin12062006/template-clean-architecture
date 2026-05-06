/**
 * @module EstadisticasPageView
 *
 * Composicion de la pantalla de estadisticas.
 * Conecta el hook del modulo y distribuye props a componentes visuales.
 * Es consumida directamente por app/estadisticas/page.tsx.
 *
 * Regla: no importa adapters concretos ni use cases directamente.
 */

'use client';

import { useEstadisticasPage } from '../ui/hooks/use-estadisticas-page';
import { EstadisticasGrid } from '../ui/components/estadisticas-grid.component';
import { Button } from '@ui/components/common/button.component';
import { MainLayout } from '@ui/components/layout/main-layout.component';
import type { EstadisticasController } from '../controllers/estadisticas.controller';
import type { EstadisticasStoreInstance } from '../state/estadisticas.store';

type Props = Readonly<{
  readonly controller: EstadisticasController;
  readonly store: EstadisticasStoreInstance;
}>;

export function EstadisticasPageView({ controller, store }: Props) {
  const { vm, onRefresh } = useEstadisticasPage({ controller, store });

  if (vm.status === 'idle' || vm.status === 'loading') {
    return (
      <MainLayout>
        <div
          className="rounded-[32px] border border-stone-700/80 bg-stone-900/60 p-10 text-center text-base text-stone-300 shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          aria-busy="true"
        >
          <span>Cargando estadisticas...</span>
        </div>
      </MainLayout>
    );
  }

  if (vm.status === 'failure') {
    return (
      <MainLayout>
        <div
          className="flex flex-col gap-4 rounded-[32px] border border-rose-500/20 bg-rose-950/30 p-8 text-rose-100 shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:flex-row md:items-center md:justify-between"
          role="alert"
        >
          <p className="text-sm font-medium">{vm.message}</p>
          <Button onClick={onRefresh} type="button">
            Reintentar
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (vm.status === 'empty') {
    return (
      <MainLayout>
        <div className="rounded-[32px] border border-dashed border-stone-700 bg-stone-900/40 p-10 text-center text-sm text-stone-400">
          <p>No hay estadisticas disponibles.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="grid gap-6">
        <header className="flex flex-col gap-5 rounded-[32px] border border-stone-700/80 bg-stone-900/55 p-7 shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-lime-500/15 bg-lime-500/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-lime-300">
              Estadisticas demo
            </span>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.08em] md:text-6xl">
                Estadisticas
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-stone-300 md:text-base">
                Visual del modulo renderizada con Tailwind desde presentation.
              </p>
            </div>
          </div>
          <Button
            onClick={onRefresh}
            type="button"
            aria-label="Actualizar estadisticas"
          >
            Actualizar
          </Button>
        </header>

        <EstadisticasGrid items={vm.items} />

        <footer className="rounded-[28px] border border-stone-700/80 bg-stone-900/55 px-6 py-4 text-sm text-stone-400 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <small>{vm.total} estadisticas en total</small>
        </footer>
      </main>
    </MainLayout>
  );
}

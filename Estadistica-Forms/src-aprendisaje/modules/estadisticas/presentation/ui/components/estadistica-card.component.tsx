/**
 * @module EstadisticaCard — Componente UI del modulo
 *
 * Componente visual especifico del modulo estadisticas.
 * Recibe props listas del view model — no sabe nada del dominio.
 */

'use client';

import { Card } from '@ui/components/common/card.component';

import type { EstadisticaCardVM } from '../../view-models/estadisticas-page.view-model';

type Props = Readonly<{
  readonly item: EstadisticaCardVM;
}>;

export function EstadisticaCard({ item }: Props) {
  const variantClass =
    item.tendenciaVariant === 'positive'
      ? 'border-lime-500/15 bg-lime-500/10 text-lime-400'
      : item.tendenciaVariant === 'negative'
        ? 'border-rose-500/15 bg-rose-500/10 text-rose-400'
        : 'border-stone-600 bg-stone-700/60 text-stone-300';

  return (
    <Card className="grid gap-5 p-6" aria-label={item.titulo}>
      <header className="flex items-start justify-between gap-3">
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-stone-400">
          {item.categoria}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${variantClass}`}
        >
          {item.tendenciaLabel}
        </span>
      </header>

      <div className="space-y-2">
        <p className="text-sm font-medium text-stone-300">{item.titulo}</p>
        <p className="flex items-baseline gap-3">
          <strong className="text-3xl font-semibold tracking-[-0.06em] text-stone-50 md:text-4xl">
            {item.valorFormateado}
          </strong>
          <span className="text-sm font-medium uppercase tracking-[0.16em] text-stone-400">
            {item.unidad}
          </span>
        </p>
      </div>
    </Card>
  );
}

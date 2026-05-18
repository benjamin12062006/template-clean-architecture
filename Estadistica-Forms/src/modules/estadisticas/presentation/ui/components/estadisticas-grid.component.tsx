/**
 * @module EstadisticasGrid — Componente UI del modulo
 *
 * Renderiza la grilla de tarjetas de estadisticas.
 * Solo composicion visual — sin logica.
 */

'use client';

import type { EstadisticaCardVM } from '../../view-models/estadisticas-page.view-model';
import { EstadisticaCard } from './estadistica-card.component';

type Props = Readonly<{
  readonly items: ReadonlyArray<EstadisticaCardVM>;
}>;

export function EstadisticasGrid({ items }: Props) {
  return (
    <section
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      aria-label="Listado de estadisticas"
    >
      {items.map((item) => (
        <EstadisticaCard key={item.id} item={item} />
      ))}
    </section>
  );
}

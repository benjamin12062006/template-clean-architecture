import { NextResponse } from 'next/server';

const ESTADISTICAS_DEMO = [
  {
    id: 'ventas-mensuales',
    title: 'Ventas mensuales',
    value: 15200,
    unit: 'USD',
    category: 'ventas',
    updated_at: '2026-04-28T10:30:00.000Z',
    trend: 'up',
  },
  {
    id: 'usuarios-activos',
    title: 'Usuarios activos',
    value: 842,
    unit: 'usuarios',
    category: 'usuarios',
    updated_at: '2026-04-28T10:30:00.000Z',
    trend: 'stable',
  },
  {
    id: 'tickets-soporte',
    title: 'Tickets de soporte',
    value: 37,
    unit: 'tickets',
    category: 'soporte',
    updated_at: '2026-04-28T10:30:00.000Z',
    trend: 'down',
  },
  {
    id: 'conversion-formularios',
    title: 'Conversion de formularios',
    value: 18.4,
    unit: '%',
    category: 'formularios',
    updated_at: '2026-04-28T10:30:00.000Z',
    trend: 'up',
  },
] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria')?.trim().toLowerCase();

  const items = categoria
    ? ESTADISTICAS_DEMO.filter(
        (item) => item.category.toLowerCase() === categoria,
      )
    : ESTADISTICAS_DEMO;

  return NextResponse.json(items);
}

/**
 * @module EstadisticasPageViewModel
 *
 * Convierte el estado async de presentation en props listas para la UI.
 * Funciones puras — sin side effects, sin React, sin IO.
 *
 * La view llama estas funciones para obtener datos renderizables.
 */

import type { AsyncState } from '@shared/types/async-state';
import { AsyncState as AS } from '@shared/types/async-state';
import type { LoadEstadisticasOutput } from '@modules/estadisticas/application/dto/output/load-estadisticas.output';
import type { LoadEstadisticasFailure } from '@modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case';
import type { Estadistica } from '@modules/estadisticas/domain/entities/estadistica.entity';

// ---------------------------------------------------------------------------
// View model types — lo que la UI consume directamente
// ---------------------------------------------------------------------------

export type EstadisticaCardVM = Readonly<{
  readonly id: string;
  readonly titulo: string;
  readonly valorFormateado: string;
  readonly unidad: string;
  readonly categoria: string;
  readonly tendenciaLabel: string;
  readonly tendenciaVariant: 'positive' | 'negative' | 'neutral';
}>;

export type EstadisticasPageVM =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'success'; readonly items: ReadonlyArray<EstadisticaCardVM>; readonly total: number }
  | { readonly status: 'failure'; readonly message: string };

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

export function buildEstadisticasPageVM(
  state: AsyncState<LoadEstadisticasOutput, LoadEstadisticasFailure>,
): EstadisticasPageVM {
  // ViewModel = traductor final para que la view solo piense en estados visuales.
  if (AS.isIdle(state)) return { status: 'idle' };
  if (AS.isLoading(state)) return { status: 'loading' };

  if (AS.isFailure(state)) {
    return {
      status: 'failure',
      message: buildFailureMessage(state.failure),
    };
  }

  if (AS.isSuccess(state)) {
    if (state.data.items.length === 0) return { status: 'empty' };
    return {
      status: 'success',
      items: state.data.items.map(buildEstadisticaCardVM),
      total: state.data.total,
    };
  }

  return { status: 'idle' };
}

function buildEstadisticaCardVM(e: Estadistica): EstadisticaCardVM {
  // Aqui el dominio se vuelve lenguaje visual: labels, formato y variantes de color.
  const tendenciaLabel =
    e.tendencia === 'ALZA' ? '↑ En alza' :
    e.tendencia === 'BAJA' ? '↓ En baja' :
    '→ Estable';

  const tendenciaVariant =
    e.tendencia === 'ALZA' ? 'positive' :
    e.tendencia === 'BAJA' ? 'negative' :
    'neutral';

  return {
    id: String(e.id),
    titulo: e.titulo,
    valorFormateado: `${e.valor.toLocaleString('es-DO')}`,
    unidad: e.unidad,
    categoria: e.categoria,
    tendenciaLabel,
    tendenciaVariant,
  };
}

function buildFailureMessage(failure: LoadEstadisticasFailure): string {
  // Los failures tecnicos se convierten aqui en mensajes humanos para la UI.
  if ('kind' in failure) {
    switch (failure.kind) {
      case 'NETWORK_ERROR':
        return 'Sin conexion. Verifica tu red.';
      case 'HTTP_ERROR':
        return `Error del servidor (${failure.status}).`;
      case 'ESTADISTICAS_NOT_FOUND':
        return 'No se encontraron estadisticas.';
      case 'POLICY_REJECTED':
        return failure.reason;
      default:
        return 'Ocurrio un error inesperado.';
    }
  }
  return 'Ocurrio un error inesperado.';
}

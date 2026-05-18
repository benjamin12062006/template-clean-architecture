/**
 * @module EstadisticaRules
 *
 * Reglas de coherencia del dominio estadisticas.
 * Funciones puras que evaluan condiciones sobre entidades.
 */

import type { Estadistica } from '../entities/estadistica.entity';

/** Una estadistica se considera critica si su tendencia es BAJA y valor < umbral. */
export function esCritica(e: Estadistica, umbralMinimo: number): boolean {
  return e.tendencia === 'BAJA' && e.valor < umbralMinimo;
}

/** Una estadistica esta desactualizada si fue editada hace mas de N dias. */
export function estaDesactualizada(e: Estadistica, maxDiasAntiguo: number): boolean {
  const ahora = Date.now();
  const fecha = new Date(e.fechaActualizacion).getTime();
  const dias = (ahora - fecha) / (1000 * 60 * 60 * 24);
  return dias > maxDiasAntiguo;
}

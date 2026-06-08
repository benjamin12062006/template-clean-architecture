/**
 * @module EstadisticasPolicy
 *
 * Politicas de flujo del modulo estadisticas.
 * Evaluan condiciones de negocio ANTES de ejecutar un use case.
 *
 * Regla: una policy devuelve Result. Si rechaza, el use case no se ejecuta.
 */

import type { Result } from '@shared/result/result';
import { ok, err } from '@shared/result/result';
import { ApplicationFailure } from '@shared/failures/application-failure';

export type EstadisticasPolicyFailure = ReturnType<
  typeof ApplicationFailure.policyRejected
>;

/**
 * Verifica que el filtro de categoria sea valido si se provee.
 */
export function validateCategoriaFilter(
  categoria: string | undefined,
): Result<void, EstadisticasPolicyFailure> {
  // Policy = regla previa del flujo; si falla, el use case corta antes del gateway.
  if (categoria !== undefined && categoria.trim().length === 0) {
    return err(
      ApplicationFailure.policyRejected(
        'ValidateCategoriaFilter',
        'La categoria no puede ser un string vacio',
      ),
    );
  }
  return ok(undefined);
}

/**
 * @module ClientEnv
 *
 * Variables de entorno publicas (NEXT_PUBLIC_*).
 * Valida en arranque que las variables requeridas existen.
 * Lanza un error claro si falta algo — falla rapido, falla visible.
 *
 * Uso: importar `clientEnv` donde se necesite configuracion de cliente.
 */

import { invariantDefined } from '@shared/utils/invariant';

// ---------------------------------------------------------------------------
// Schema de variables de entorno del cliente
// ---------------------------------------------------------------------------

export type ClientEnv = Readonly<{
  readonly apiBaseUrl: string;
  readonly appEnv: 'development' | 'staging' | 'production';
}>;

// ---------------------------------------------------------------------------
// Lectura y validacion
// ---------------------------------------------------------------------------

function loadClientEnv(): ClientEnv {
  const apiBaseUrl = invariantDefined(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    'NEXT_PUBLIC_API_BASE_URL es requerida. Agrega esta variable a .env.local',
  );

  const rawEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'development';
  const appEnv = (['development', 'staging', 'production'] as const).find(
    (e) => e === rawEnv,
  ) ?? 'development';

  return { apiBaseUrl, appEnv };
}

// ---------------------------------------------------------------------------
// Singleton — se evalua una vez al importar
// ---------------------------------------------------------------------------

export const clientEnv: ClientEnv = loadClientEnv();

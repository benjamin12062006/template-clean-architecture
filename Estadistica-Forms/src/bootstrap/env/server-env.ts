/**
 * @module ServerEnv
 *
 * Variables de entorno server-only (sin NEXT_PUBLIC_).
 * Solo se importa en contextos de servidor (route.ts, server components, actions).
 * Nunca importar desde componentes cliente.
 */

import { invariantDefined } from '@shared/utils/invariant';

export type ServerEnv = Readonly<{
  readonly apiBaseUrl: string;
  readonly apiSecretKey?: string;
  readonly nodeEnv: string;
}>;

function loadServerEnv(): ServerEnv {
  // En el futuro: validar secrets de BFF, claves de servicios internos, etc.
  const apiBaseUrl = invariantDefined(
    process.env.API_BASE_URL,
    'API_BASE_URL debe estar definida para runtime server-only',
  );
  const apiSecretKey = process.env.API_SECRET_KEY;
  const nodeEnv = invariantDefined(
    process.env.NODE_ENV,
    'NODE_ENV debe estar definido',
  );

  return { apiBaseUrl, apiSecretKey, nodeEnv };
}

export const serverEnv: ServerEnv = loadServerEnv();

/**
 * @module ServerEnv
 *
 * Variables de entorno server-only (sin NEXT_PUBLIC_).
 * Solo se importa en contextos de servidor (route.ts, server components, actions).
 * Nunca importar desde componentes cliente.
 */

import { invariantDefined } from '@shared/utils/invariant';

export type ServerEnv = Readonly<{
  readonly apiSecretKey?: string;
  readonly nodeEnv: string;
}>;

function loadServerEnv(): ServerEnv {
  // En el futuro: validar secrets de BFF, claves de servicios internos, etc.
  const apiSecretKey = process.env.API_SECRET_KEY;
  const nodeEnv = invariantDefined(
    process.env.NODE_ENV,
    'NODE_ENV debe estar definido',
  );

  return { apiSecretKey, nodeEnv };
}

export const serverEnv: ServerEnv = loadServerEnv();

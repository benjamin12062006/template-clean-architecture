/**
 * @module server
 *
 * Runtime de servidor para bridges server-only.
 * Expone un cliente HTTP y la configuracion del entorno de servidor para BFFs,
 * route handlers o futuros server actions.
 */

import { createHttpClient } from '@shared/http/http-client';

import { serverEnv } from './env/server-env';

export function createServerHttpClient() {
  return createHttpClient({
    baseUrl: serverEnv.apiBaseUrl,
    defaultHeaders: {
      Accept: 'application/json',
    },
    defaultTimeoutMs: 12_000,
  });
}

export const serverRuntime = {
  env: serverEnv,
  httpClient: createServerHttpClient(),
} as const;

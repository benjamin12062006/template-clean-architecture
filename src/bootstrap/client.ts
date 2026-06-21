/**
 * @module client
 *
 * Punto de arranque del cliente.
 * Crea el HttpClient compartido con la configuracion de entorno.
 * Lo exporta para que los composition roots lo reciban como dependencia.
 */

import { createHttpClient } from '@shared/http/http-client';
import { clientEnv } from './env/client-env';

export const sharedHttpClient = createHttpClient({
  baseUrl: clientEnv.apiBaseUrl,
  defaultHeaders: {
    Accept: 'application/json',
  },
  defaultTimeoutMs: 12_000,
});

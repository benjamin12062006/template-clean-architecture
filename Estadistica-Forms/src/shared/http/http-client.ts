/**
 * @module HttpClient
 *
 * Implementacion base del HttpClientPort usando fetch nativo.
 * Esta es la unica implementacion concreta en shared/ — los adapters la reciben inyectada.
 *
 * Responsabilidades:
 *  - Serializar/deserializar JSON
 *  - Manejar timeouts via AbortController
 *  - Traducir errores de red a InfrastructureFailure
 *  - Nunca decidir logica de negocio
 */

import { Result, ok, err } from '../result/result';
import { InfrastructureFailure } from '../failures/infrastructure-failure';
import type {
  HttpClientPort,
  HttpRequestConfig,
  HttpResponse,
  HttpHeaders,
} from './http-types';

// ---------------------------------------------------------------------------
// Config base
// ---------------------------------------------------------------------------

export type HttpClientConfig = Readonly<{
  readonly baseUrl: string;
  readonly defaultHeaders?: HttpHeaders;
  readonly defaultTimeoutMs?: number;
}>;

// ---------------------------------------------------------------------------
// Implementacion
// ---------------------------------------------------------------------------

export function createHttpClient(config: HttpClientConfig): HttpClientPort {
  const { baseUrl, defaultHeaders = {}, defaultTimeoutMs = 15_000 } = config;

  async function request<T>(
    req: HttpRequestConfig,
  ): Promise<Result<HttpResponse<T>, InfrastructureFailure>> {
    const url = req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`;
    const timeoutMs = req.timeoutMs ?? defaultTimeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const signal = req.signal ?? controller.signal;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
      ...req.headers,
    };

    let response: Response;

    try {
      response = await fetch(url, {
        method: req.method,
        headers,
        body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
        signal,
      });
    } catch (e) {
      clearTimeout(timer);
      if (e instanceof DOMException && e.name === 'AbortError') {
        return err(InfrastructureFailure.network(url, e));
      }
      return err(InfrastructureFailure.network(url, e));
    } finally {
      clearTimeout(timer);
    }

    const responseHeaders: HttpHeaders = Object.fromEntries(
      response.headers.entries(),
    );

    if (!response.ok) {
      let body: unknown;
      try { body = await response.json(); } catch { body = undefined; }
      return err(InfrastructureFailure.http(response.status, url, body));
    }

    let data: T;
    try {
      const text = await response.text();
      data = text ? (JSON.parse(text) as T) : (undefined as T);
    } catch (e) {
      return err(InfrastructureFailure.parse(url, e));
    }

    return ok({
      status: response.status,
      headers: responseHeaders,
      data,
      url,
    });
  }

  return {
    request,
    get: (url, cfg) => request({ method: 'GET', url, ...cfg }),
    post: (url, body, cfg) => request({ method: 'POST', url, body, ...cfg }),
    put: (url, body, cfg) => request({ method: 'PUT', url, body, ...cfg }),
    patch: (url, body, cfg) => request({ method: 'PATCH', url, body, ...cfg }),
    delete: (url, cfg) => request({ method: 'DELETE', url, ...cfg }),
  };
}

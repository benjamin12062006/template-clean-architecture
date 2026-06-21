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

import { Result, ok, err, isErr } from '../result/result';
import { InfrastructureFailure } from '../failures/infrastructure-failure';
import type {
  HttpClientPort,
  HttpRequestConfig,
  HttpResponse,
  HttpHeaders,
} from './http-types';
import {
  buildHeaders,
  fetchWithTimeout,
  readErrorBody,
  readJsonBody,
  toHttpHeaders,
} from './http-client/helpers';

// ---------------------------------------------------------------------------
// Config base
// ---------------------------------------------------------------------------

export type HttpClientConfig = Readonly<{
  // URL base usada cuando la request trae rutas relativas como '/api/resources'.
  readonly baseUrl: string;
  // Headers globales del cliente; si no se pasan, empiezan como objeto vacio.
  readonly defaultHeaders?: HttpHeaders;
  // Timeout global; cada request puede sobreescribirlo con req.timeoutMs.
  readonly defaultTimeoutMs?: number;
}>;

// ---------------------------------------------------------------------------
// Implementacion
// ---------------------------------------------------------------------------

export function createHttpClient(config: HttpClientConfig): HttpClientPort {
  const { baseUrl, defaultHeaders = {}, defaultTimeoutMs = 15_000 } = config;

  function buildUrl(rawUrl: string): string {
    // Si rawUrl ya es absoluta, por ejemplo 'https://api.com/users',
    // no se combina con baseUrl.
    if (rawUrl.startsWith('http')) return rawUrl;
    // Si rawUrl es relativa, por ejemplo '/api/resources',
    // se resuelve contra baseUrl, por ejemplo 'http://localhost:3000'.
    return new URL(rawUrl, baseUrl).toString();
  }

  async function request<T>(
    req: HttpRequestConfig,
  ): Promise<Result<HttpResponse<T>, InfrastructureFailure>> {
    const url = buildUrl(req.url);
    // Usa el timeout propio de esta request si existe; si no, usa el default.
    const timeoutMs = req.timeoutMs ?? defaultTimeoutMs;
    // Combina Content-Type, headers globales y headers especificos de la request.
    const headers = buildHeaders(defaultHeaders, req.headers);

    // Ejecuta el fetch real. Si falla red/timeout/cancelacion, vuelve como Err.
    const responseResult = await fetchWithTimeout(url, req, headers, timeoutMs);
    if (isErr(responseResult)) return responseResult;

    // response es la respuesta cruda de fetch: status, ok, headers, text/json, etc.
    const response = responseResult.value;
    const responseHeaders = toHttpHeaders(response.headers);

    // response.ok es true solo para status 200-299. Con !response.ok capturamos 4xx/5xx.
    if (!response.ok) {
      const body = await readErrorBody(response);
      // Guardamos status/url/body para que capas superiores sepan que endpoint fallo y por que.
      return err(InfrastructureFailure.http(response.status, url, body));
    }

    // T es el tipo esperado por quien llamo: get<User[]>(), get<ResourceApiDto[]>(), etc.
    const dataResult = await readJsonBody<T>(response, url);
    if (isErr(dataResult)) return dataResult;

    // El Ok cumple HttpResponse<T>: metadata HTTP + data ya parseada.
    return ok({
      status: response.status,
      headers: responseHeaders,
      data: dataResult.value,
      url,
    });
  }

  return {
    // request es el metodo base; los demas son atajos que arman HttpRequestConfig.
    request,
    get: (url, cfg) => request({ method: 'GET', url, ...cfg }),
    post: (url, body, cfg) => request({ method: 'POST', url, body, ...cfg }),
    put: (url, body, cfg) => request({ method: 'PUT', url, body, ...cfg }),
    patch: (url, body, cfg) => request({ method: 'PATCH', url, body, ...cfg }),
    delete: (url, cfg) => request({ method: 'DELETE', url, ...cfg }),
  };
}

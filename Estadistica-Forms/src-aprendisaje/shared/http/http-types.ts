/**
 * @module HttpTypes
 *
 * Tipos base para el cliente HTTP del shared kernel.
 * Ninguna feature debe usar fetch crudo directamente —
 * todo IO HTTP entra por un port y su adapter usa este cliente.
 */

// ---------------------------------------------------------------------------
// Method
// ---------------------------------------------------------------------------

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export type HttpHeaders = Readonly<Record<string, string>>;

export type HttpRequestConfig = Readonly<{
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers?: HttpHeaders;
  readonly body?: unknown;
  readonly timeoutMs?: number;
  readonly signal?: AbortSignal;
}>;

// ---------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------

export type HttpResponse<T = unknown> = Readonly<{
  readonly status: number;
  readonly headers: HttpHeaders;
  readonly data: T;
  readonly url: string;
}>;

// ---------------------------------------------------------------------------
// Client port (contrato — la implementacion va en infrastructure)
// ---------------------------------------------------------------------------

import type { Result } from '../result/result';
import type { InfrastructureFailure } from '../failures/infrastructure-failure';

/**
 * Puerto del cliente HTTP compartido.
 * Todos los adapters de gateway lo reciben por injeccion.
 */
export interface HttpClientPort {
  request<T>(config: HttpRequestConfig): Promise<Result<HttpResponse<T>, InfrastructureFailure>>;
  get<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<Result<HttpResponse<T>, InfrastructureFailure>>;
  post<T>(url: string, body: unknown, config?: Partial<HttpRequestConfig>): Promise<Result<HttpResponse<T>, InfrastructureFailure>>;
  put<T>(url: string, body: unknown, config?: Partial<HttpRequestConfig>): Promise<Result<HttpResponse<T>, InfrastructureFailure>>;
  patch<T>(url: string, body: unknown, config?: Partial<HttpRequestConfig>): Promise<Result<HttpResponse<T>, InfrastructureFailure>>;
  delete<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<Result<HttpResponse<T>, InfrastructureFailure>>;
}

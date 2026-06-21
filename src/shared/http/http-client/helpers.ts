import { Result, ok, err } from '../../result/result';
import { InfrastructureFailure } from '../../failures/infrastructure-failure';
import type { HttpHeaders, HttpRequestConfig } from '../http-types';

export function buildHeaders(
  defaultHeaders: HttpHeaders,
  requestHeaders?: HttpHeaders,
): Record<string, string> {
  return {
    // Siempre asumimos JSON por defecto.
    'Content-Type': 'application/json',
    // Copia headers globales del cliente, por ejemplo Authorization.
    ...defaultHeaders,
    // Copia headers de esta request; si repite una clave, gana por estar al final.
    ...requestHeaders,
  };
}

export async function fetchWithTimeout(
  url: string,
  req: HttpRequestConfig,
  headers: Record<string, string>,
  timeoutMs: number,
): Promise<Result<Response, InfrastructureFailure>> {
  // AbortController es el control que puede cancelar el fetch.
  const controller = new AbortController();
  // Cuando pasa timeoutMs, abort() marca la signal como cancelada.
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  // Si la request trae una signal externa, se usa esa; si no, se usa la interna.
  const signal = req.signal ?? controller.signal;

  try {
    // fetch devuelve un Response crudo; todavia no es la data de negocio.
    const response = await fetch(url, {
      method: req.method,
      headers,
      // Solo serializamos body cuando existe; GET normalmente no manda body.
      body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
      // fetch queda escuchando esta signal para poder cancelarse.
      signal,
    });

    return ok(response);
  } catch (e) {
    // Errores de red, timeout o cancelacion se traducen a InfrastructureFailure.
    return err(InfrastructureFailure.network(url, e));
  } finally {
    // Siempre limpiamos el timer para no dejar trabajo pendiente.
    clearTimeout(timer);
  }
}

export function toHttpHeaders(headers: Headers): HttpHeaders {
  // Headers de fetch no es un objeto plano; entries() da pares y fromEntries los vuelve objeto.
  return Object.fromEntries(headers.entries());
}

export async function readErrorBody(response: Response): Promise<unknown> {
  try {
    // Algunas APIs devuelven detalles del error en JSON: message, code, etc.
    return await response.json();
  } catch {
    // Si el body viene vacio o no es JSON, no rompemos el flujo de error.
    return undefined;
  }
}

export async function readJsonBody<T>(
  response: Response,
  url: string,
): Promise<Result<T, InfrastructureFailure>> {
  try {
    const text = await response.text();
    // JSON.parse no sabe el tipo real; as T le dice a TypeScript "tratame esto como T".
    // Esto no valida runtime, solo mantiene el contrato tipado del cliente.
    return ok(text ? (JSON.parse(text) as T) : (undefined as T));
  } catch (e) {
    // Si el JSON no se puede parsear, el fallo tambien es de infraestructura.
    return err(InfrastructureFailure.parse(url, e));
  }
}

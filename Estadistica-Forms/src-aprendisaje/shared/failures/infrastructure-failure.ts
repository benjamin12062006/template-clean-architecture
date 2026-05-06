/**
 * @module InfrastructureFailure
 *
 * Failures tecnicos de la capa de infrastructure.
 * Representan errores de IO, red, storage, dispositivo.
 * El adapter traduce el error tecnico en este tipo antes de devolverlo.
 */

export type InfrastructureFailureKind =
  | 'NETWORK_ERROR'
  | 'HTTP_ERROR'
  | 'PARSE_ERROR'
  | 'STORAGE_ERROR'
  | 'DEVICE_ERROR'
  | 'SERIALIZATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN_INFRASTRUCTURE';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export type NetworkError = Readonly<{
  readonly kind: 'NETWORK_ERROR';
  readonly url?: string;
  readonly cause?: unknown;
}>;

export type HttpError = Readonly<{
  readonly kind: 'HTTP_ERROR';
  readonly status: number;
  readonly url: string;
  readonly body?: unknown;
}>;

export type ParseError = Readonly<{
  readonly kind: 'PARSE_ERROR';
  readonly source: string;
  readonly cause?: unknown;
}>;

export type StorageError = Readonly<{
  readonly kind: 'STORAGE_ERROR';
  readonly operation: 'read' | 'write' | 'delete' | 'clear';
  readonly key?: string;
  readonly cause?: unknown;
}>;

export type DeviceError = Readonly<{
  readonly kind: 'DEVICE_ERROR';
  readonly capability: string;
  readonly cause?: unknown;
}>;

export type SerializationError = Readonly<{
  readonly kind: 'SERIALIZATION_ERROR';
  readonly data?: unknown;
  readonly cause?: unknown;
}>;

export type RateLimitedFailure = Readonly<{
  readonly kind: 'RATE_LIMITED';
  readonly retryAfterMs?: number;
}>;

export type ServiceUnavailableFailure = Readonly<{
  readonly kind: 'SERVICE_UNAVAILABLE';
  readonly service: string;
}>;

export type UnknownInfrastructureFailure = Readonly<{
  readonly kind: 'UNKNOWN_INFRASTRUCTURE';
  readonly cause: unknown;
}>;

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

export type InfrastructureFailure =
  | NetworkError
  | HttpError
  | ParseError
  | StorageError
  | DeviceError
  | SerializationError
  | RateLimitedFailure
  | ServiceUnavailableFailure
  | UnknownInfrastructureFailure;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export const InfrastructureFailure = {
  network: (url?: string, cause?: unknown): NetworkError => ({
    kind: 'NETWORK_ERROR',
    url,
    cause,
  }),

  http: (status: number, url: string, body?: unknown): HttpError => ({
    kind: 'HTTP_ERROR',
    status,
    url,
    body,
  }),

  parse: (source: string, cause?: unknown): ParseError => ({
    kind: 'PARSE_ERROR',
    source,
    cause,
  }),

  storage: (
    operation: StorageError['operation'],
    key?: string,
    cause?: unknown,
  ): StorageError => ({
    kind: 'STORAGE_ERROR',
    operation,
    key,
    cause,
  }),

  device: (capability: string, cause?: unknown): DeviceError => ({
    kind: 'DEVICE_ERROR',
    capability,
    cause,
  }),

  serialization: (data?: unknown, cause?: unknown): SerializationError => ({
    kind: 'SERIALIZATION_ERROR',
    data,
    cause,
  }),

  rateLimited: (retryAfterMs?: number): RateLimitedFailure => ({
    kind: 'RATE_LIMITED',
    retryAfterMs,
  }),

  serviceUnavailable: (service: string): ServiceUnavailableFailure => ({
    kind: 'SERVICE_UNAVAILABLE',
    service,
  }),

  unknown: (cause: unknown): UnknownInfrastructureFailure => ({
    kind: 'UNKNOWN_INFRASTRUCTURE',
    cause,
  }),
} as const;

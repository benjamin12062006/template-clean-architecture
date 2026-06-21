export const INFRASTRUCTURE_FAILURE_KIND = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  DEVICE_ERROR: 'DEVICE_ERROR',
  SERIALIZATION_ERROR: 'SERIALIZATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNKNOWN_INFRASTRUCTURE: 'UNKNOWN_INFRASTRUCTURE',
} as const;

export type InfrastructureFailureKind =
 (typeof INFRASTRUCTURE_FAILURE_KIND)[keyof typeof INFRASTRUCTURE_FAILURE_KIND];

export type NetworkError = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.NETWORK_ERROR;
  readonly url?: string;
  readonly cause?: unknown;
}>;

export type HttpError = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.HTTP_ERROR;
  readonly status: number;
  readonly url: string;
  readonly body?: unknown;
}>;

export type ParseError = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.PARSE_ERROR;
  readonly source: string;
  readonly cause?: unknown;
}>;

export type StorageError = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.STORAGE_ERROR;
  readonly operation: 'READ' | 'WRITE' | 'DELETE' | 'UPDATE';
  readonly key?: string;
  readonly cause?: unknown;
}>;

export type DeviceError = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.DEVICE_ERROR;
  readonly capability: string;
  readonly cause?: unknown;
}>;

export type SerializationError = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.SERIALIZATION_ERROR;
  readonly data?: unknown;
  readonly cause?: unknown;
}>;

export type RateLimitedFailure = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.RATE_LIMITED;
  readonly retryAfterMs?: number;
}>;

export type ServiceUnavailableFailure = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.SERVICE_UNAVAILABLE;
  readonly service: string;
}>;

export type UnknownInfrastructureFailure = Readonly<{
  readonly kind: typeof INFRASTRUCTURE_FAILURE_KIND.UNKNOWN_INFRASTRUCTURE;
  readonly cause: unknown;
}>;

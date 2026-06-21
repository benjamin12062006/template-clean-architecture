import type {
  DeviceError,
  HttpError,
  NetworkError,
  ParseError,
  RateLimitedFailure,
  SerializationError,
  ServiceUnavailableFailure,
  StorageError,
  UnknownInfrastructureFailure,
} from './variants';
import { INFRASTRUCTURE_FAILURE_KIND } from './variants';

export const InfrastructureFailure = {
  network: (url?: string, cause?: unknown): NetworkError => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.NETWORK_ERROR,
    url,
    cause,
  }),

  http: (status: number, url: string, body?: unknown): HttpError => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.HTTP_ERROR,
    status,
    url,
    body,
  }),

  parse: (source: string, cause?: unknown): ParseError => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.PARSE_ERROR,
    source,
    cause,
  }),

  storage: (
    operation: StorageError['operation'],
    key?: string,
    cause?: unknown,
  ): StorageError => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.STORAGE_ERROR,
    operation,
    key,
    cause,
  }),

  device: (capability: string, cause?: unknown): DeviceError => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.DEVICE_ERROR,
    capability,
    cause,
  }),

  serialization: (data?: unknown, cause?: unknown): SerializationError => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.SERIALIZATION_ERROR,
    data,
    cause,
  }),

  rateLimited: (retryAfterMs?: number): RateLimitedFailure => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.RATE_LIMITED,
    retryAfterMs,
  }),

  serviceUnavailable: (service: string): ServiceUnavailableFailure => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.SERVICE_UNAVAILABLE,
    service,
  }),

  unknown: (cause: unknown): UnknownInfrastructureFailure => ({
    kind: INFRASTRUCTURE_FAILURE_KIND.UNKNOWN_INFRASTRUCTURE,
    cause,
  }),
} as const;

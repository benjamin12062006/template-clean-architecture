/**
 * @module Shared — Barrel export
 *
 * Punto de entrada unico para el shared kernel.
 * Todo lo que se importe de @shared debe venir de aqui.
 */

// Result
export { Result, ok, err, isOk, isErr } from './result/result';
export type { Result as ResultType, Ok, Err } from './result/result';

// Failures
export { DomainFailure } from './failures/domain-failure';
export { ApplicationFailure } from './failures/application-failure';
export { InfrastructureFailure } from './failures/infrastructure-failure';
export { UiFailure } from './failures/ui-failure';
export type {
  DomainFailure as DomainFailureType,
  DomainFailureKind,
} from './failures/domain-failure';
export type {
  ApplicationFailure as ApplicationFailureType,
  ApplicationFailureKind,
} from './failures/application-failure';
export type {
  InfrastructureFailure as InfrastructureFailureType,
  InfrastructureFailureKind,
} from './failures/infrastructure-failure';
export type {
  UiFailure as UiFailureType,
  UiFailureKind,
} from './failures/ui-failure';

// Types
export type { Brand, Unbranded, NonEmptyString, EmailString, PositiveNumber, IsoTimestamp } from './types/primitive';
export { makeBrandedId, toNonEmptyString, toEmailString, toPositiveNumber, nowIsoTimestamp, toIsoTimestamp } from './types/primitive';

export type { Nullable, Optional, Maybe } from './types/nullable';
export { isNull, isDefined, isUndefined, mapNullable, getOrDefault, toArray } from './types/nullable';

export { AsyncState } from './types/async-state';
export type { AsyncState as AsyncStateType, IdleState, LoadingState, SuccessState, FailureState } from './types/async-state';

// HTTP
export type { HttpClientPort, HttpRequestConfig, HttpResponse, HttpHeaders, HttpMethod } from './http/http-types';
export { createHttpClient } from './http/http-client';
export type { HttpClientConfig } from './http/http-client';

// Utils
export { assertNever } from './utils/assert-never';
export { identity, constant, noop, pipe } from './utils/identity';
export { invariant, invariantDefined } from './utils/invariant';

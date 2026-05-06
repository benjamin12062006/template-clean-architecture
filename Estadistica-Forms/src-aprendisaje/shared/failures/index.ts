/**
 * @module Failures — Barrel export
 *
 * Exporta todas las failures del shared kernel desde un solo punto.
 */

export type {
  DomainFailure as DomainFailureType,
  DomainFailureKind,
} from './domain-failure';
export { DomainFailure } from './domain-failure';

export type {
  ApplicationFailure as ApplicationFailureType,
  ApplicationFailureKind,
} from './application-failure';
export { ApplicationFailure } from './application-failure';

export type {
  InfrastructureFailure as InfrastructureFailureType,
  InfrastructureFailureKind,
} from './infrastructure-failure';
export { InfrastructureFailure } from './infrastructure-failure';

export type {
  UiFailure as UiFailureType,
  UiFailureKind,
} from './ui-failure';
export { UiFailure } from './ui-failure';

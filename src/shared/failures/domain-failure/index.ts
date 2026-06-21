import { DomainFailure as DomainFailureConstructors } from './constructors';
export type { DomainFailureKind } from './variants';
export { DOMAIN_FAILURE_KIND } from './variants';

export const DomainFailure = DomainFailureConstructors;
export type DomainFailure = ReturnType<(typeof DomainFailure)[keyof typeof DomainFailure]>;

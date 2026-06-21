import { InfrastructureFailure as InfrastructureFailureConstructors } from './constructors';
export type { InfrastructureFailureKind } from './variants';
export { INFRASTRUCTURE_FAILURE_KIND } from './variants';


export const InfrastructureFailure = InfrastructureFailureConstructors;
export type InfrastructureFailure =
  ReturnType<(typeof InfrastructureFailure)[keyof typeof InfrastructureFailure]>;

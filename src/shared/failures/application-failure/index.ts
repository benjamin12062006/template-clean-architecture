import { ApplicationFailure as ApplicationFailureConstructors } from './constructors';
export type { ApplicationFailureKind } from './variants';
export { APPLICATION_FAILURE_KIND } from './variants';

export const ApplicationFailure = ApplicationFailureConstructors;
export type ApplicationFailure =
  ReturnType<(typeof ApplicationFailure)[keyof typeof ApplicationFailure]>;

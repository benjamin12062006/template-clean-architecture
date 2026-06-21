import { UiFailure as UiFailureConstructors } from './constructors';
export type { UiFailureKind } from './variants';
export { UI_FAILURE_KIND } from './variants';

export const UiFailure = UiFailureConstructors;
export type UiFailure =
  ReturnType<(typeof UiFailure)[keyof typeof UiFailure]>;

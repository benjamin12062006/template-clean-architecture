/**
 * @module CreateFormulariosModule — Composition Root (placeholder)
 */

import type { HttpClientPort } from '@shared/http/http-types';

export type FormulariosModule = Readonly<{
  readonly _placeholder: true;
}>;

type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
}>;

export function createFormulariosModule(
  deps: CompositionDeps,
): FormulariosModule {
  void deps;
  return { _placeholder: true };
}

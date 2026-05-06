/**
 * @module CreateConfiguracionModule — Composition Root (placeholder)
 */

import type { HttpClientPort } from '@shared/http/http-types';

export type ConfiguracionModule = Readonly<{
  readonly _placeholder: true;
}>;

type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
}>;

export function createConfiguracionModule(
  deps: CompositionDeps,
): ConfiguracionModule {
  void deps;
  return { _placeholder: true };
}

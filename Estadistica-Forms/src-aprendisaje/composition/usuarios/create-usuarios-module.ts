/**
 * @module CreateUsuariosModule — Composition Root (placeholder)
 */

import type { HttpClientPort } from '@shared/http/http-types';

export type UsuariosModule = Readonly<{
  readonly _placeholder: true;
}>;

type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
}>;

export function createUsuariosModule(deps: CompositionDeps): UsuariosModule {
  void deps;
  return { _placeholder: true };
}

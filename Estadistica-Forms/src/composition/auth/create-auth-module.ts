/**
 * @module CreateAuthModule — Composition Root (placeholder)
 *
 * Composition root del modulo auth.
 * Se expande cuando auth tenga su feature vertical completa.
 */

import type { HttpClientPort } from '@shared/http/http-types';

export type AuthModule = Readonly<{
  // Se expande con: controller, store
  readonly _placeholder: true;
}>;

type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
}>;

export function c(deps: CompositionDeps): AuthModule {
  void deps;
  return { _placeholder: true };
}

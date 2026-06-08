/**
 * @module CreateConfiguracionModule — Composition Root (placeholder)
 */

import type { HttpClientPort } from '@shared/http/http-types';

// Esto representa lo que el modulo configuracion va a exponer hacia app/.
// Ahora mismo es placeholder porque configuracion todavia no tiene controller/store/use cases.
export type ConfiguracionModule = Readonly<{ 
  // Marca temporal para devolver algo tipado mientras el modulo no esta implementado.
  readonly _placeholder: true;
}>;

// Dependencias externas que el modulo necesita para armarse.
// httpClient viene desde bootstrap/client o bootstrap/server y cumple HttpClientPort.
type CompositionDeps = Readonly<{
  readonly httpClient: HttpClientPort;
}>;

// Factory/composition root del modulo configuracion.
// Recibe dependencias concretas y devuelve el modulo ya armado.
export function createConfiguracionModule(
  deps: CompositionDeps,
): ConfiguracionModule {
  // Evita warning de variable no usada mientras httpClient todavia no se conecta a adapters reales.
  void deps;
  // Valor temporal. En el futuro aqui se devolverian controller, store, etc.
  return { _placeholder: true };
}

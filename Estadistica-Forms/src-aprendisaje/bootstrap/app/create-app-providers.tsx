/**
 * @module CreateAppProviders
 *
 * Proveedor raiz de la aplicacion.
 * Monta providers globales de React (query client, theme, etc.)
 * Solo estructura y providers — sin logica de negocio.
 */

'use client';

import type { ReactNode } from 'react';

type Props = Readonly<{
  readonly children: ReactNode;
}>;

/**
 * AppProviders — provider raiz.
 * Agregar aqui: ThemeProvider, QueryClientProvider, ToastProvider, etc.
 */
export function AppProviders({ children }: Props) {
  return (
    <>
      {/* Aqui iran los providers globales en Fase 4 */}
      {children}
    </>
  );
}

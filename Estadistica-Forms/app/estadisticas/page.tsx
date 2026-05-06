'use client';

import { useState } from 'react';

import { sharedHttpClient } from '@bootstrap/client';
import { createEstadisticasModule } from '@composition/estadisticas/create-estadisticas-module';
import { EstadisticasPageView } from '@modules/estadisticas/presentation/views/estadisticas-page.view';

export default function EstadisticasPage() {
  const [estadisticasModule] = useState(() =>
    createEstadisticasModule({
      httpClient: sharedHttpClient,
    }),
  );

  return (
    <EstadisticasPageView
      controller={estadisticasModule.controller}
      store={estadisticasModule.store}
    />
  );
}

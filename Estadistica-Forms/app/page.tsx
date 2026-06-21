'use client';

import { useState } from 'react';

import { sharedHttpClient } from '@bootstrap/client';
import { createResourceModule } from '@composition/resource/create-resource-module';
import { ResourcePageView } from '@modules/resource/presentation/views/resource-page.view';

export default function HomePage() {
  const [resourceModule] = useState(() =>
    createResourceModule({
      httpClient: sharedHttpClient,
    }),
  );

  return (
    <ResourcePageView
      controller={resourceModule.controller}
    />
  );
}

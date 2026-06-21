/**
 * @module useResourcePage
 *
 * Hook React generico que conecta controller con estado local.
 */

'use client';

import { useEffect, useState } from 'react';
import { isErr } from '@shared/result/result';
import type { AsyncState } from '@shared/types/async-state';
import { AsyncState as AS } from '@shared/types/async-state';
import type { ResourceController } from '@modules/resource/presentation/controllers/resource.controller';
import type { LoadResourceOutput } from '@modules/resource/application/dto/output/load-resource.output';
import type { LoadResourceFailure } from '@modules/resource/domain/ports/inbound/load-resource.use-case';
import type { ResourceQuery } from '@modules/resource/domain/ports/outbound/resource-gateway.port';

type UseResourcePageReturn = Readonly<{
  readonly resources: AsyncState<LoadResourceOutput, LoadResourceFailure>;
  readonly onRefresh: (query?: ResourceQuery) => void;
}>;

type Deps = Readonly<{
  readonly controller: ResourceController;
  readonly initialQuery?: ResourceQuery;
  readonly autoLoad?: boolean;
}>;

async function loadResourcesIntoState(
  controller: ResourceController,
  setResources: (
    state: AsyncState<LoadResourceOutput, LoadResourceFailure>,
  ) => void,
  query?: ResourceQuery,
): Promise<void> {
  setResources(AS.loading());

  const result = await controller.loadResources(query);
  if (isErr(result)) {
    setResources(AS.failure(result.failure));
    return;
  }

  setResources(AS.success(result.value));
}

export function useResourcePage(deps: Deps): UseResourcePageReturn {
  const { autoLoad = false, controller, initialQuery } = deps;
  const [resources, setResources] = useState<
    AsyncState<LoadResourceOutput, LoadResourceFailure>
  >(() => AS.idle());

  useEffect(() => {
    if (!autoLoad) return;
    void loadResourcesIntoState(controller, setResources, initialQuery);
  }, [autoLoad, controller, initialQuery]);

  const onRefresh = (query?: ResourceQuery) => {
    void loadResourcesIntoState(controller, setResources, query);
  };

  return {
    resources,
    onRefresh,
  };
}

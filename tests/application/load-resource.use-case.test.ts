import assert from 'node:assert/strict';
import test from 'node:test';

import { createLoadResourceUseCase } from '@modules/resource/application/use-cases/load-resource.use-case';
import type { Resource } from '@modules/resource/domain/entities/resource.entity';
import type { ResourceGatewayPort } from '@modules/resource/domain/ports/outbound/resource-gateway.port';
import { ok } from '@shared/result/result';

function buildResource(): Resource {
  return {
    id: 'resource-1',
    data: {
      title: 'Example resource',
      value: 1520,
    },
  };
}

test('LoadResourceUseCase devuelve un output generico exitoso', async () => {
  const resource = buildResource();

  const gateway: ResourceGatewayPort = {
    async findAll() {
      return ok([resource]);
    },
  };

  const useCase = createLoadResourceUseCase({
    resourceGateway: gateway,
  });

  const result = await useCase.execute({
    query: {
      page: 1,
    },
  });

  assert.equal(result._tag, 'Ok');
  if (result._tag === 'Ok') {
    assert.equal(result.value.total, 1);
    assert.equal(result.value.items[0]?.id, 'resource-1');
    assert.deepEqual(result.value.items[0]?.data, resource.data);
  }
});

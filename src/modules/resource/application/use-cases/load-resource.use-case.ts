/**
 * @module LoadResourceUseCase
 *
 * Caso de uso generico de plantilla.
 */

import type { Result } from '@shared/result/result';
import { err, isErr } from '@shared/result/result';
import type {
  LoadResourceUseCase,
  LoadResourceFailure,
} from '@modules/resource/domain/ports/inbound/load-resource.use-case';
import type { LoadResourceInput } from '@modules/resource/application/dto/input/load-resource.input';
import type { LoadResourceOutput } from '@modules/resource/application/dto/output/load-resource.output';
import type { ResourceGatewayPort } from '@modules/resource/domain/ports/outbound/resource-gateway.port';

type Dependencies = Readonly<{
  readonly resourceGateway: ResourceGatewayPort;
}>;

export function createLoadResourceUseCase(
  deps: Dependencies,
): LoadResourceUseCase {
  return {
    async execute(
      input: LoadResourceInput,
    ): Promise<Result<LoadResourceOutput, LoadResourceFailure>> {
      const gatewayResult = await deps.resourceGateway.findAll(input.query);
      if (isErr(gatewayResult)) {
        return err(gatewayResult.failure);
      }

      const items = gatewayResult.value;

      return {
        _tag: 'Ok',
        value: {
          items,
          total: items.length,
          loadedAt: Date.now(),
        },
      };
    },
  };
}

/**
 * @module ResourceGatewayPort
 *
 * Contrato outbound generico para cargar recursos externos.
 */

import type { Result } from '@shared/result/result';
import type { InfrastructureFailure } from '@shared/failures/infrastructure-failure';
import type { Resource } from '@modules/resource/domain/entities/resource.entity';

export type ResourceQuery = Readonly<Record<string, string | number | boolean>>;

export interface ResourceGatewayPort {
  findAll(
    query?: ResourceQuery,
  ): Promise<Result<ReadonlyArray<Resource>, InfrastructureFailure>>;
}

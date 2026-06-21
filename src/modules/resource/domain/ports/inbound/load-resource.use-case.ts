/**
 * @module LoadResourceUseCase
 *
 * Contrato inbound generico para cargar recursos del modulo.
 */

import type { Result } from '@shared/result/result';
import type { ApplicationFailure as ApplicationFailureType } from '@shared/failures/application-failure';
import type { InfrastructureFailure as InfrastructureFailureType } from '@shared/failures/infrastructure-failure';
import type { LoadResourceInput } from '@modules/resource/application/dto/input/load-resource.input';
import type { LoadResourceOutput } from '@modules/resource/application/dto/output/load-resource.output';

export type LoadResourceFailure =
  | ApplicationFailureType
  | InfrastructureFailureType;

export interface LoadResourceUseCase {
  execute(
    input: LoadResourceInput,
  ): Promise<Result<LoadResourceOutput, LoadResourceFailure>>;
}

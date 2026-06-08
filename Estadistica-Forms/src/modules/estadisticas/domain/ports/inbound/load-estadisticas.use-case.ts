/**
 * @module LoadEstadisticasUseCase — Puerto inbound
 *
 * Contrato del caso de uso principal del modulo estadisticas.
 * Representa la intencion del usuario: cargar el listado de estadisticas.
 */

import type { Result } from '@shared/result/result';
import type { ApplicationFailure as ApplicationFailureType } from '@shared/failures/application-failure';
import type { InfrastructureFailure as InfrastructureFailureType } from '@shared/failures/infrastructure-failure';
import type { LoadEstadisticasInput } from '@modules/estadisticas/application/dto/input/load-estadisticas.input';
import type { LoadEstadisticasOutput } from '@modules/estadisticas/application/dto/output/load-estadisticas.output';
import type { EstadisticasDomainFailure } from '@modules/estadisticas/domain/failures/estadisticas-domain.failure';

export type LoadEstadisticasFailure =
  | EstadisticasDomainFailure
  | ApplicationFailureType
  | InfrastructureFailureType;

export interface LoadEstadisticasUseCase {
  // Inbound port = contrato de entrada que presentation puede invocar.
  execute(
    input: LoadEstadisticasInput,
  ): Promise<Result<LoadEstadisticasOutput, LoadEstadisticasFailure>>;
}

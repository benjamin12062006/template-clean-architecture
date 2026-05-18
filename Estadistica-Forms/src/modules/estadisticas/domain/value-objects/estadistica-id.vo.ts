/**
 * @module EstadisticaId — Value Object
 *
 * ID tipado para la entidad Estadistica.
 * Branded type previene mezclar IDs de distintas entidades.
 */

import type { Brand } from '@shared/types/primitive';
import { makeBrandedId } from '@shared/types/primitive';

export type EstadisticaId = Brand<string, 'EstadisticaId'>;

export const EstadisticaId = makeBrandedId<EstadisticaId>('EstadisticaId');

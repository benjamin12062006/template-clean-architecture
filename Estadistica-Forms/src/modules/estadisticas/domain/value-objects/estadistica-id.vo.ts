/**
 * @module EstadisticaId — Value Object
 *
 * ID tipado para la entidad Estadistica.
 * Branded type previene mezclar IDs de distintas entidades.
 */

import type { Brand } from '@shared/types/primitive';
import { makeBrandedId } from '@shared/types/primitive';

export type EstadisticaId = Brand<string, 'EstadisticaId'>;

// Value Object = tipo pequeño con significado propio; evita mezclar IDs por accidente.
export const EstadisticaId = makeBrandedId<EstadisticaId>();

/**
 * @module ResourceApiMapper
 *
 * Mapper generico para adaptar payloads remotos desconocidos a Resource.
 */

import { createResource, type Resource } from '@modules/resource/domain/entities/resource.entity';

export type ResourceApiDto = Readonly<Record<string, unknown>>;

export function mapResourceApiDtoToEntity(dto: ResourceApiDto): Resource {
  const id = typeof dto.id === 'string' ? dto.id : undefined;

  return createResource({
    id,
    data: dto,
  });
}

export function mapResourceApiDtoListToEntities(
  dtos: ReadonlyArray<ResourceApiDto>,
): ReadonlyArray<Resource> {
  return dtos.map(mapResourceApiDtoToEntity);
}

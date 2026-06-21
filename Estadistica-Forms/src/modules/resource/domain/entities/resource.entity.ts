/**
 * @module ResourceEntity
 *
 * Entidad generica para la plantilla del modulo.
 * No conoce el shape interno de la API ni de una feature concreta.
 */

export type Resource = Readonly<{
  readonly id: string;
  readonly data: ResourceData;
}>;

export type ResourceData = Readonly<Record<string, unknown>>;

export type CreateResourceInput = Readonly<{
  readonly id?: string;
  readonly data: ResourceData;
}>;

export function createResource(input: CreateResourceInput): Resource {
  return {
    id: input.id?.trim() || crypto.randomUUID(),
    data: input.data,
  };
}

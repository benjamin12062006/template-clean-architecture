/**
 * @module LoadResourceOutput
 */

import type { Resource } from '@modules/resource/domain/entities/resource.entity';

export type LoadResourceOutput = Readonly<{
  readonly items: ReadonlyArray<Resource>;
  readonly total: number;
  readonly loadedAt: number;
}>;

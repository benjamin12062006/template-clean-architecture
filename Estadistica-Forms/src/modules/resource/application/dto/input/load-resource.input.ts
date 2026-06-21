/**
 * @module LoadResourceInput
 */

import type { ResourceQuery } from '@modules/resource/domain/ports/outbound/resource-gateway.port';

export type LoadResourceInput = Readonly<{
  readonly query?: ResourceQuery;
}>;

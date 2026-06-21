/**
 * @module ResourcePageView
 *
 * Entrada React minima para la plantilla del modulo.
 */

'use client';

import type { ResourceController } from '../controllers/resource.controller';

type Props = Readonly<{
  readonly controller: ResourceController;
}>;

export function ResourcePageView({ controller }: Props) {
  void controller;

  return (
    <div>
      Hello world!
    </div>
  );
}

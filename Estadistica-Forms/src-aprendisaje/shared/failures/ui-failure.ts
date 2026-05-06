/**
 * @module UiFailure
 *
 * Failures especificos de la capa de presentacion.
 * Representan estados de UI que no pudieron cumplirse.
 */

export type UiFailureKind =
  | 'RENDER_ERROR'
  | 'FORM_INVALID'
  | 'NAVIGATION_BLOCKED'
  | 'PERMISSION_UI'
  | 'ASYNC_STATE_ERROR';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export type RenderError = Readonly<{
  readonly kind: 'RENDER_ERROR';
  readonly component: string;
  readonly cause?: unknown;
}>;

export type FormInvalidFailure = Readonly<{
  readonly kind: 'FORM_INVALID';
  readonly fields: ReadonlyArray<{ readonly field: string; readonly message: string }>;
}>;

export type NavigationBlockedFailure = Readonly<{
  readonly kind: 'NAVIGATION_BLOCKED';
  readonly reason: string;
  readonly from?: string;
  readonly to?: string;
}>;

export type PermissionUiFailure = Readonly<{
  readonly kind: 'PERMISSION_UI';
  readonly feature: string;
}>;

export type AsyncStateError = Readonly<{
  readonly kind: 'ASYNC_STATE_ERROR';
  readonly operation: string;
  readonly cause?: unknown;
}>;

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

export type UiFailure =
  | RenderError
  | FormInvalidFailure
  | NavigationBlockedFailure
  | PermissionUiFailure
  | AsyncStateError;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export const UiFailure = {
  render: (component: string, cause?: unknown): RenderError => ({
    kind: 'RENDER_ERROR',
    component,
    cause,
  }),

  formInvalid: (
    fields: ReadonlyArray<{ readonly field: string; readonly message: string }>,
  ): FormInvalidFailure => ({
    kind: 'FORM_INVALID',
    fields,
  }),

  navigationBlocked: (reason: string, from?: string, to?: string): NavigationBlockedFailure => ({
    kind: 'NAVIGATION_BLOCKED',
    reason,
    from,
    to,
  }),

  permission: (feature: string): PermissionUiFailure => ({
    kind: 'PERMISSION_UI',
    feature,
  }),

  asyncState: (operation: string, cause?: unknown): AsyncStateError => ({
    kind: 'ASYNC_STATE_ERROR',
    operation,
    cause,
  }),
} as const;

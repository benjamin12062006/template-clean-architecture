export const UI_FAILURE_KIND = {
  RENDER_ERROR: 'RENDER_ERROR',
  FORM_INVALID: 'FORM_INVALID',
  NAVIGATION_BLOCKED: 'NAVIGATION_BLOCKED',
  PERMISSION_UI: 'PERMISSION_UI',
  ASYNC_STATE_ERROR: 'ASYNC_STATE_ERROR',
} as const;

export type UiFailureKind =
  (typeof UI_FAILURE_KIND)[keyof typeof UI_FAILURE_KIND];

export type RenderError = Readonly<{
  readonly kind: typeof UI_FAILURE_KIND.RENDER_ERROR;
  readonly component: string;
  readonly cause?: unknown;
}>;

export type FormInvalidFailure = Readonly<{
  readonly kind: typeof UI_FAILURE_KIND.FORM_INVALID;
  readonly fields: ReadonlyArray<{ readonly field: string; readonly message: string }>;
}>;

export type NavigationBlockedFailure = Readonly<{
  readonly kind: typeof UI_FAILURE_KIND.NAVIGATION_BLOCKED;
  readonly reason: string;
  readonly from?: string;
  readonly to?: string;
}>;

export type PermissionUiFailure = Readonly<{
  readonly kind: typeof UI_FAILURE_KIND.PERMISSION_UI;
  readonly feature: string;
}>;

export type AsyncStateError = Readonly<{
  readonly kind: typeof UI_FAILURE_KIND.ASYNC_STATE_ERROR;
  readonly operation: string;
  readonly cause?: unknown;
}>;

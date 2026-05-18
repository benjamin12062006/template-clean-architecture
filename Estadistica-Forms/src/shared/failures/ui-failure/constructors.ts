import type {
  AsyncStateError,
  FormInvalidFailure,
  NavigationBlockedFailure,
  PermissionUiFailure,
  RenderError,
} from './variants';
import { UI_FAILURE_KIND } from './variants';

export const UiFailure = {
  render: (component: string, cause?: unknown): RenderError => ({
    kind: UI_FAILURE_KIND.RENDER_ERROR,
    component,
    cause,
  }),

  formInvalid: (
    fields: ReadonlyArray<{ readonly field: string; readonly message: string }>,
  ): FormInvalidFailure => ({
    kind: UI_FAILURE_KIND.FORM_INVALID,
    fields,
  }),

  navigationBlocked: (
    reason: string,
    from?: string,
    to?: string,
  ): NavigationBlockedFailure => ({
    kind: UI_FAILURE_KIND.NAVIGATION_BLOCKED,
    reason,
    from,
    to,
  }),

  permission: (feature: string): PermissionUiFailure => ({
    kind: UI_FAILURE_KIND.PERMISSION_UI,
    feature,
  }),

  asyncState: (operation: string, cause?: unknown): AsyncStateError => ({
    kind: UI_FAILURE_KIND.ASYNC_STATE_ERROR,
    operation,
    cause,
  }),
} as const;

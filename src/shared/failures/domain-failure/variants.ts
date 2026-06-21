export const DOMAIN_FAILURE_KIND = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVARIANT_VIOLATION: 'INVARIANT_VIOLATION',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
} as const;

export type DomainFailureKind = (typeof DOMAIN_FAILURE_KIND)[keyof typeof DOMAIN_FAILURE_KIND];

export type ValidationError = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.VALIDATION_ERROR;
  readonly field: string;
  readonly message: string;
  readonly value?: unknown;
}>;

export type InvariantViolation = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.INVARIANT_VIOLATION;
  readonly rule: string;
  readonly context?: Record<string, unknown>;
}>;

export type NotFoundFailure = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.NOT_FOUND;
  readonly entity: string;
  readonly id?: string;
}>;

export type UnauthorizedFailure = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.UNAUTHORIZED;
  readonly reason?: string;
}>;

export type ForbiddenFailure = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.FORBIDDEN;
  readonly resource: string;
  readonly action: string;
}>;

export type ConflictFailure = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.CONFLICT;
  readonly entity: string;
  readonly detail?: string;
}>;

export type PreconditionFailedFailure = Readonly<{
  readonly kind: typeof DOMAIN_FAILURE_KIND.PRECONDITION_FAILED;
  readonly precondition: string;
  readonly detail?: string;
}>;

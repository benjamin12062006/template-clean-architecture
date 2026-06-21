export const APPLICATION_FAILURE_KIND = {
  USE_CASE_NOT_FOUND: 'USE_CASE_NOT_FOUND',
  POLICY_REJECTED: 'POLICY_REJECTED',
  DEPENDENCY_FAILURE: 'DEPENDENCY_FAILURE',
  TIMEOUT: 'TIMEOUT',
  CANCELLED: 'CANCELLED',
  UNEXPECTED: 'UNEXPECTED',
} as const;
  
export type ApplicationFailureKind =
  (typeof APPLICATION_FAILURE_KIND)[keyof typeof APPLICATION_FAILURE_KIND];

export type UseCaseNotFoundFailure = Readonly<{
  readonly kind: typeof APPLICATION_FAILURE_KIND.USE_CASE_NOT_FOUND;
  readonly useCase: string;
}>;

export type PolicyRejectedFailure = Readonly<{
  readonly kind: typeof APPLICATION_FAILURE_KIND.POLICY_REJECTED;
  readonly policy: string;
  readonly reason: string;
}>;

export type DependencyFailure = Readonly<{
  readonly kind: typeof APPLICATION_FAILURE_KIND.DEPENDENCY_FAILURE;
  readonly dependency: string;
  readonly cause?: unknown;
}>;

export type TimeoutFailure = Readonly<{
  readonly kind: typeof APPLICATION_FAILURE_KIND.TIMEOUT;
  readonly operation: string;
  readonly limitMs?: number;
}>;

export type CancelledFailure = Readonly<{
  readonly kind: typeof APPLICATION_FAILURE_KIND.CANCELLED;
  readonly reason?: string;
}>;

export type UnexpectedApplicationFailure = Readonly<{
  readonly kind: typeof APPLICATION_FAILURE_KIND.UNEXPECTED;
  readonly cause: unknown;
  readonly context?: string;
}>;

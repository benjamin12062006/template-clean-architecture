/**
 * @module ApplicationFailure
 *
 * Failures que ocurren durante la coordinacion de un use case.
 * No son errores tecnicos ni de dominio; son errores de flujo de aplicacion.
 */

export type ApplicationFailureKind =
  | 'USE_CASE_NOT_FOUND'
  | 'POLICY_REJECTED'
  | 'DEPENDENCY_FAILURE'
  | 'TIMEOUT'
  | 'CANCELLED'
  | 'UNEXPECTED';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export type UseCaseNotFoundFailure = Readonly<{
  readonly kind: 'USE_CASE_NOT_FOUND';
  readonly useCase: string;
}>;

export type PolicyRejectedFailure = Readonly<{
  readonly kind: 'POLICY_REJECTED';
  readonly policy: string;
  readonly reason: string;
}>;

export type DependencyFailure = Readonly<{
  readonly kind: 'DEPENDENCY_FAILURE';
  readonly dependency: string;
  readonly cause?: unknown;
}>;

export type TimeoutFailure = Readonly<{
  readonly kind: 'TIMEOUT';
  readonly operation: string;
  readonly limitMs?: number;
}>;

export type CancelledFailure = Readonly<{
  readonly kind: 'CANCELLED';
  readonly reason?: string;
}>;

export type UnexpectedApplicationFailure = Readonly<{
  readonly kind: 'UNEXPECTED';
  readonly cause: unknown;
  readonly context?: string;
}>;

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

export type ApplicationFailure =
  | UseCaseNotFoundFailure
  | PolicyRejectedFailure
  | DependencyFailure
  | TimeoutFailure
  | CancelledFailure
  | UnexpectedApplicationFailure;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export const ApplicationFailure = {
  useCaseNotFound: (useCase: string): UseCaseNotFoundFailure => ({
    kind: 'USE_CASE_NOT_FOUND',
    useCase,
  }),

  policyRejected: (policy: string, reason: string): PolicyRejectedFailure => ({
    kind: 'POLICY_REJECTED',
    policy,
    reason,
  }),

  dependencyFailure: (dependency: string, cause?: unknown): DependencyFailure => ({
    kind: 'DEPENDENCY_FAILURE',
    dependency,
    cause,
  }),

  timeout: (operation: string, limitMs?: number): TimeoutFailure => ({
    kind: 'TIMEOUT',
    operation,
    limitMs,
  }),

  cancelled: (reason?: string): CancelledFailure => ({
    kind: 'CANCELLED',
    reason,
  }),

  unexpected: (cause: unknown, context?: string): UnexpectedApplicationFailure => ({
    kind: 'UNEXPECTED',
    cause,
    context,
  }),
} as const;

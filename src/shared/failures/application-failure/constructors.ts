import type {
  CancelledFailure,
  DependencyFailure,
  PolicyRejectedFailure,
  TimeoutFailure,
  UnexpectedApplicationFailure,
  UseCaseNotFoundFailure,
} from './variants';
import { APPLICATION_FAILURE_KIND } from './variants';

export const ApplicationFailure = {
  useCaseNotFound: (useCase: string): UseCaseNotFoundFailure => ({
    kind: APPLICATION_FAILURE_KIND.USE_CASE_NOT_FOUND,
    useCase,
  }),

  policyRejected: (policy: string, reason: string): PolicyRejectedFailure => ({
    kind: APPLICATION_FAILURE_KIND.POLICY_REJECTED,
    policy,
    reason,
  }),

  dependencyFailure: (dependency: string, cause?: unknown): DependencyFailure => ({
    kind: APPLICATION_FAILURE_KIND.DEPENDENCY_FAILURE,
    dependency,
    cause,
  }),

  timeout: (operation: string, limitMs?: number): TimeoutFailure => ({
    kind: APPLICATION_FAILURE_KIND.TIMEOUT,
    operation,
    limitMs,
  }),

  cancelled: (reason?: string): CancelledFailure => ({
    kind: APPLICATION_FAILURE_KIND.CANCELLED,
    reason,
  }),

  unexpected: (cause: unknown, context?: string): UnexpectedApplicationFailure => ({
    kind: APPLICATION_FAILURE_KIND.UNEXPECTED,
    cause,
    context,
  }),
} as const;

import type {
  ConflictFailure,
  ForbiddenFailure,
  InvariantViolation,
  NotFoundFailure,
  PreconditionFailedFailure,
  UnauthorizedFailure,
  ValidationError,
} from './variants';
import { DOMAIN_FAILURE_KIND } from './variants';

export const DomainFailure = {
  validation: (field: string, message: string, value?: unknown): ValidationError => ({
    kind: DOMAIN_FAILURE_KIND.VALIDATION_ERROR,
    field,
    message,
    value,
  }),

  invariant: (rule: string, context?: Record<string, unknown>): InvariantViolation => ({
    kind: DOMAIN_FAILURE_KIND.INVARIANT_VIOLATION,
    rule,
    context,
  }),

  notFound: (entity: string, id?: string): NotFoundFailure => ({
    kind: DOMAIN_FAILURE_KIND.NOT_FOUND,
    entity,
    id,
  }),

  unauthorized: (reason?: string): UnauthorizedFailure => ({
    kind: DOMAIN_FAILURE_KIND.UNAUTHORIZED,
    reason,
  }),

  forbidden: (resource: string, action: string): ForbiddenFailure => ({
    kind: DOMAIN_FAILURE_KIND.FORBIDDEN,
    resource,
    action,
  }),

  conflict: (entity: string, detail?: string): ConflictFailure => ({
    kind: DOMAIN_FAILURE_KIND.CONFLICT,
    entity,
    detail,
  }),

  preconditionFailed: (
    precondition: string,
    detail?: string,
  ): PreconditionFailedFailure => ({
    kind: DOMAIN_FAILURE_KIND.PRECONDITION_FAILED,
    precondition,
    detail,
  }),
} as const;

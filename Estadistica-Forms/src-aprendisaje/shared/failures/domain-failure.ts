/**
 * @module DomainFailure
 *
 * Failures que representan violaciones de reglas del dominio de UI.
 * Estas no son errores tecnicos; son reglas de negocio que no se cumplen.
 *
 * Regla: ningun DomainFailure contiene strings sueltos como unico discriminador.
 * Usa siempre una union discriminada con `kind`.
 */

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------

export type DomainFailureKind =
  | 'VALIDATION_ERROR'
  | 'INVARIANT_VIOLATION'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'PRECONDITION_FAILED';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export type ValidationError = Readonly<{
  readonly kind: 'VALIDATION_ERROR';
  readonly field: string;
  readonly message: string;
  readonly value?: unknown;
}>;

export type InvariantViolation = Readonly<{
  readonly kind: 'INVARIANT_VIOLATION';
  readonly rule: string;
  readonly context?: Record<string, unknown>;
}>;

export type NotFoundFailure = Readonly<{
  readonly kind: 'NOT_FOUND';
  readonly entity: string;
  readonly id?: string;
}>;

export type UnauthorizedFailure = Readonly<{
  readonly kind: 'UNAUTHORIZED';
  readonly reason?: string;
}>;

export type ForbiddenFailure = Readonly<{
  readonly kind: 'FORBIDDEN';
  readonly resource: string;
  readonly action: string;
}>;

export type ConflictFailure = Readonly<{
  readonly kind: 'CONFLICT';
  readonly entity: string;
  readonly detail?: string;
}>;

export type PreconditionFailedFailure = Readonly<{
  readonly kind: 'PRECONDITION_FAILED';
  readonly precondition: string;
  readonly detail?: string;
}>;

// ---------------------------------------------------------------------------
// Union
// ---------------------------------------------------------------------------

export type DomainFailure =
  | ValidationError
  | InvariantViolation
  | NotFoundFailure
  | UnauthorizedFailure
  | ForbiddenFailure
  | ConflictFailure
  | PreconditionFailedFailure;

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export const DomainFailure = {
  validation: (field: string, message: string, value?: unknown): ValidationError => ({
    kind: 'VALIDATION_ERROR',
    field,
    message,
    value,
  }),

  invariant: (rule: string, context?: Record<string, unknown>): InvariantViolation => ({
    kind: 'INVARIANT_VIOLATION',
    rule,
    context,
  }),

  notFound: (entity: string, id?: string): NotFoundFailure => ({
    kind: 'NOT_FOUND',
    entity,
    id,
  }),

  unauthorized: (reason?: string): UnauthorizedFailure => ({
    kind: 'UNAUTHORIZED',
    reason,
  }),

  forbidden: (resource: string, action: string): ForbiddenFailure => ({
    kind: 'FORBIDDEN',
    resource,
    action,
  }),

  conflict: (entity: string, detail?: string): ConflictFailure => ({
    kind: 'CONFLICT',
    entity,
    detail,
  }),

  preconditionFailed: (precondition: string, detail?: string): PreconditionFailedFailure => ({
    kind: 'PRECONDITION_FAILED',
    precondition,
    detail,
  }),
} as const;

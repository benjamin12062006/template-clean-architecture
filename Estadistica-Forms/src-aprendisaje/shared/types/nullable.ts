/**
 * @module Nullable
 *
 * Helpers para trabajar con valores que pueden ser nulos o indefinidos.
 * Evita usar `null | undefined` mezclados sin intencionalidad.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Un valor que puede ser nulo pero no indefinido. */
export type Nullable<T> = T | null;

/** Un valor que puede ser indefinido pero no nulo. */
export type Optional<T> = T | undefined;

/** Un valor que puede ser nulo o indefinido. */
export type Maybe<T> = T | null | undefined;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

export function isNull<T>(value: Nullable<T>): value is null {
  return value === null;
}

export function isDefined<T>(value: Maybe<T>): value is T {
  return value !== null && value !== undefined;
}

export function isUndefined<T>(value: Optional<T>): value is undefined {
  return value === undefined;
}

// ---------------------------------------------------------------------------
// Combinators
// ---------------------------------------------------------------------------

export function mapNullable<T, U>(
  value: Nullable<T>,
  fn: (v: T) => U,
): Nullable<U> {
  return value !== null ? fn(value) : null;
}

export function getOrDefault<T>(value: Maybe<T>, defaultValue: T): T {
  return isDefined(value) ? value : defaultValue;
}

export function toArray<T>(value: Maybe<T>): ReadonlyArray<T> {
  return isDefined(value) ? [value] : [];
}

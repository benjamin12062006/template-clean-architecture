/**
 * @module Primitive
 *
 * Tipos primitivos base y branded types para IDs.
 *
 * Branded types previenen mezclar un UserId con un FormId aunque ambos sean strings.
 * El compilador los trata como tipos distintos aunque el runtime sean strings iguales.
 */

// ---------------------------------------------------------------------------
// Brand infrastructure
// ---------------------------------------------------------------------------

declare const __brand: unique symbol;

/**
 * Brand<T, B> — crea un tipo nominal a partir de T con marca B.
 *
 * Uso:
 *   type UserId = Brand<string, 'UserId'>
 *   const id = 'abc123' as UserId   // cast explicito en el factory
 */
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * Extrae el tipo base de un branded type.
 */
export type Unbranded<T> = T extends Brand<infer Base, string> ? Base : T;

// ---------------------------------------------------------------------------
// Branded ID factory
// ---------------------------------------------------------------------------

/**
 * Crea un factory tipado para un branded ID.
 * Uso:
 *   const UserId = makeBrandedId<UserId>('UserId');
 *   const id = UserId.create('abc');
 *   UserId.value(id); // -> 'abc'
 */
export function makeBrandedId<T extends Brand<string, string>>(
  _brand: string,
): {
  create: (raw: string) => T;
  value: (id: T) => string;
  is: (raw: unknown) => raw is T;
} {
  void _brand;

  return {
    create: (raw: string) => raw as T,
    value: (id: T) => id as string,
    is: (raw: unknown): raw is T => typeof raw === 'string' && raw.length > 0,
  };
}

// ---------------------------------------------------------------------------
// Common primitives
// ---------------------------------------------------------------------------

/** String no vacio — no un tipo branded, sino una alias semantico. */
export type NonEmptyString = Brand<string, 'NonEmptyString'>;

export function toNonEmptyString(s: string): NonEmptyString | null {
  const trimmed = s.trim();
  return trimmed.length > 0 ? (trimmed as NonEmptyString) : null;
}

/** Email — no valida el formato completo, solo marca semanticamente. */
export type EmailString = Brand<string, 'EmailString'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function toEmailString(s: string): EmailString | null {
  return EMAIL_REGEX.test(s.trim()) ? (s.trim() as EmailString) : null;
}

/** Positivo — numero mayor que cero. */
export type PositiveNumber = Brand<number, 'PositiveNumber'>;

export function toPositiveNumber(n: number): PositiveNumber | null {
  return n > 0 ? (n as PositiveNumber) : null;
}

/** Timestamp ISO 8601 como string. */
export type IsoTimestamp = Brand<string, 'IsoTimestamp'>;

export function nowIsoTimestamp(): IsoTimestamp {
  return new Date().toISOString() as IsoTimestamp;
}

export function toIsoTimestamp(s: string): IsoTimestamp | null {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : (s as IsoTimestamp);
}

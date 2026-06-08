/**
 * @module TelemetryPort — Puerto outbound compartido
 *
 * Contrato de telemetria. Cada modulo puede recibir este puerto
 * y registrar eventos sin saber que implementacion usa.
 */

export interface TelemetryPort {
  // Telemetry observa el flujo; no cambia el negocio, solo registra eventos/errores/tiempos.
  trackEvent(name: string, properties?: Record<string, unknown>): void;
  trackError(error: unknown, context?: Record<string, unknown>): void;
  trackTiming(name: string, durationMs: number): void;
}

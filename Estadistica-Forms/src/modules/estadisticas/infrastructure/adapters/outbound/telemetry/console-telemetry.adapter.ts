/**
 * @module ConsoleTelemetryAdapter
 *
 * Implementacion placeholder de TelemetryPort via console.
 * En produccion se reemplaza por un adapter real (Datadog, Sentry, etc.)
 * sin tocar ningun otro archivo.
 */

import type { TelemetryPort } from '@modules/estadisticas/domain/ports/outbound/telemetry.port';

export function createConsoleTelemetryAdapter(): TelemetryPort {
  const telemetry: TelemetryPort = {
    trackEvent(name, properties) {
      console.info(`[Telemetry] Event: ${name}`, properties ?? {});
    },
    trackError(error, context) {
      console.error('[Telemetry] Error:', error, context ?? {});
    },
    trackTiming(name, durationMs) {
      console.info(`[Telemetry] Timing: ${name} = ${durationMs}ms`);
    },
  };

  return telemetry;
}

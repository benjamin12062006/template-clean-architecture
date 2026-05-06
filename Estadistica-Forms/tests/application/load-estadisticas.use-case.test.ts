import assert from 'node:assert/strict';
import test from 'node:test';

import { createLoadEstadisticasUseCase } from '@modules/estadisticas/application/use-cases/load-estadisticas.use-case';
import { createEstadistica } from '@modules/estadisticas/domain/entities/estadistica.entity';
import type { EstadisticasGatewayPort } from '@modules/estadisticas/domain/ports/outbound/estadisticas-gateway.port';
import type { TelemetryPort } from '@modules/estadisticas/domain/ports/outbound/telemetry.port';
import { EstadisticaId } from '@modules/estadisticas/domain/value-objects/estadistica-id.vo';
import { ok } from '@shared/result/result';
import type { IsoTimestamp } from '@shared/types/primitive';

function buildEntity() {
  const result = createEstadistica({
    id: EstadisticaId.create('estadistica-1'),
    titulo: 'Ingresos mensuales',
    valor: 1520,
    unidad: 'USD',
    categoria: 'ventas',
    fechaActualizacion: new Date().toISOString() as IsoTimestamp,
    tendencia: 'ALZA',
  });

  if (result._tag === 'Err') {
    throw new Error(`Test fixture invalido: ${JSON.stringify(result.failure)}`);
  }

  return result.value;
}

function buildTelemetry(spy: { events: string[] }): TelemetryPort {
  return {
    trackEvent(name) {
      spy.events.push(name);
    },
    trackError() {
      throw new Error('No se esperaba trackError en este escenario');
    },
    trackTiming() {},
  };
}

test('LoadEstadisticasUseCase devuelve un output DTO exitoso', async () => {
  const entity = buildEntity();
  const telemetrySpy = { events: [] as string[] };

  const gateway: EstadisticasGatewayPort = {
    async findAll() {
      return ok([entity]);
    },
    async findById() {
      return ok(entity);
    },
  };

  const useCase = createLoadEstadisticasUseCase({
    estadisticasGateway: gateway,
    telemetry: buildTelemetry(telemetrySpy),
  });

  const result = await useCase.execute({
    filter: {
      categoria: 'ventas',
    },
  });

  assert.equal(result._tag, 'Ok');
  if (result._tag === 'Ok') {
    assert.equal(result.value.total, 1);
    assert.equal(result.value.items[0]?.titulo, 'Ingresos mensuales');
  }
  assert.ok(telemetrySpy.events.includes('estadisticas.load.success'));
});

test('LoadEstadisticasUseCase rechaza una categoria vacia por policy', async () => {
  let gatewayCalled = false;

  const gateway: EstadisticasGatewayPort = {
    async findAll() {
      gatewayCalled = true;
      return ok([]);
    },
    async findById() {
      gatewayCalled = true;
      return ok(buildEntity());
    },
  };

  const useCase = createLoadEstadisticasUseCase({
    estadisticasGateway: gateway,
    telemetry: {
      trackEvent() {},
      trackError() {},
      trackTiming() {},
    },
  });

  const result = await useCase.execute({
    filter: {
      categoria: '   ',
    },
  });

  assert.equal(result._tag, 'Err');
  if (result._tag === 'Err') {
    assert.equal(result.failure.kind, 'POLICY_REJECTED');
  }
  assert.equal(gatewayCalled, false);
});

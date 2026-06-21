# Mapa Rapido DDD de Resource

Este archivo resume el flujo generico del modulo `resource`.

## Entrada

1. [app/page.tsx](app/page.tsx)
   Crea el modulo con `createResourceModule(...)` y pasa el `controller` a la view.

2. [src/composition/resource/create-resource-module.ts](src/composition/resource/create-resource-module.ts)
   Conecta adapter, use case y controller.

## Presentation

3. [src/modules/resource/presentation/views/resource-page.view.tsx](src/modules/resource/presentation/views/resource-page.view.tsx)
   Entrada React minima. Recibe el controller y mantiene el render sin logica visual de dominio.

4. [src/modules/resource/presentation/ui/hooks/use-resource-page.ts](src/modules/resource/presentation/ui/hooks/use-resource-page.ts)
   Conecta React con el controller y mantiene `AsyncState`.

5. [src/modules/resource/presentation/controllers/resource.controller.ts](src/modules/resource/presentation/controllers/resource.controller.ts)
   Puente fino entre presentation y application.

## Application

6. [src/modules/resource/domain/ports/inbound/load-resource.use-case.ts](src/modules/resource/domain/ports/inbound/load-resource.use-case.ts)
   Contrato inbound del caso de uso.

7. [src/modules/resource/application/use-cases/load-resource.use-case.ts](src/modules/resource/application/use-cases/load-resource.use-case.ts)
   Ejecuta el flujo generico: pide recursos al gateway y arma el output.

8. [src/modules/resource/application/dto/input/load-resource.input.ts](src/modules/resource/application/dto/input/load-resource.input.ts)
   Define la entrada generica (`query`).

9. [src/modules/resource/application/dto/output/load-resource.output.ts](src/modules/resource/application/dto/output/load-resource.output.ts)
   Define el resultado exitoso.

## Domain

10. [src/modules/resource/domain/entities/resource.entity.ts](src/modules/resource/domain/entities/resource.entity.ts)
    Entidad generica: `id` + `data`.

11. [src/modules/resource/domain/ports/outbound/resource-gateway.port.ts](src/modules/resource/domain/ports/outbound/resource-gateway.port.ts)
    Contrato outbound para cargar recursos.

## Infrastructure

12. [src/modules/resource/infrastructure/http-resource-gateway.adapter.ts](src/modules/resource/infrastructure/http-resource-gateway.adapter.ts)
    Adapter HTTP generico. El endpoint se inyecta desde composicion.

13. [src/modules/resource/infrastructure/resource-api.mapper.ts](src/modules/resource/infrastructure/resource-api.mapper.ts)
    Convierte payloads `Record<string, unknown>` a `Resource`.

## Recorrido Mental

`page.tsx -> composition -> view -> hook -> controller -> use case -> gateway port -> http adapter -> http client -> mapper -> resource output`

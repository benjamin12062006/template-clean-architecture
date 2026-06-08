# Mapa Rapido DDD de Estadisticas

Este archivo es una chuleta corta para seguir el flujo real del modulo `estadisticas` de extremo a extremo.

## Entrada Rapida

### Pantalla web
1. [app/estadisticas/page.tsx](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/app/estadisticas/page.tsx)
   Aqui entra Next.js a la pagina. Crea el modulo con `createEstadisticasModule(...)` y le pasa el `controller` a la view.

2. [src/bootstrap/client.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/bootstrap/client.ts)
   Aqui nace `sharedHttpClient`. Esto pertenece al arranque comun del cliente, no al modulo en si.

3. [src/composition/estadisticas/create-estadisticas-module.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/composition/estadisticas/create-estadisticas-module.ts)
   Aqui se une todo:
   - infrastructure adapter
   - telemetry adapter
   - use case
   - controller

## Flujo De Presentation

4. [src/modules/estadisticas/presentation/views/estadisticas-page.view.tsx](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/presentation/views/estadisticas-page.view.tsx)
   JSX puro. Decide que mostrar segun `vm.status`.

5. [src/modules/estadisticas/presentation/ui/hooks/use-estadisticas-page.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/presentation/ui/hooks/use-estadisticas-page.ts)
   Hook simple de React. Llama al controller, guarda estado local y convierte `Result` a `AsyncState`.

6. [src/modules/estadisticas/presentation/controllers/estadisticas.controller.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/presentation/controllers/estadisticas.controller.ts)
   Puente fino entre UI y application. No hace fetch ni guarda estado.

7. [src/modules/estadisticas/presentation/view-models/estadisticas-page.view-model.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/presentation/view-models/estadisticas-page.view-model.ts)
   Traduce el estado tecnico a lenguaje visual:
   - `loading`
   - `failure`
   - `empty`
   - `success`

## Flujo De Application

8. [src/modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/domain/ports/inbound/load-estadisticas.use-case.ts)
   Este es el contrato del caso de uso. Presentation llama este puerto por medio del controller.

9. [src/modules/estadisticas/application/use-cases/load-estadisticas.use-case.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/application/use-cases/load-estadisticas.use-case.ts)
   Aqui vive el cerebro del flujo:
   - valida policy
   - usa el gateway port
   - registra telemetry
   - arma el output

10. [src/modules/estadisticas/application/dto/input/load-estadisticas.input.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/application/dto/input/load-estadisticas.input.ts)
    Define que entra al caso de uso.

11. [src/modules/estadisticas/application/dto/output/load-estadisticas.output.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/application/dto/output/load-estadisticas.output.ts)
    Define como se ve el resultado exitoso.

12. [src/modules/estadisticas/application/policies/estadisticas.policy.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/application/policies/estadisticas.policy.ts)
    Regla previa del flujo. Si falla, el use case corta antes de ir al gateway.

## Domain Y Ports

13. [src/modules/estadisticas/domain/entities/estadistica.entity.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/domain/entities/estadistica.entity.ts)
    Entidad central del modulo.

14. [src/modules/estadisticas/domain/value-objects/estadistica-id.vo.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/domain/value-objects/estadistica-id.vo.ts)
    Value object del ID.

15. [src/modules/estadisticas/domain/ports/outbound/estadisticas-gateway.port.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/domain/ports/outbound/estadisticas-gateway.port.ts)
    Contrato que application usa para pedir datos sin conocer HTTP.

16. [src/modules/estadisticas/domain/ports/outbound/telemetry.port.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/domain/ports/outbound/telemetry.port.ts)
    Contrato para registrar eventos, errores y tiempos sin acoplarse a una herramienta concreta.

## Infrastructure

17. [src/modules/estadisticas/infrastructure/adapters/outbound/gateway/http-estadisticas-gateway.adapter.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/infrastructure/adapters/outbound/gateway/http-estadisticas-gateway.adapter.ts)
    Implementa el gateway port. Aqui si se hace IO real.

18. [src/modules/estadisticas/infrastructure/adapters/outbound/mappers/estadisticas-api.mapper.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/infrastructure/adapters/outbound/mappers/estadisticas-api.mapper.ts)
    Traduce API DTO -> Entity. Esta es la frontera anti-acoplamiento.

19. [src/modules/estadisticas/infrastructure/adapters/outbound/telemetry/console-telemetry.adapter.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/modules/estadisticas/infrastructure/adapters/outbound/telemetry/console-telemetry.adapter.ts)
    Implementacion concreta del `TelemetryPort`.

20. [src/shared/http/http-client.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/src/shared/http/http-client.ts)
    Cliente HTTP compartido que realmente ejecuta el request.

## API Demo De Next

21. [app/api/estadisticas/route.ts](/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms/app/api/estadisticas/route.ts)
    Este endpoint demo devuelve el JSON que consume el gateway HTTP.

## Recorrido Mental En Una Linea

`page.tsx -> bootstrap/client -> composition -> view -> hook -> controller -> use case -> gateway port -> http adapter -> http client -> /api/estadisticas/route.ts -> mapper -> entity -> output -> view model -> view`

## Lo Mas Importante Para No Olvidarte

- `presentation` muestra y adapta, no decide negocio.
- `controller` solo pasa la intencion de la UI a `application`.
- `use case` es donde realmente se ejecuta el flujo.
- `port` es contrato, no implementacion.
- `adapter` es implementacion concreta.
- `output` no hace nada; solo describe el exito.
- `composition` es el enchufe donde todo se conecta.
- `bootstrap` crea dependencias compartidas antes de llegar al modulo.

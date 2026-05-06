> [!IMPORTANT]
> **INSTRUCCIÓN PARA EL AGENTE:**
> Este documento es la guía maestra de construcción del proyecto.
> Cuando el usuario pida avanzar o aprender sobre una fase, debes:
>
> 1. **Enseñar primero.** Antes de escribir código, explica con profundidad el propósito de cada archivo, su responsabilidad y por qué existe en ese lugar de la arquitectura. Usa un tono profesional, serio y pedagógico.
> 2. **Respetar el orden.** Nunca saltar fases. Si una fase anterior no está completa, adviértelo.
> 3. **No resumir ni trivializar.** El usuario quiere entender la arquitectura DDD/Clean a fondo, no solo copiar archivos.
> 4. **Verificar antes de avanzar.** Cada fase debe compilar y cumplir su meta de salida antes de pasar a la siguiente.
> 5. **Referencia obligatoria.** Siempre citar la fase y sección de este documento cuando enseñes.

# SRC_BUILD_ORDER.md

## Objetivo

Este documento define el orden oficial para construir `src/` desde cero en:

`/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms`

La idea no es crear muchas carpetas rapido. La idea es construir una base que:

1. Compile en cada fase.
2. Sea facil de leer.
3. Mantenga separadas UI, logica, IO y wiring.
4. Permita crecer feature por feature sin rehacer la base.

---

## Regla Madre

Siempre construir en este orden:

1. `shared`
2. `bootstrap`
3. `composition`
4. `modules/<feature>`
5. `app/` como puente
6. `tests`

Nunca empezar por componentes visuales grandes sin antes tener:

1. `Result`
2. `failures`
3. puertos
4. caso de uso
5. store/controller

---

## Estructura Final Esperada

```text
Estadistica-Forms/
  app/
  public/
  src/
    shared/
    bootstrap/
    composition/
    modules/
    ui/
  tests/
```

---

## Orden Exacto De Construccion

## Fase 0. Base Minima Del Proyecto

Crear primero:

1. `src/`
2. `src/shared/`
3. `src/bootstrap/`
4. `src/composition/`
5. `src/modules/`
6. `src/ui/`

No crear todavia una feature completa.

Meta de salida:

1. `tsconfig` resuelve aliases.
2. `src/` existe con estructura vacia clara.
3. El proyecto compila aunque casi no haga nada.

---

## Fase 1. Shared Kernel

Construir primero el lenguaje comun del sistema.

### 1.1 Result

Crear:

1. `src/shared/result/result.ts`

Debe incluir:

1. `Ok`
2. `Err`
3. `Result<T, F>`
4. `ok(...)`
5. `err(...)`
6. `isOk(...)`
7. `isErr(...)`

No meter logica de negocio aqui.

### 1.2 Failures

Crear:

1. `src/shared/failures/domain-failure.ts`
2. `src/shared/failures/application-failure.ts`
3. `src/shared/failures/infrastructure-failure.ts`
4. `src/shared/failures/ui-failure.ts`
5. `src/shared/failures/index.ts`

Debe quedar resuelto:

1. errores de validacion
2. errores de policy
3. errores de red/http/parse
4. errores de UI

### 1.3 Types

Crear:

1. `src/shared/types/nullable.ts`
2. `src/shared/types/primitive.ts`
3. `src/shared/types/async-state.ts`

Solo tipos realmente compartidos.

### 1.4 Utils

Crear:

1. `src/shared/utils/invariant.ts`
2. `src/shared/utils/assert-never.ts`
3. `src/shared/utils/identity.ts`

### 1.5 HTTP Base

Crear:

1. `src/shared/http/http-types.ts`
2. `src/shared/http/http-client.ts`

Este cliente base debe:

1. encapsular `fetch`
2. usar `Result`
3. traducir a `InfrastructureFailure`
4. no saber nada de ninguna feature

### 1.6 Barrel compartido

Crear:

1. `src/shared/index.ts`

Meta de salida de Fase 1:

1. Todo el `shared` compila.
2. No depende de ninguna feature.
3. Ya existe el idioma tecnico del proyecto.

---

## Fase 2. Bootstrap Tecnico

Aqui se construye el arranque tecnico, no negocio.

### 2.1 Env

Crear:

1. `src/bootstrap/env/client-env.ts`
2. `src/bootstrap/env/server-env.ts`

Debe resolver:

1. variables publicas
2. variables server-only
3. validacion temprana de env

### 2.2 Cliente y servidor

Crear:

1. `src/bootstrap/client.ts`
2. `src/bootstrap/server.ts`

Responsabilidad:

1. instanciar cliente HTTP compartido
2. exponer runtime por entorno

### 2.3 Providers globales

Crear:

1. `src/bootstrap/app/create-app-providers.tsx`

Aunque sea pequeno, su rol debe quedar claro:

1. theme
2. futuros providers
3. nada de negocio

Meta de salida de Fase 2:

1. la app ya tiene arranque tecnico claro
2. env y cliente HTTP no se crean en cualquier archivo

---

## Fase 3. UI Compartida

Construir solo UI tonta y reusable.

Crear:

1. `src/ui/components/common/button.component.tsx`
2. `src/ui/components/common/input.component.tsx`
3. `src/ui/components/common/card.component.tsx`
4. `src/ui/components/common/modal.component.tsx`
5. `src/ui/components/layout/main-layout.component.tsx`
6. `src/ui/index.ts`

Reglas:

1. no llamar APIs
2. no importar entidades de dominio
3. no meter casos de uso
4. no meter estados de feature

Meta de salida:

1. existe una UI base limpia para reutilizar
2. los componentes visuales no cargan logica de negocio

---

## Fase 4. Composition Root

Crear composition roots vacios primero:

1. `src/composition/auth/create-auth-module.ts`
2. `src/composition/formularios/create-formularios-module.ts`
3. `src/composition/usuarios/create-usuarios-module.ts`
4. `src/composition/configuracion/create-configuracion-module.ts`
5. `src/composition/estadisticas/create-estadisticas-module.ts`

Orden interno de implementacion del primer root real:

1. definir entradas del root
2. instanciar adapters concretos
3. instanciar use cases
4. instanciar store
5. instanciar controller
6. devolver API publica del modulo

Regla:

1. `composition` conecta
2. `composition` no decide reglas de negocio

Meta de salida:

1. ya existe el lugar oficial para enchufar dependencias

---

## Fase 5. Primera Feature Piloto

La primera feature oficial debe ser una sola, no cuatro a la vez.

Feature piloto recomendada:

1. `estadisticas`

Crear primero solo la carpeta:

```text
src/modules/estadisticas/
  domain/
  application/
  infrastructure/
  presentation/
  index.ts
```

No llenar todo al mismo tiempo.

---

## Fase 6. Domain De La Feature

Crear en este orden:

1. `domain/value-objects/`
2. `domain/entities/`
3. `domain/rules/`
4. `domain/failures/`
5. `domain/ports/inbound/`
6. `domain/ports/outbound/`

### Orden recomendado real

1. `value-object` de ID
2. entidad principal
3. reglas de validacion
4. failure del modulo
5. contrato inbound del caso de uso
6. contrato outbound del gateway
7. contrato outbound de telemetry si hace falta

No hacer:

1. fetch
2. JSX
3. hooks React
4. localStorage

Meta de salida:

1. el dominio ya describe la feature sin framework

---

## Fase 7. Application De La Feature

Crear en este orden:

1. `application/dto/input/`
2. `application/dto/output/`
3. `application/policies/`
4. `application/use-cases/`
5. `application/services/` solo si aparece una necesidad real

Orden real:

1. input DTO
2. output DTO
3. policy de filtros o permisos de pantalla
4. caso de uso principal

El caso de uso debe:

1. recibir puertos por inyeccion
2. devolver `Result`
3. no llamar `fetch`
4. no renderizar

Meta de salida:

1. ya existe un flujo completo de negocio UI

---

## Fase 8. Infrastructure De La Feature

Crear en este orden:

1. `infrastructure/adapters/outbound/mappers/`
2. `infrastructure/adapters/outbound/gateway/`
3. `infrastructure/adapters/outbound/telemetry/`
4. `infrastructure/adapters/outbound/storage/`
5. `infrastructure/adapters/outbound/device/`

Orden real recomendado:

1. DTO remoto
2. mapper API -> entity
3. gateway HTTP
4. telemetry adapter
5. storage/device solo si la feature de verdad los necesita

Reglas:

1. la API remota nunca debe filtrarse cruda hacia arriba
2. todo debe pasar por mapper
3. los errores tecnicos se traducen

Meta de salida:

1. la feature ya puede hablar con el exterior

---

## Fase 9. Presentation De La Feature

Crear en este orden:

1. `presentation/state/`
2. `presentation/controllers/`
3. `presentation/view-models/`
4. `presentation/ui/components/`
5. `presentation/ui/hooks/`
6. `presentation/views/`
7. `presentation/ui/providers/` solo si hace falta

### Orden fino recomendado

1. store
2. controller
3. page view-model
4. card/grid components
5. hook de adaptacion React
6. view final de pantalla

Responsabilidad de cada pieza:

1. `state`
   guarda estado observable
2. `controllers`
   traducen acciones UI -> casos de uso -> cambios de estado
3. `view-models`
   traducen estado interno -> props renderizables
4. `ui/components`
   visual del modulo
5. `ui/hooks`
   conectan store/controller con React
6. `views`
   componen la pantalla final

Meta de salida:

1. la feature ya renderiza
2. la logica no esta mezclada dentro de un solo componente

---

## Fase 10. Bridge Con Next.js

Solo despues de tener la feature lista en `src/`, conectar `app/`.

Orden:

1. `app/layout.tsx`
2. `app/page.tsx`
3. `app/<feature>/page.tsx`
4. `app/api/.../route.ts` si hace falta mock o BFF local

Reglas:

1. `app/` no define reglas de negocio
2. `app/` no mapea DTOs remotos
3. `app/` no crea dependencias sueltas si existe `composition`

Meta de salida:

1. Next ya consume la arquitectura, no al reves

---

## Fase 11. Tests

Crear al menos esta estructura:

1. `tests/domain/`
2. `tests/application/`
3. `tests/infrastructure/`
4. `tests/presentation/`

Orden de tests:

1. entity/value object
2. policy
3. use case
4. mapper
5. controller/store si hace falta

Primer test obligatorio:

1. caso de uso principal exitoso
2. caso de uso principal rechazado por policy

---

## Fase 12. Skeleton De Otras Features

Solo cuando `estadisticas` ya este sana:

1. `auth`
2. `formularios`
3. `usuarios`
4. `configuracion`

Crear primero solo:

1. `index.ts`
2. carpetas
3. `.gitkeep` donde corresponda

No implementar logica de varias features a la vez.

---

## Checklist De Cierre Por Fase

Antes de pasar a la siguiente fase, revisar:

1. compila con `tsc --noEmit`
2. no hay imports rotos
3. no hay aliases sin configurar
4. no hay `any` implicitos innecesarios
5. no hay logica de negocio en `app/`
6. no hay `fetch` dentro de `presentation`
7. no hay DTO remoto escapando al dominio

---

## Orden De Construccion Resumido

Si manana tuvieras que rehacer `src/` completo, este es el orden corto:

1. aliases y estructura vacia
2. `shared/result`
3. `shared/failures`
4. `shared/types`
5. `shared/utils`
6. `shared/http`
7. `bootstrap/env`
8. `bootstrap/client`
9. `bootstrap/server`
10. `bootstrap/app/create-app-providers`
11. `ui` compartida
12. `composition/estadisticas`
13. `modules/estadisticas/domain`
14. `modules/estadisticas/application`
15. `modules/estadisticas/infrastructure`
16. `modules/estadisticas/presentation/state`
17. `modules/estadisticas/presentation/controllers`
18. `modules/estadisticas/presentation/view-models`
19. `modules/estadisticas/presentation/ui`
20. `modules/estadisticas/presentation/views`
21. `app/estadisticas/page.tsx`
22. `app/api/estadisticas/route.ts` si se necesita
23. `tests`
24. skeleton del resto de features

---

# AGENT.md

## Estado

Este archivo es la referencia oficial de arquitectura, planificacion y criterio
de construccion para el proyecto frontend ubicado en:

`/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms`

Todo lo que estaba antes en `documentation/` queda reemplazado por este
documento. Si en el futuro cambia una decision estructural, este archivo debe
actualizarse primero y luego el codigo.

---

## Objetivo Real Del Proyecto

Construir una base frontend en Next.js + TypeScript con arquitectura
hexagonal/DDD enfocada en UI, donde:

1. La UI visual quede separada de la logica.
2. La logica de negocio de frontend viva en `src/`.
3. Las integraciones con APIs remotas, storage, browser APIs y telemetry entren
   por puertos y adapters.
4. El codigo sea facil de leer, testear, mover y reemplazar.
5. La complejidad no se concentre en componentes, sino que se distribuya de
   forma ordenada entre capas pequenas y predecibles.

El objetivo no es "hacer codigo complejo". El objetivo es que la estructura
futura sea facil de gestionar, facil de cambiar y clara para cualquier nuevo
chat, agente o desarrollador.

---

## Principios No Negociables

1. Las dependencias siempre apuntan hacia adentro.
2. `app/` no contiene logica de negocio.
3. `presentation/ui` no llama APIs ni parsea respuestas remotas.
4. `application` expresa flujos; no renderiza ni usa React.
5. `domain` no importa React, Next, fetch, localStorage, Zustand ni SDKs.
6. `infrastructure` implementa contratos; no decide reglas de negocio.
7. `composition` es el unico lugar donde se conectan implementaciones concretas.
8. La UI domain de frontend no duplica reglas canonicas del sistema salvo
   validaciones de experiencia, flujo, estado local y pre-chequeos.
9. Las features deben ser navegables por carpeta, no por conocimiento tribal.
10. Si una decision rompe la claridad de capas, la decision esta mal aunque
    "funcione".

---

## Relacion Con Sistemas Externos

El frontend define su propia arquitectura y su propio orden interno:

`presentation -> application -> ports -> infrastructure -> composition`

Cuando el proyecto hable con APIs o servicios externos, se aplican estas
reglas:

1. El dominio del frontend modela reglas de experiencia, flujo, estado,
   validacion local, permisos de pantalla y coherencia de interaccion.
2. El frontend no comparte clases internas de otros sistemas por conveniencia.
3. El contrato con APIs o servicios remotos se expresa con DTOs remotos y
   mappers, no con acoplamiento directo entre modelos internos.
4. Toda integracion externa entra por puertos y adapters, aunque hoy exista un
   solo proveedor.

---

## Decisiones Canonicas De Estructura

La raiz funcional del producto sera:

`/Users/benji/Documents/PROYECTO1/NEXTJS/Estadistica-Forms`

Estructura canonica:

```text
Estadistica-Forms/
  app/
  public/
  src/
    modules/
    shared/
    composition/
    bootstrap/
    ui/
  tests/
  package.json
  tsconfig.json
  next.config.ts
```

### Rol de cada carpeta raiz

1. `app/`
   Entrada de Next.js App Router. Solo rutas, layouts, loading, error,
   `route.ts`, boundaries y puentes con `src/`.

2. `src/modules/`
   Features de negocio. Aqui vive casi toda la arquitectura real.

3. `src/shared/`
   Kernel compartido: `Result`, failures, utilidades puras, tipos base,
   cliente HTTP base, helpers de mapping y primitives transversales.

4. `src/composition/`
   Composition root por feature y por entorno. Conecta puertos con adapters y
   expone controladores o casos de uso a la capa superior.

5. `src/bootstrap/`
   Arranque y configuracion tecnica del frontend: env, registro de providers,
   bootstrap cliente/servidor, factories base.

6. `src/ui/`
   Solo UI compartida y tonta: componentes base, layout compartido y primitives
   visuales. No debe contener logica de negocio de feature.

7. `tests/`
   Tests por capa y por feature.

---

## Regla Principal De Navegacion

Si una duda futura es de:

1. Regla de flujo o negocio UI -> buscar en `domain/` o `application/`.
2. Llamada a API remota o storage -> buscar en `infrastructure/adapters/`.
3. Estado de pantalla o side effects de UI -> buscar en `presentation/`.
4. Wiring o inyeccion -> buscar en `composition/`.
5. Problema de pagina, layout o ruta -> buscar en `app/`.

Esto debe permitir ir directo al archivo correcto sin explorar todo el repo.

---

## Arquitectura Oficial Por Feature

Cada feature seguira este blueprint:

```text
src/modules/<feature>/
  domain/
    entities/
    value-objects/
    rules/
    ports/
      inbound/
      outbound/
    failures/
  application/
    use-cases/
    dto/
      input/
      output/
    policies/
    services/
  infrastructure/
    adapters/
      outbound/
        gateway/
        storage/
        device/
        telemetry/
        mappers/
  presentation/
    controllers/
    state/
    view-models/
    views/
    ui/
      components/
      hooks/
      providers/
  index.ts
```

### Decision oficial sobre `views` y `ui`

Ambas carpetas existiran y tienen roles distintos:

1. `presentation/views/`
   Composiciones de pantalla o secciones grandes consumidas por `app/`.

2. `presentation/ui/components/`
   Componentes visuales especificos del modulo.

3. `presentation/ui/hooks/`
   Hooks de adaptacion React para conectar store/controller con la UI.

4. `presentation/ui/providers/`
   Providers especificos del modulo si hicieran falta.

Con esto evitamos mezclar pagina, componente, store y logica en el mismo sitio.

---

## Reglas De Dependencia Por Capa

### `domain`

Debe contener:

1. Entidades y value objects de UI.
2. Reglas de coherencia local.
3. Contratos de puertos.
4. Failures de dominio del modulo.

No puede importar:

1. React.
2. Next.js.
3. Zustand.
4. Fetch/axios.
5. LocalStorage.
6. SDKs externos.

### `application`

Debe contener:

1. Casos de uso.
2. DTOs de entrada y salida.
3. Policies de flujo.
4. Servicios de coordinacion cuando el flujo una varios use cases o puertos.

Puede importar:

1. `domain`
2. `shared`

No puede importar:

1. React.
2. Next.js.
3. Adapters concretos.

### `infrastructure`

Debe contener:

1. Adapters concretos de salida.
2. Mappers de frontera.
3. Traduccion de errores tecnicos.
4. Implementaciones de puertos outbound.

Puede importar:

1. `domain`
2. `application`
3. `shared`
4. Librerias externas

### `presentation`

Debe contener:

1. Controladores de pantalla.
2. Estado de pantalla.
3. View models.
4. Views y componentes UI del modulo.

Puede importar:

1. `application`
2. `domain`
3. `shared`

No debe importar adapters concretos directamente.

### `composition`

Puede importar todo. Es la unica capa autorizada para unir:

1. Puertos
2. Adapters
3. Use cases
4. Controllers
5. Stores

### `app`

Debe ser delgada. Solo puede:

1. Resolver params de ruta.
2. Elegir layout.
3. Llamar a una view ya compuesta.
4. Montar boundaries de Next.

No debe implementar reglas ni llamadas directas a APIs remotas.

---

## Convenciones De Codigo En TypeScript

### Principio general

Usar "todo el poder de TypeScript" no significa inflar el codigo con clases
innecesarias. Significa usar tipos fuertes para que el diseno sea estable.

### Reglas oficiales

1. Usar `interface` para puertos.
2. Usar `type` para unions, DTOs simples y resultados discriminados.
3. Usar `readonly` por defecto en estructuras de datos.
4. Usar discriminated unions para failures y estados UI.
5. Usar branded types para IDs o value objects cuando aporte claridad.
6. Usar `never` para exhaustividad en switches.
7. Usar factories y funciones puras por defecto.
8. Usar clases solo cuando una abstraccion con estado o invariantes lo justifique
   de verdad.

### Cuadro de preferencia

1. Puertos -> `interface`
2. Use cases -> factory + `execute`
3. Controllers -> factory que devuelve objeto estable
4. View models -> funciones puras
5. Entities -> `type` o `interface` readonly
6. Value objects -> factory + validacion, o clase solo si el valor realmente
   gana con encapsulacion
7. Adapters -> clase o factory segun necesidad tecnica

---

## Nomenclatura Oficial

Archivos:

1. Usar `kebab-case`.
2. El sufijo debe comunicar la responsabilidad.

Ejemplos:

```text
load-estadisticas.use-case.ts
create-formulario.use-case.ts
estadistica.entity.ts
estadistica-id.vo.ts
estadisticas-gateway.port.ts
http-estadisticas-gateway.adapter.ts
estadisticas.controller.ts
estadisticas.store.ts
estadistica-card.view-model.ts
estadisticas-page.view.tsx
estadistica-card.component.tsx
```

Exports:

1. Tipos e interfaces -> `PascalCase`
2. Factories -> `createX`
3. Hooks -> `useX`
4. Constantes -> `SCREAMING_SNAKE_CASE` solo si son constantes reales

---

## Shared Kernel Oficial

`src/shared/` debera contener como minimo:

```text
src/shared/
  result/
    result.ts
  failures/
    domain-failure.ts
    application-failure.ts
    infrastructure-failure.ts
    ui-failure.ts
    index.ts
  http/
    http-client.ts
    http-types.ts
  types/
    primitive.ts
    nullable.ts
    async-state.ts
  utils/
    assert-never.ts
    identity.ts
    invariant.ts
```

### Resultado oficial

Todos los use cases deben trabajar con un `Result` tipado. Regla:

```text
execute(input) -> Promise<Result<Output, Failure>>
```

No usar excepciones crudas como contrato normal de aplicacion.

### Modelo minimo esperado

```text
Success<T>
FailureResult<F>
Result<T, F>
```

### Failures oficiales

1. `DomainFailure`
2. `ApplicationFailure`
3. `InfrastructureFailure`
4. `UiFailure`

Cada una debe ser una union discriminada clara, no un string suelto.

---

## Contratos Oficiales De Use Case

Todo caso de uso debera verse conceptualmente asi:

```ts
export interface LoadEstadisticasUseCase {
  execute(input: LoadEstadisticasInput): Promise<Result<LoadEstadisticasOutput, LoadEstadisticasFailure>>;
}
```

Implementacion recomendada:

```ts
type Dependencies = {
  estadisticasGateway: EstadisticasGatewayPort;
  telemetry: TelemetryPort;
};

export function createLoadEstadisticasUseCase(
  deps: Dependencies,
): LoadEstadisticasUseCase {
  return {
    async execute(input) {
      // flujo
    },
  };
}
```

Decision oficial:

1. Mantener `execute` como verbo estandar.
2. Un caso de uso por archivo.
3. Nada de UI en el caso de uso.
4. Nada de `fetch` en el caso de uso.

---

## Puertos Oficiales

### Inbound ports

Representan intenciones de la UI o del sistema:

1. `LoadDashboardMetricsUseCase`
2. `ListFormsUseCase`
3. `CreateFormDraftUseCase`
4. `PublishFormUseCase`
5. `AuthenticateSessionUseCase`

### Outbound ports

Representan necesidades externas:

1. `EstadisticasGatewayPort`
2. `FormulariosGatewayPort`
3. `SessionStorePort`
4. `ClockPort`
5. `TelemetryPort`
6. `FilePickerPort`
7. `NavigationPort` si mas adelante hiciera falta aislar navegacion compleja

Reglas:

1. Ningun puerto filtra tipos de librerias externas.
2. Ningun puerto devuelve responses crudas del servicio remoto.
3. Todo puerto estable debe hablar con DTOs internos o tipos compartidos.

---

## Adapters Oficiales

La primera version debera contemplar al menos estos adapters:

1. `http-<feature>-gateway.adapter.ts`
2. `browser-session-store.adapter.ts`
3. `system-clock.adapter.ts`
4. `console-telemetry.adapter.ts` como placeholder inicial

Reglas:

1. El adapter hace IO.
2. El adapter mapea DTO remoto -> modelo interno.
3. El adapter traduce error tecnico -> `InfrastructureFailure`.
4. El adapter no decide reglas de negocio.

---

## Presentacion Oficial

`presentation/` es donde mas disciplina necesitamos para no volver a una app
mezclada.

### `controllers/`

Responsabilidad:

1. Orquestar interaccion de pantalla.
2. Invocar use cases.
3. Traducir resultados a cambios de estado.
4. Coordinar side effects de UI.

No debe:

1. Renderizar JSX.
2. Llamar adapters directamente.
3. Parsear respuestas HTTP.

### `state/`

Responsabilidad:

1. Guardar estado observable de pantalla.
2. Exponer acciones simples de mutacion.

Regla oficial:

La logica async y de negocio no debe vivir en la store como regla general.
La store es un contenedor de estado. El controller decide el flujo.

### `view-models/`

Responsabilidad:

1. Convertir estado o modelos internos a props listas para UI.
2. Simplificar render.

### `views/`

Responsabilidad:

1. Componer la pantalla o seccion.
2. Conectar hooks del modulo.
3. Mantener la estructura visual de alto nivel.

### `ui/components/`

Responsabilidad:

1. Componentes visuales del modulo.
2. Deben ser tontos o casi tontos.

### `ui/hooks/`

Responsabilidad:

1. Adaptar controller/store a React.
2. Exponer datos y handlers listos para la view.

Regla:

Un hook de `presentation/ui/hooks` no debe contener llamadas HTTP ni reglas de
negocio distribuidas.

---

## UI Global Compartida

`src/ui/` seguira existiendo, pero con reglas muy estrictas.

Permitido:

1. Button
2. Input
3. Modal
4. Card
5. Layout base
6. Shared providers puramente visuales

No permitido:

1. Hooks de feature
2. Stores de feature
3. Logica de negocio
4. Integraciones con servicios remotos
5. Reglas de flujo

Si algo conoce el lenguaje del dominio de una feature, no pertenece a `src/ui`.

---

## `app/` De Next.js

Decision oficial:

`app/` es una capa de entrada, no el core de la aplicacion.

Reglas:

1. `page.tsx` debe delegar a `presentation/views/`.
2. `layout.tsx` solo estructura y providers globales.
3. `loading.tsx`, `error.tsx`, `not-found.tsx` son boundaries de framework.
4. `route.ts` solo si hace falta un BFF local, manejo de secretos, proxy,
   upload o agregacion server-side.
5. No meter logica de negocio en server actions sin antes decidir su lugar
   arquitectonico.

---

## Composition Root Oficial

Cada feature importante tendra su factory de composicion:

```text
src/composition/
  auth/
    create-auth-module.ts
  estadisticas/
    create-estadisticas-module.ts
  formularios/
    create-formularios-module.ts
  usuarios/
    create-usuarios-module.ts
```

Cada factory debe:

1. Instanciar adapters concretos.
2. Crear use cases.
3. Crear controller.
4. Crear store si hace falta.
5. Exponer un objeto simple para la capa superior.

Ejemplo conceptual:

```text
gateway -> use case -> controller -> hook/view
```

---

## Bootstrap Oficial

`src/bootstrap/` debera cubrir:

```text
src/bootstrap/
  env/
    client-env.ts
    server-env.ts
  app/
    create-app-providers.tsx
  client.ts
  server.ts
```

Responsabilidades:

1. Leer y validar variables de entorno.
2. Registrar providers globales.
3. Exponer configuracion base del runtime.

Variables previstas:

1. `NEXT_PUBLIC_API_BASE_URL`
2. Variables server-only futuras, si hubiese BFF local

---

## Features Iniciales Previstas

Hasta que producto defina otra cosa, este documento asume estas lineas:

1. `auth`
2. `estadisticas`
3. `formularios`
4. `usuarios`
5. `configuracion`

Si cambia el naming funcional, la arquitectura no cambia; solo cambian los
modulos concretos.

---

## Orden Oficial De Construccion

### Fase 0 - Base Tecnica

1. Limpiar starter actual.
2. Definir aliases de TS.
3. Endurecer `tsconfig` con `strict`.
4. Crear `src/`, `tests/`, `composition/`, `bootstrap/`, `shared/`.

### Fase 1 - Shared Kernel

1. `Result`
2. Failures
3. Helpers de exhaustividad
4. Cliente HTTP base
5. Tipos base compartidos

### Fase 2 - Skeleton Arquitectonico

1. Crear estructura oficial de una feature piloto.
2. Crear composition root de esa feature.
3. Crear boundaries minimos de `app/`.

### Fase 3 - Primera Feature Vertical Completa

La primera feature debe recorrerse end-to-end, no por capas aisladas.

Orden interno:

1. `domain`
2. `ports`
3. `application`
4. `infrastructure`
5. `presentation`
6. `composition`
7. `app`
8. `tests`

### Fase 4 - Shell De Aplicacion

1. Layouts
2. Providers globales
3. Navegacion
4. Guardas de sesion si aplican

### Fase 5 - Features De Lectura

Primero construir flujos de lectura/consulta porque:

1. Validan la arquitectura.
2. Son mas simples.
3. Permiten probar mapeos, errores, controllers y stores.

### Fase 6 - Features De Escritura

1. Drafts
2. Formularios
3. Mutaciones
4. Validaciones locales
5. Estados optimistas si aportan valor real

### Fase 7 - Hardening

1. Tests por capa
2. Normalizacion de failures
3. Telemetry
4. Accesibilidad
5. Performance donde haya dolor real

---

## Primera Feature Piloto Recomendada

Para validar la base, la primera feature debe ser una que:

1. Tenga lectura simple.
2. Tenga poco branching.
3. Toque una API real por HTTP.
4. Nos obligue a pasar por todas las capas.

Si la semantica de producto actual sigue igual, la mejor candidata inicial es
`estadisticas` de solo lectura antes de `formularios`.

---

## Skeleton Oficial De Una Feature Piloto

Ejemplo:

```text
src/modules/estadisticas/
  domain/
    entities/
      estadistica.entity.ts
    value-objects/
      estadistica-id.vo.ts
    rules/
      estadistica.rules.ts
    ports/
      inbound/
        load-estadisticas.use-case.ts
      outbound/
        estadisticas-gateway.port.ts
        telemetry.port.ts
    failures/
      estadisticas-domain.failure.ts
  application/
    dto/
      input/
        load-estadisticas.input.ts
      output/
        load-estadisticas.output.ts
    policies/
      estadisticas.policy.ts
    use-cases/
      load-estadisticas.use-case.ts
    services/
      estadisticas.service.ts
  infrastructure/
    adapters/
      outbound/
        gateway/
          http-estadisticas-gateway.adapter.ts
        mappers/
          estadisticas-api.mapper.ts
        telemetry/
          console-telemetry.adapter.ts
  presentation/
    controllers/
      estadisticas.controller.ts
    state/
      estadisticas.store.ts
    view-models/
      estadisticas-page.view-model.ts
    views/
      estadisticas-page.view.tsx
    ui/
      components/
        estadistica-card.component.tsx
        estadisticas-grid.component.tsx
      hooks/
        use-estadisticas-page.ts
      providers/
        estadisticas.provider.tsx
```

---

## Checklist Obligatorio Antes De Crear Codigo Nuevo

Antes de crear cualquier archivo de una feature, confirmar:

1. Cual es la intencion del usuario o del sistema.
2. Cual es el caso de uso.
3. Cual es el puerto inbound.
4. Cual es el puerto outbound.
5. Cual es la frontera DTO remota.
6. Cual es el mapper.
7. Cual es el estado minimo de pantalla.
8. Cual es el failure esperado por capa.
9. Cual es el archivo de composition que lo va a cablear.

Si uno de esos puntos no esta claro, todavia no toca escribir JSX.

---

## Checklist De Revision Futura

Cuando revisemos codigo a futuro, usar este orden:

1. El componente renderiza o tambien piensa demasiado.
2. El hook adapta o tambien hace negocio.
3. El controller coordina o tambien hace IO directo.
4. El use case expresa el flujo con claridad.
5. El puerto outbound esta limpio y estable.
6. El adapter traduce bien DTOs y failures.
7. La composicion esta centralizada.
8. El archivo esta en la capa correcta.

Alertas rojas:

1. `fetch` en componentes u hooks de feature.
2. Reglas de negocio en Zustand store.
3. DTOs remotos filtrandose a UI.
4. `any` en contratos centrales.
5. Modulos importando adapters concretos.
6. `app/page.tsx` con logica de negocio.
7. Shared UI con conocimiento de una feature.

---

## Politica De Tests

Objetivo:

1. `domain` -> pruebas puras de reglas
2. `application` -> pruebas de use cases con puertos fake
3. `infrastructure` -> pruebas de adapters y mappers
4. `presentation` -> pruebas de controller, state y view model
5. `app` -> pocas pruebas, solo boundaries importantes

Regla:

No probar todo desde UI si la logica se puede probar mas abajo y mas barato.

---

## Politica De Evolucion

1. Primero crear la estructura minima correcta.
2. Luego agregar features verticales.
3. No crear carpetas speculative-driven sin un flujo real.
4. Si una feature crece, expandirla dentro de su modulo antes de inventar un
   shared prematuro.
5. Solo mover algo a `shared/` cuando al menos dos features lo necesiten de
   verdad.

---

## Politica De Simplicidad

La sofisticacion del sistema no debe salir de archivos gigantes ni de un
controller monstruoso. Debe salir de:

1. Buenos limites
2. Buen naming
3. Tipos fuertes
4. Dependencias claras
5. Flujos pequenos
6. Sustitucion simple de adapters

Si un archivo necesita "explicar demasiado" para entenderse, probablemente la
responsabilidad esta mal repartida.

---

## Decision Final Oficial

La estrategia de este frontend sera:

1. `src/` como nucleo real de logica.
2. `app/` como entrada del framework.
3. `presentation/ui` como piel visual.
4. `application` como flujo.
5. `domain` como reglas de UI.
6. `infrastructure` como integracion.
7. `composition` como ensamblaje unico.

Desde este punto, cualquier construccion futura debe respetar este plano.
No empezaremos por pantallas sueltas: empezaremos por una base que nos permita
ir directo al caso de uso, al puerto o al adapter correcto cuando el proyecto
crezca.

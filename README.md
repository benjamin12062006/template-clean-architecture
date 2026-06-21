# Template Clean Architecture

Base Next.js con una estructura limpia para empezar proyectos UI sin acoplarse a un dominio concreto.

## Scripts

```bash
bun dev
bun run typecheck
bun run lint
```

## Estructura

- `app/`: entrada de Next.js.
- `src/modules/resource`: modulo plantilla con capas domain, application, infrastructure y presentation.
- `src/composition/resource`: composition root del modulo.
- `src/shared`: utilidades y contratos compartidos.
- `tests`: pruebas de los casos de uso.

El mapa tecnico principal esta en [DDD-RESOURCE-MAPA.md](DDD-RESOURCE-MAPA.md).

# Guía: Cómo Generar la Documentación con TypeDoc

Este archivo documenta los pasos y comandos exactos que se utilizaron para generar la página web de documentación de la carpeta `src-aprendisaje`.

## 1. Archivo de Configuración (`tsconfig.docs.json`)

Para evitar conflictos con la configuración principal de Next.js y resolver correctamente los alias de TypeScript (como `@shared`, `@modules`, etc.), creamos un archivo temporal de configuración específico para la documentación llamado `tsconfig.docs.json` en la raíz del proyecto (`Estadistica-Forms`).

Su contenido es:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "ignoreDeprecations": "6.0",
    "types": ["node"],
    "paths": {
      "@/*": ["./src-aprendisaje/*", "./src/*"],
      "@app": ["./src-aprendisaje/app/index.ts", "./src/app/index.ts"],
      "@shared": ["./src-aprendisaje/shared/index.ts", "./src/shared/index.ts"],
      "@modules/*": ["./src-aprendisaje/modules/*", "./src/modules/*"],
      "@composition/*": ["./src-aprendisaje/composition/*", "./src/composition/*"],
      "@bootstrap/*": ["./src-aprendisaje/bootstrap/*", "./src/bootstrap/*"],
      "@ui": ["./src-aprendisaje/ui/index.ts", "./src/ui/index.ts"],
      "@ui/*": ["./src-aprendisaje/ui/*", "./src/ui/*"]
    }
  },
  "include": [
    "src-aprendisaje/**/*.ts",
    "src-aprendisaje/**/*.tsx"
  ]
}
```

## 2. Comando Utilizado

Una vez preparado el archivo, ejecutamos el siguiente comando en la terminal (asegurándonos de estar en la carpeta `Estadistica-Forms`):

```bash
bunx typedoc --tsconfig tsconfig.docs.json --entryPointStrategy expand ./src-aprendisaje --out ./docs-aprendisaje
```

### Explicación del comando:
* `bunx typedoc`: Ejecuta la herramienta TypeDoc sin necesidad de instalarla globalmente usando Bun.
* `--tsconfig tsconfig.docs.json`: Le indica a TypeDoc que use nuestra configuración especial en lugar de la que viene por defecto.
* `--entryPointStrategy expand ./src-aprendisaje`: Le dice que expanda y busque todos los archivos dentro de esa carpeta para analizarlos.
* `--out ./docs-aprendisaje`: Define en qué carpeta queremos que se guarde la página web generada (esta misma carpeta donde estás leyendo este archivo).

## 3. Corrección en `result.ts`

**Nota importante:** Para que TypeDoc funcione, el código debe ser válido en TypeScript. Tuvimos que arreglar el archivo `src/shared/result/result.ts` original ya que tenía el texto `@module Result` expuesto directamente. La forma correcta de escribirlo para que la documentación lo detecte sin romper el código es dentro de un comentario JSDoc:

```typescript
/**
 * @module Result
 */
```

## 4. Visualización

Para ver el resultado final, solo necesitas abrir el archivo `index.html` (ubicado en esta misma carpeta `docs-aprendisaje`) en tu navegador web.

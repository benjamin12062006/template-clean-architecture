import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const restrictedImports = (group, message) => [
  "error",
  {
    patterns: [{ group, message }],
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src-aprendisaje/**",
    "src-perdon/**",
    "docs-aprendisaje/**",
  ]),
  {
    name: "shared-layer-boundaries",
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/**",
          "@composition/**",
          "@bootstrap/**",
          "@ui/**",
          "**/modules/**",
          "**/composition/**",
          "**/bootstrap/**",
          "**/ui/**",
        ],
        "shared solo puede depender de shared y librerias externas.",
      ),
    },
  },
  {
    name: "domain-layer-boundaries",
    files: ["src/modules/**/domain/**/*.{ts,tsx}"],
    ignores: ["src/modules/**/domain/ports/inbound/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/*/application/**",
          "@modules/*/infrastructure/**",
          "@modules/*/presentation/**",
          "@composition/**",
          "@bootstrap/**",
          "@ui/**",
          "**/application/**",
          "**/infrastructure/**",
          "**/presentation/**",
          "**/composition/**",
          "**/bootstrap/**",
          "**/ui/**",
        ],
        "domain no puede depender de application/infrastructure/presentation ni capas de arranque/UI.",
      ),
    },
  },
  {
    name: "domain-inbound-port-boundaries",
    files: ["src/modules/**/domain/ports/inbound/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/*/infrastructure/**",
          "@modules/*/presentation/**",
          "@composition/**",
          "@bootstrap/**",
          "@ui/**",
          "**/infrastructure/**",
          "**/presentation/**",
          "**/composition/**",
          "**/bootstrap/**",
          "**/ui/**",
        ],
        "domain/ports/inbound puede tipar contratos, pero no depender de infrastructure/presentation/UI.",
      ),
    },
  },
  {
    name: "application-layer-boundaries",
    files: ["src/modules/**/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/*/infrastructure/**",
          "@modules/*/presentation/**",
          "@composition/**",
          "@bootstrap/**",
          "@ui/**",
          "**/infrastructure/**",
          "**/presentation/**",
          "**/composition/**",
          "**/bootstrap/**",
          "**/ui/**",
        ],
        "application no puede depender de infrastructure/presentation ni capas de arranque/UI.",
      ),
    },
  },
  {
    name: "infrastructure-layer-boundaries",
    files: ["src/modules/**/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/*/application/**",
          "@modules/*/presentation/**",
          "@composition/**",
          "@bootstrap/**",
          "@ui/**",
          "**/application/**",
          "**/presentation/**",
          "**/composition/**",
          "**/bootstrap/**",
          "**/ui/**",
        ],
        "infrastructure no puede depender de application/presentation ni capas de arranque/UI.",
      ),
    },
  },
  {
    name: "presentation-layer-boundaries",
    files: ["src/modules/**/presentation/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/*/infrastructure/**",
          "@composition/**",
          "@bootstrap/**",
          "**/infrastructure/**",
          "**/composition/**",
          "**/bootstrap/**",
        ],
        "presentation no puede depender de infrastructure ni capas de arranque/composition.",
      ),
    },
  },
  {
    name: "bootstrap-layer-boundaries",
    files: ["src/bootstrap/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrictedImports(
        [
          "@modules/**",
          "@composition/**",
          "@ui/**",
          "**/modules/**",
          "**/composition/**",
          "**/ui/**",
        ],
        "bootstrap no puede depender de modules/composition/ui.",
      ),
    },
  },
]);

export default eslintConfig;

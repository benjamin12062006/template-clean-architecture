# Etapa 1: instalar dependencias con bun y cachearlas
FROM oven/bun:1 AS deps
WORKDIR /usr/src/app
# Copiamos solo archivos de dependencias para aprovechar cache de Docker
COPY package.json bun.lock ./
# Instala dependencias de forma reproducible
RUN bun install --frozen-lockfile

# Etapa 2: build de la app
FROM oven/bun:1 AS build
WORKDIR /usr/src/app
# Reutiliza node_modules de la etapa deps para no reinstalar
COPY --from=deps /usr/src/app/node_modules node_modules
# Copia el resto del codigo para compilar
COPY . .
# Ajusta el entorno a produccion
ENV NODE_ENV=production
# Ejecuta pruebas (opcional, pero evita builds con tests rotos)
RUN bun test
# Compila la app (Next.js)
RUN bun run build

# Etapa 3: imagen final de ejecucion (mas ligera)
FROM oven/bun:1 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copiamos solo lo necesario para correr en produccion
COPY --from=build /usr/src/app/.next .next
COPY --from=build /usr/src/app/public public
COPY --from=build /usr/src/app/package.json package.json
COPY --from=build /usr/src/app/node_modules node_modules

# Exponemos el puerto de la app
EXPOSE 3000
# Comando de inicio en produccion
CMD ["bun", "run", "start"]
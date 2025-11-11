# Dockerfile para Netflix Architecture Timeline - Frontend
# Multi-stage build otimizado para produção

FROM node:18-alpine AS base

# Otimizações de performance para npm/node
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_LOGLEVEL=error \
    NPM_CONFIG_PREFER_OFFLINE=true \
    NPM_CONFIG_PROGRESS=false \
    NODE_OPTIONS="--max-old-space-size=4096"

# Configurações de segurança e performance com cache de APK
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    apk add --no-cache libc6-compat dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# ARGs e Labels
ARG BUILD_DATE
ARG VCS_REF
ARG NODE_ENV=production

LABEL org.opencontainers.image.source="https://github.com/BehindTheStack/medium-scrap"
LABEL org.opencontainers.image.description="Netflix Architecture Timeline Frontend"
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.revision=$VCS_REF

# =============================================================================
# Estágio de BUILD
# =============================================================================
FROM base AS build

# Build args para Next.js public env vars
ARG NEXT_PUBLIC_API_URL="http://localhost:8000"

# Variáveis de ambiente para build otimizado
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    SKIP_ENV_VALIDATION=1 \
    NEXT_PRIVATE_STANDALONE=true \
    GENERATE_SOURCEMAP=false \
    NEXT_DISABLE_SOURCEMAPS=1 \
    CI=true \
    NODE_OPTIONS="--max-old-space-size=4096" \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copiar package files PRIMEIRO para cache de dependências
COPY package.json package-lock.json ./

# Instalar TODAS as dependências (incluindo devDependencies) para o build
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --include=dev --prefer-offline --no-audit --ignore-scripts && \
    npm rebuild && \
    npm cache clean --force

# Copiar código fonte
COPY . ./

# Build com cache otimizado
RUN --mount=type=cache,target=/app/.next/cache,sharing=locked \
    npm run build && \
    # Limpar node_modules e reinstalar APENAS produção
    rm -rf node_modules && \
    npm ci --omit=dev --omit=optional --prefer-offline --no-audit --ignore-scripts && \
    npm cache clean --force && \
    # Remover arquivos desnecessários
    rm -rf /tmp/* /root/.npm /root/.cache

# =============================================================================
# Estágio de PRODUÇÃO - imagem minimal
# =============================================================================
FROM node:18-alpine AS production

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Instalar apenas o necessário para produção
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
    apk add --no-cache libc6-compat dumb-init wget && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copiar arquivos do build
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configurar usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando otimizado para produção
CMD ["dumb-init", "node", "server.js"]

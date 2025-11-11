# Dockerfile para Netflix Architecture Timeline - API
# Multi-stage build otimizado para FastAPI

FROM python:3.11-slim AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NOWARNINGS="yes"

# Configurações Python otimizadas
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_WARN_SCRIPT_LOCATION=0 \
    PIP_DEFAULT_TIMEOUT=100 \
    PYTHONHASHSEED=random

WORKDIR /app

# Configurar APT para usar cache persistente
RUN rm -f /etc/apt/apt.conf.d/docker-clean && \
    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

# Dependências do sistema com cache otimizado
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, wheel com cache
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --upgrade pip setuptools wheel

# ARGs e Labels
ARG BUILD_DATE
ARG VCS_REF

LABEL org.opencontainers.image.source="https://github.com/BehindTheStack/medium-scrap"
LABEL org.opencontainers.image.description="Netflix Architecture Timeline API"
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.revision=$VCS_REF

# =============================================================================
# Estágio de DESENVOLVIMENTO
# =============================================================================
FROM base AS development

ENV ENVIRONMENT=development

# Instalar dependências de desenvolvimento
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install -r requirements.txt

# Copiar código fonte
COPY main.py .

# Criar usuário não-root
RUN useradd -m -u 1000 apiuser && \
    chown -R apiuser:apiuser /app

USER apiuser

# Expor porta
EXPOSE 8000

# Healthcheck para desenvolvimento
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/docs || exit 1

# Comando com hot-reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# =============================================================================
# Estágio de BUILD
# =============================================================================
FROM base AS build

ENV ENVIRONMENT=production \
    PYTHONOPTIMIZE=1

# Copiar requirements e instalar dependências de produção
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --no-compile -r requirements.txt

# Copiar código fonte
COPY main.py .

# Compilar bytecode Python (otimização)
RUN python -m compileall -b /app && \
    find /app -type f -name '*.py' -delete && \
    find /app -type f -name '*.pyc' -delete

# =============================================================================
# Estágio de PRODUÇÃO
# =============================================================================
FROM python:3.11-slim AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PYTHONOPTIMIZE=2 \
    ENVIRONMENT=production

# Instalar apenas runtime dependencies
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Criar usuário não-root
RUN useradd -m -u 1000 apiuser && \
    mkdir -p /app && \
    chown -R apiuser:apiuser /app

WORKDIR /app

# Copiar dependências já instaladas do build
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

# Copiar aplicação
COPY --from=build --chown=apiuser:apiuser /app /app

# Limpar arquivos desnecessários
RUN find /usr/local/lib/python3.11 -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.11 -type f -name '*.pyc' -delete 2>/dev/null || true && \
    find /usr/local/lib/python3.11 -type f -name '*.pyo' -delete 2>/dev/null || true && \
    rm -rf /tmp/* /var/tmp/*

USER apiuser

# Expor porta
EXPOSE 8000

# Healthcheck para produção
HEALTHCHECK --interval=60s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8000/docs || exit 1

# Comando otimizado para produção
CMD ["uvicorn", "main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "4", \
     "--loop", "uvloop", \
     "--http", "httptools", \
     "--no-access-log", \
     "--log-level", "warning"]

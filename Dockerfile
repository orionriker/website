# syntax=docker/dockerfile:1.4

# ── Base images ────────────────────────────────────────────────────────────────
# Defaults use Docker Hardened Images. Override with --build-arg to use custom
# bases built by the bun-base project (apko/melange, wolfi-based), e.g.:
#   --build-arg BUILDER_IMAGE=registry.example.com/bun-dev:1.4.0
#   --build-arg RUNTIME_IMAGE=registry.example.com/bun-runtime:1.4.0

# NOTE: dhi.io has no bun 1.4 images yet (as of 2026-08-21); defaults pinned to 1.3.
ARG BUILDER_IMAGE=dhi.io/bun:1.3-alpine3.22-dev
ARG RUNTIME_IMAGE=dhi.io/bun:1.3-alpine3.22

FROM --platform=$BUILDPLATFORM ${BUILDER_IMAGE} AS builder
WORKDIR /app

FROM --platform=$TARGETPLATFORM ${BUILDER_IMAGE} AS builder-target
WORKDIR /app

FROM --platform=$TARGETPLATFORM ${RUNTIME_IMAGE} AS runtime
WORKDIR /app

# ── Tini ───────────────────────────────────────────────────────────────────────
FROM builder-target AS tini

# Normalize install path: alpine -> /sbin/tini, wolfi -> /usr/bin/tini
RUN apk add --no-cache tini && cp "$(command -v tini)" /tini

# ── Install: dev deps ──────────────────────────────────────────────────────────
FROM builder AS install-dev
WORKDIR /temp/dev

COPY package.json bun.lock ./

RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ── Build ──────────────────────────────────────────────────────────────────────
FROM builder AS build

COPY --from=install-dev /temp/dev/node_modules ./node_modules
COPY . .

RUN bun b:b

FROM builder-target AS sharp

RUN bun install sharp

# ── Release ────────────────────────────────────────────────────────────────────
FROM runtime AS release

COPY --chown=nonroot:nonroot --from=build /app/dist ./dist
COPY --chown=nonroot:nonroot --from=build /app/public ./public-default
COPY --chown=nonroot:nonroot --from=sharp /app/node_modules ./node_modules

COPY --chown=nonroot:nonroot ./scripts/docker/entrypoint.mts ./entrypoint.mts
COPY --chown=nonroot:nonroot ./scripts/docker/healthcheck.mts ./healthcheck.mts

COPY --from=tini /tini /bin/tini

ENV HOST=0.0.0.0 PORT=4321 NODE_ENV=production
EXPOSE 4321
USER nonroot

HEALTHCHECK --start-period=20s --interval=30s --timeout=3s --retries=3 \
    CMD ["bun", "--bun", "/app/healthcheck.mts"]
ENTRYPOINT ["/bin/tini", "--", "bun", "--bun", "/app/entrypoint.mts"]
CMD ["bun", "--bun", "/app/dist/server/entry.mjs"]
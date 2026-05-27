# syntax=docker/dockerfile:1.4

# ── Base images ────────────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM dhi.io/bun:1.3-debian13-dev AS builder
WORKDIR /app

FROM --platform=$TARGETPLATFORM dhi.io/bun:1.3-debian13 AS runtime
WORKDIR /app

# ── Tini ───────────────────────────────────────────────────────────────────────
FROM --platform=$TARGETPLATFORM dhi.io/bun:1.3-debian13-dev AS tini
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update \
 && apt-get install -y --no-install-recommends tini

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

# ── Release ────────────────────────────────────────────────────────────────────
FROM runtime AS release

COPY --chown=nonroot:nonroot --from=build /app/dist ./dist
COPY --chown=nonroot:nonroot --from=build /app/public ./public-default

COPY --chown=nonroot:nonroot ./scripts/docker/entrypoint.ts ./entrypoint.ts
COPY --chown=nonroot:nonroot ./scripts/docker/healthcheck.mts ./healthcheck.mts

COPY --from=tini /usr/bin/tini /bin/tini

ENV HOST=0.0.0.0 PORT=4321 NODE_ENV=production
EXPOSE 4321
USER nonroot

HEALTHCHECK --start-period=20s --interval=30s --timeout=3s --retries=3 \
    CMD ["bun", "--bun", "/app/healthcheck.mts"]
ENTRYPOINT ["/bin/tini", "--", "bun", "--bun", "/app/entrypoint.ts"]
CMD ["bun", "--bun", "/app/dist/server/entry.mjs"]
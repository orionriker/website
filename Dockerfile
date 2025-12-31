# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM dhi.io/bun:1.3-debian13-dev AS base-build
WORKDIR /app

FROM --platform=$TARGETPLATFORM dhi.io/bun:1.3-debian13-dev AS base-target
WORKDIR /app

FROM --platform=$TARGETPLATFORM dhi.io/bun:1.3-debian13 AS runtime
WORKDIR /app

# -------- Install Stage --------
# install production and dev deps 
FROM base-build AS install-dev
WORKDIR /temp/dev

# install dependencies into temp directory
# this will cache them and speed up future builds
COPY package.json bun.lock ./
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM base-target AS install-prod
WORKDIR /temp/prod

# install with --production (exclude devDependencies)
COPY package.json bun.lock ./
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production


# ------ Pre-Release Stage ------
# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image, build the project, run tests
FROM base-build AS prerelease-1

COPY --from=install-dev /temp/dev/node_modules node_modules

COPY . .

RUN bun b:b

FROM base-target AS prerelease-2

COPY ./scripts/docker/entrypoint.ts /app/entrypoint.ts
COPY ./scripts/docker/healthcheck.mts /app/healthcheck.mts
RUN chmod +x entrypoint.ts healthcheck.mts

#RUN apk add --no-cache tini=0.19.0-r3
RUN apt-get update \
 && apt-get install -y --no-install-recommends tini \
 && rm -rf /var/lib/apt/lists/*

# -------- Release Stage --------
# Final runtime image (small, only runtime artifacts)
FROM runtime AS release

COPY --chown=nonroot:nonroot --from=install-prod /temp/prod/node_modules ./node_modules

COPY --chown=nonroot:nonroot --from=prerelease-1 /app/dist ./dist
COPY --chown=nonroot:nonroot --from=prerelease-1 /app/public ./public-default
COPY --chown=nonroot:nonroot --from=prerelease-1 /app/package.json ./package.json
COPY --chown=nonroot:nonroot --from=prerelease-1 /app/bun.lock ./bun.lock

COPY --chown=nonroot:nonroot --from=prerelease-2 /app/entrypoint.ts /app/entrypoint.ts
COPY --chown=nonroot:nonroot --from=prerelease-2 /app/healthcheck.mts /app/healthcheck.mts
COPY --from=prerelease-2 /bin/tini /bin/tini

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

USER nonroot

HEALTHCHECK --start-period=20s --interval=30s --timeout=3s --retries=3 \
  CMD ["bun", "--bun", "/app/healthcheck.mts"]

ENTRYPOINT ["/bin/tini", "--", "bun", "--bun", "/app/entrypoint.ts"]
CMD ["bun", "--bun", "/app/dist/server/entry.mjs"]
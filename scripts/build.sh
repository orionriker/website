#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source $SCRIPT_DIR/helper.sh

# check required tools
command -v docker >/dev/null || { echo "Error: Docker is required"; build_failed; }
command -v jq >/dev/null || { echo "Error: jq package is required"; build_failed; }

TYPE_CHECK=false
DOCKER=false
IMAGE_ARCH=
IMAGE_REGISTRY=

# Load variables from .env.build
if [[ -f .env.build ]]; then
  # shellcheck disable=SC2046
  export $(grep -E '^(IMAGE_ARCH|IMAGE_REGISTRY|COSIGN_PASSWORD|COSIGN_PRIVATE)=' .env.build | xargs)
else
  echo "Error: .env.build not found" >&2
  build_failed
fi

# Expand leading $HOME or ~ in COSIGN_PRIVATE (no eval)
if [[ -n "${COSIGN_PRIVATE:-}" ]]; then
  # If COSIGN_PRIVATE literally starts with $HOME, replace it with real $HOME
  if [[ "${COSIGN_PRIVATE}" == \$HOME* ]]; then
    COSIGN_PRIVATE="${HOME}${COSIGN_PRIVATE#\$HOME}"
  fi

  # If it starts with ~, replace it with $HOME
  if [[ "${COSIGN_PRIVATE}" == ~* ]]; then
    COSIGN_PRIVATE="${HOME}${COSIGN_PRIVATE#~}"
  fi
fi

while getopts ":cda:h" opt; do
  case $opt in
    c) TYPE_CHECK=true ;;
    d) DOCKER=true ;;
    a) IMAGE_ARCH=$OPTARG ;;
    h)
      echo -e "Usage: $0
  -c Enable type-checking
  -d build a docker image instead of local
  -a <arch> Which docker build arch to use
  -h Shows this help message"
      exit 0
      ;;
    \?)
      echo "Invalid option -$OPTARG" >&2;
      exit 1
      ;;
  esac
done
shift $((OPTIND -1))

# required variables
[ -z "$PACKAGE_NAME" ] && echo "Error: package name cannot be empty\! Please set in your package.json" && build_failed
[ -z "$PACKAGE_VERSION" ] && echo "Error: package version cannot be empty\! Please set in your package.json" && build_failed
[ -z "$IMAGE_ARCH" ] && echo "Error: IMAGE_ARCH cannot be empty\! Please set in your .env.build or pass as an argument using -a <arch>" && build_failed
[ -z "$IMAGE_REGISTRY" ] && echo "Error: IMAGE_REGISTRY cannot be empty\! Please set in your .env.build" && build_failed
[ -z "$COSIGN_PASSWORD" ] && echo "Error: COSIGN_PASSWORD cannot be empty\! Please set in your .env.build" && build_failed
[ -z "$COSIGN_PRIVATE" ] && echo "Error: COSIGN_PRIVATE cannot be empty\! Please set in your .env.build" && build_failed

IFS='.' read -r SEMVER_MAJOR SEMVER_MINOR SEMVER_PATCH <<< "$PACKAGE_VERSION"

if [[ -z "$SEMVER_MAJOR" || -z "$SEMVER_MINOR" || -z "$SEMVER_PATCH" ]]; then
  echo "Error: PACKAGE_VERSION must be semantic (MAJOR.MINOR.PATCH)"
  build_failed
fi

SEMVER_TAG="$SEMVER_MAJOR.$SEMVER_MINOR.$SEMVER_PATCH"
SEMVER_MINOR_TAG="$SEMVER_MAJOR.$SEMVER_MINOR"
SEMVER_MAJOR_TAG="$SEMVER_MAJOR"

# split on commas into array for IMAGE_ARCH
IFS=',' read -r -a IMAGE_ARCH_LIST <<< "$IMAGE_ARCH"

echo ""
echo -e "Package: ${CYAN}$PACKAGE_NAME@$PACKAGE_VERSION${NC}"
echo -e "Host Arch: ${CYAN}$(uname -m)${NC}"
echo ""

# Type-check Astro project
if [[ "$TYPE_CHECK" == "true" ]]; then
  run_step "Type-checking Astro project" \
    bun run b:check || build_failed
else
  echo -e "${MAGENTA}✦${NC} Type-checking Astro project (skipped)"
fi

# Build docker image or local
if [[ "$DOCKER" == "true" ]]; then
  echo -e "${MAGENTA}✦${NC} Building Astro project (skipped)"

  if [ -z "$IMAGE_REGISTRY" ]; then
    echo "Error: IMAGE_REGISTRY is empty in .env.build" >&2
    build_failed
  fi

  # Build docker image
  IMAGE=$IMAGE_REGISTRY/bunapp-$PACKAGE_NAME

  for arch in "${IMAGE_ARCH_LIST[@]}"; do
    safe_arch=$(echo "$arch" | sed 's,/,-,g') # e.g. linux/amd64 -> linux-amd64
    arch_tag_version="${IMAGE}:${SEMVER_TAG}-${safe_arch}"
    arch_tag_latest="${IMAGE}:latest-${safe_arch}"

    # Required labels
    LABEL_ARGS=(
      --label "org.opencontainers.image.title=bunapp-$PACKAGE_NAME"
      --label "org.opencontainers.image.created=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    )

    # Build some labels conditionally
    GIT_REVISION=$(git rev-parse --verify HEAD 2>/dev/null) || GIT_REVISION=""

    [ -n "$PACKAGE_DESCRIPTION" ] && LABEL_ARGS+=(--label "org.opencontainers.image.description=$PACKAGE_DESCRIPTION")
    [ -n "$PACKAGE_VERSION" ] && LABEL_ARGS+=(--label "org.opencontainers.image.version=$PACKAGE_VERSION")
    [ -n "$PACKAGE_AUTHOR" ] && LABEL_ARGS+=(--label "org.opencontainers.image.vendor=$PACKAGE_AUTHOR")
    [ -n "$PACKAGE_LICENSE" ] && LABEL_ARGS+=(--label "org.opencontainers.image.licenses=$PACKAGE_LICENSE")
    [ -n "$PACKAGE_REPO_URL" ] && LABEL_ARGS+=(--label "org.opencontainers.image.source=$PACKAGE_REPO_URL")
    [ -n "$GIT_REVISION" ] && LABEL_ARGS+=(--label "org.opencontainers.image.revision=$GIT_REVISION")

    run_step "Building docker image for ${CYAN}$arch${NC}" \
      docker buildx build \
        . \
        --tag "$arch_tag_version" \
        --tag "$arch_tag_latest" \
        --platform "$arch" \
        "${LABEL_ARGS[@]}" \
        --file Dockerfile \
        --sbom="true" \
        --provenance="true" \
        --progress=plain \
        --network host \
        --push \
    || build_failed

    # Update versioned multi-arch manifests (semver, minor, major) using the versioned arch ref
    version_tags=("$SEMVER_TAG" "$SEMVER_MINOR_TAG" "$SEMVER_MAJOR_TAG")
    for vtag in "${version_tags[@]}"; do
      full_vtag="${IMAGE}:${vtag}"
      # If the manifest exists, inspect and rebuild while preserving other arch entries
      if docker buildx imagetools inspect "${full_vtag}" >/dev/null 2>&1; then
        manifest_json=$(docker buildx imagetools inspect --format '{{json .Manifest}}' "${full_vtag}" 2>/dev/null || echo "")
        mediaType=$(printf '%s' "$manifest_json" | jq -r '.mediaType // empty' || true)

        if [[ -n "$mediaType" ]] && \
           ([[ "$mediaType" == "application/vnd.docker.distribution.manifest.list.v2+json" ]] || \
            [[ "$mediaType" == "application/vnd.oci.image.index.v1+json" ]]); then

          existing_tags=()
          manifests=$(printf '%s' "$manifest_json" | jq -c '.manifests[]?' || echo "")

          while IFS= read -r manifest; do
            plat_os=$(echo "$manifest" | jq -r '.platform.os // empty')
            plat_arch=$(echo "$manifest" | jq -r '.platform.architecture // empty')
            manifest_digest=$(echo "$manifest" | jq -r '.digest // empty')

            # keep all arches except the one we're replacing now
            if [[ "$plat_os/$plat_arch" != "$arch" ]] && [[ "$plat_os" != "" ]] && [[ "$plat_os" != "unknown" ]]; then
              existing_tags+=("${IMAGE}@${manifest_digest}")
            fi
          done <<< "$manifests"

          run_step "Updating ${CYAN}${full_vtag}${NC} (replace arch ${CYAN}${arch}${NC})" \
            docker buildx imagetools create -t "${full_vtag}" "${existing_tags[@]}" "${arch_tag_version}" || build_failed
        else
          # Single-arch: just replace
          run_step "Replacing single-arch ${CYAN}${full_vtag}${NC} with ${CYAN}${arch_tag_version}${NC}" \
            docker buildx imagetools create -t "${full_vtag}" "${arch_tag_version}" || build_failed
        fi
      else
        # No existing manifest -> create new from this arch
        run_step "Creating ${CYAN}${full_vtag}${NC} from ${CYAN}${arch_tag_version}${NC}" \
          docker buildx imagetools create -t "${full_vtag}" "${arch_tag_version}" || build_failed
      fi
    done

    # Update :latest multi-arch manifest
    latest_full="${IMAGE}:latest"
    if docker buildx imagetools inspect "${latest_full}" >/dev/null 2>&1; then
      manifest_json=$(docker buildx imagetools inspect --format '{{json .Manifest}}' "${latest_full}" 2>/dev/null || echo "")
      mediaType=$(printf '%s' "$manifest_json" | jq -r '.mediaType // empty' || true)

      if [[ -n "$mediaType" ]] && \
         ([[ "$mediaType" == "application/vnd.docker.distribution.manifest.list.v2+json" ]] || \
          [[ "$mediaType" == "application/vnd.oci.image.index.v1+json" ]]); then

        existing_tags=()
        manifests=$(printf '%s' "$manifest_json" | jq -c '.manifests[]?' || echo "")

        while IFS= read -r manifest; do
          plat_os=$(echo "$manifest" | jq -r '.platform.os // empty')
          plat_arch=$(echo "$manifest" | jq -r '.platform.architecture // empty')
          manifest_digest=$(echo "$manifest" | jq -r '.digest // empty')

          if [[ "$plat_os/$plat_arch" != "$arch" ]] && [[ "$plat_os" != "" ]] && [[ "$plat_os" != "unknown" ]]; then
            existing_tags+=("${IMAGE}@${manifest_digest}")
          fi
        done <<< "$manifests"

        run_step "Replacing ${CYAN}${arch}${NC} entry in ${CYAN}${latest_full}${NC}" \
          docker buildx imagetools create -t "${latest_full}" "${existing_tags[@]}" "${arch_tag_latest}" || build_failed
      else
        # single-arch fallback
        run_step "Replacing single-arch ${CYAN}${latest_full}${NC} with ${CYAN}${arch_tag_latest}${NC}" \
          docker buildx imagetools create -t "${latest_full}" "${arch_tag_latest}" || build_failed
      fi
    else
      # create initial latest manifest
      run_step "Creating ${CYAN}${latest_full}${NC} from ${CYAN}${arch_tag_latest}${NC}" \
        docker buildx imagetools create -t "${latest_full}" "${arch_tag_latest}" || build_failed
    fi

    # Sign per-arch images (versioned and latest-arch)
    run_step "Signing per-arch images for ${CYAN}${arch}${NC}" \
      bash -lc "COSIGN_PASSWORD='${COSIGN_PASSWORD}' COSIGN_OCI_EXPERIMENTAL=1 COSIGN_EXPERIMENTAL=1 \
        cosign sign -y --key '${COSIGN_PRIVATE}' --registry-referrers-mode=oci-1-1 '${arch_tag_version}' && \
        COSIGN_PASSWORD='${COSIGN_PASSWORD}' COSIGN_OCI_EXPERIMENTAL=1 COSIGN_EXPERIMENTAL=1 \
        cosign sign -y --key '${COSIGN_PRIVATE}' --registry-referrers-mode=oci-1-1 '${arch_tag_latest}'" \
      || build_failed

    # Sign multi-arch manifests: semver, minor, major, latest
    multi_tags=("${SEMVER_TAG}" "${SEMVER_MINOR_TAG}" "${SEMVER_MAJOR_TAG}" "latest")
    for mtag in "${multi_tags[@]}"; do
      full_multi="${IMAGE}:${mtag}"
      run_step "Signing manifest ${CYAN}${full_multi}${NC}" \
        bash -lc "COSIGN_PASSWORD='${COSIGN_PASSWORD}' COSIGN_OCI_EXPERIMENTAL=1 COSIGN_EXPERIMENTAL=1 \
          cosign sign -y --key '${COSIGN_PRIVATE}' --registry-referrers-mode=oci-1-1 '${full_multi}'" \
        || build_failed
    done
  done
else
  # Build Astro project
  run_step "Building Astro project" \
    bun run b:b || build_failed

  echo -e "${MAGENTA}✦${NC} Building docker image (skipped)"
fi

echo ""
echo -e "${GREEN}${CHECK_MARK} Build completed successfully!${NC}"
exit 0

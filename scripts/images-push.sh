#!/bin/sh
# Push blog images to the SHARED GHCR artifact (full set, :latest),
# then optionally pin the new digest for local/Vercel builds.
#
# Same package as the Deno site (`ghcr.io/maroayman/images`) — one push
# serves both. Artifact titles are `src/public/...` (Deno tree); local
# `public/images/...` files are overlaid onto that tree before pushing.
# The Astro favicon rides along as `src/public/astro-favicon.ico`
# (namespaced so the Deno site's own favicon is untouched).
#
# Overlay (not mirror): files unknown to this repo (Deno covers, profile
# photo) are preserved, so pushing from here never wipes the other site's
# art. To DELETE an image everywhere, remove it in the Deno repo and push
# from there — the Deno script is the full-set source of truth.
#
# Usage:
#   bash scripts/images-push.sh [--dry-run] [--pin] [tag]
#
#   --dry-run   list files that would be overlaid, push nothing
#   --pin       after pushing, rewrite the sha256 pin in scripts/images.pin
#               (then commit the pin in BOTH repos so builds stay in sync)
#   tag         registry tag to push (default: latest)
#
# Requires: oras login beforehand (never paste tokens into chat):
#   echo "$CR_PAT" | oras login ghcr.io -u maroayman --password-stdin
set -eu

DRY_RUN=0
PIN=0
TAG="latest"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --pin) PIN=1 ;;
    -h|--help)
      sed -n '2,/^set /p' "$0"
      exit 0
      ;;
    *) TAG="$arg" ;;
  esac
done

cd "$(dirname "$0")/.."
REGISTRY="ghcr.io/maroayman/images"

command -v oras >/dev/null 2>&1 || {
  echo "error: oras not found (try: curl -sSL https://github.com/oras-project/oras/releases/download/v1.3.4/oras_1.3.4_linux_amd64.tar.gz | tar -xz -C /usr/local/bin oras)" >&2
  exit 1
}

if [ ! -d public/images ]; then
  echo "error: public/images missing — nothing to push" >&2
  exit 1
fi

if [ "$(find public/images -type f 2>/dev/null | head -n 1)" = "" ]; then
  echo "error: no files under public/images" >&2
  exit 1
fi

if [ "$DRY_RUN" = "1" ]; then
  COUNT=$(find public/images -type f | wc -l)
  echo "Would overlay $COUNT file(s) from public/images onto $REGISTRY:$TAG:"
  (cd public/images && find . -type f | sort)
  if [ -f public/favicon.ico ]; then
    echo "Would overlay public/favicon.ico as src/public/astro-favicon.ico"
  fi
  exit 0
fi

# mktemp avoids collisions between parallel runs and guarantees cleanup.
STAGE=$(mktemp -d /tmp/opencode-images-stage.XXXXXX)
LIST_FILE=$(mktemp /tmp/opencode-images-list.XXXXXX)
PUSH_LOG=$(mktemp /tmp/opencode-oras-push.XXXXXX)
trap 'rm -rf "$STAGE"; rm -f "$LIST_FILE" "$PUSH_LOG"' EXIT INT TERM

# Start from the current shared artifact so Deno-only art survives.
REF=$(cat scripts/images.pin 2>/dev/null || true)
case "$REF" in
  ghcr.io/*"@sha256:"[0-9a-f]*[0-9a-f])
    oras pull "$REF" -o "$STAGE"
    ;;
  *)
    echo "error: scripts/images.pin is missing or malformed" >&2
    exit 1
    ;;
esac

# Overlay local art onto the Deno tree (additive — never deletes).
mkdir -p "$STAGE/src/public/images"
cp -r public/images/. "$STAGE/src/public/images/"
# Site favicon rides along under an Astro-namespaced title so it never
# collides with the Deno site's own src/public/favicon.ico.
if [ -f public/favicon.ico ]; then
  cp public/favicon.ico "$STAGE/src/public/astro-favicon.ico"
fi

# Collect the full merged set as <path>:<media-type>.
(
  cd "$STAGE"
  find src -type f 2>/dev/null | sort | while IFS= read -r f; do
    case "$f" in
      *.jpg|*.jpeg) printf '%s:%s\n' "$f" "image/jpeg" ;;
      *.png) printf '%s:%s\n' "$f" "image/png" ;;
      *.webp) printf '%s:%s\n' "$f" "image/webp" ;;
      *.svg) printf '%s:%s\n' "$f" "image/svg+xml" ;;
      *.ico) printf '%s:%s\n' "$f" "image/x-icon" ;;
      *.avif) printf '%s:%s\n' "$f" "image/avif" ;;
      *.gif) printf '%s:%s\n' "$f" "image/gif" ;;
      *) printf '%s:%s\n' "$f" "application/octet-stream" ;;
    esac
  done >"$LIST_FILE"
)

# shellcheck disable=SC2046
(
  cd "$STAGE"
  oras push "$REGISTRY:$TAG" $(cat "$LIST_FILE") 2>&1 | tee "$PUSH_LOG"
)
DIGEST=$(grep -o 'sha256:[0-9a-f]\{64\}' "$PUSH_LOG" | tail -n 1)

if [ -z "${DIGEST:-}" ]; then
  echo "error: could not parse digest from oras output" >&2
  exit 1
fi

echo "Pushed $REGISTRY:$TAG"
echo "Pinned: $REGISTRY@$DIGEST"

if [ "$PIN" = "1" ]; then
  printf '%s\n' "$REGISTRY@$DIGEST" > scripts/images.pin
  echo "Updated pin in scripts/images.pin — commit it here AND in the Deno repo"
  cat scripts/images.pin
fi

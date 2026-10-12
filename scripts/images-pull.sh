#!/bin/sh
# Restore blog images from GHCR (digest-pinned, anonymous) into public/images.
# Skips silently when images are already present unless --force is given,
# so local `pnpm dev` stays instant while Vercel/CI always pull fresh.
#
# Usage:
#   bash scripts/images-pull.sh [--force]
set -eu

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    -h|--help)
      sed -n '2,/^set /p' "$0"
      exit 0
      ;;
  esac
done

cd "$(dirname "$0")/.."

if [ "$FORCE" = "0" ] && [ -n "$(find public/images -type f 2>/dev/null | head -n 1)" ]; then
  exit 0
fi

REF=$(cat scripts/images.pin 2>/dev/null || true)
case "$REF" in
  ghcr.io/*"@sha256:"[0-9a-f]*[0-9a-f])
    ;;
  *)
    echo "error: scripts/images.pin is missing or malformed (run: bash scripts/images-push.sh --pin)" >&2
    exit 1
    ;;
esac

if ! command -v oras >/dev/null 2>&1; then
  # Bootstrap for environments without oras (Vercel build, fresh CI).
  ORAS_VERSION=1.3.4
  INSTALLED_ORAS_VERSION=$("$HOME/.oras/oras" version 2>/dev/null | grep -o '[0-9][0-9.]*' | head -n 1 || true)
  if [ "$INSTALLED_ORAS_VERSION" != "$ORAS_VERSION" ]; then
    curl -fsSL --retry 3 "https://github.com/oras-project/oras/releases/download/v${ORAS_VERSION}/oras_${ORAS_VERSION}_linux_amd64.tar.gz" -o /tmp/oras.tar.gz
    mkdir -p "$HOME/.oras"
    tar -zxf /tmp/oras.tar.gz -C "$HOME/.oras"
    rm -f /tmp/oras.tar.gz
  fi
  export PATH="$HOME/.oras:$PATH"
fi

# Extract into a temp dir first: a hostile or corrupt artifact must never be
# able to write outside public/images via crafted member paths.
rm -rf ./_images-tmp
oras pull "$REF" -o ./_images-tmp
mkdir -p public/images
cp -r ./_images-tmp/images/. public/images/
rm -rf ./_images-tmp
IMAGE_COUNT=$(find public/images -type f | wc -l)
if [ "$IMAGE_COUNT" -eq 0 ]; then
  echo "error: oras pull restored 0 files from GHCR" >&2
  exit 1
fi
echo "images: $IMAGE_COUNT files restored from GHCR"

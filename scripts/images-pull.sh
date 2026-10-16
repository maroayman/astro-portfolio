#!/bin/sh
# Restore blog images from the shared GHCR artifact (digest-pinned, anonymous)
# into public/images. Same package as the Deno site — one push serves both.
# Also restores the Astro favicon (src/public/astro-favicon.ico in the
# artifact) to public/favicon.ico, which is git-ignored by design.
#
# Robustness: pull retries 3×, forced pulls back up local files to
# /tmp/opencode-images-backup-*, and every file is checksummed against
# the artifact's manifest.txt before the temp dir is removed.
#
# Layout remap: artifact titles are `src/public/images/...` (Deno tree),
# restored here as `public/images/...` (Astro tree).
#
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
    echo "error: scripts/images.pin is missing or malformed" >&2
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
# Retried: transient GHCR/network blips must not fail a deploy.
rm -rf ./_images-tmp
PULL_OK=0
for attempt in 1 2 3; do
  if oras pull "$REF" -o ./_images-tmp; then
    PULL_OK=1
    break
  fi
  echo "warning: oras pull attempt $attempt/3 failed, retrying…" >&2
  sleep 5
  rm -rf ./_images-tmp
done
if [ "$PULL_OK" != "1" ]; then
  echo "error: oras pull failed 3 times from GHCR" >&2
  exit 1
fi
# Forced pulls overwrite local edits — back them up first (OS temp, not repo).
if [ "$FORCE" = "1" ] && [ -n "$(find public/images public/favicon.ico -type f 2>/dev/null | head -n 1)" ]; then
  BACKUP="/tmp/opencode-images-backup-$(date +%s)"
  mkdir -p "$BACKUP"
  [ -d public/images ] && cp -r public/images "$BACKUP/" 2>/dev/null || true
  [ -f public/favicon.ico ] && cp public/favicon.ico "$BACKUP/" 2>/dev/null || true
  echo "note: pre-pull backup at $BACKUP" >&2
fi
mkdir -p public/images
cp -r ./_images-tmp/src/public/images/. public/images/
# Site favicon (Astro-namespaced in the artifact to avoid colliding with
# the Deno site's own favicon). Kept out of git; restored here instead.
if [ -f ./_images-tmp/src/public/astro-favicon.ico ]; then
  cp ./_images-tmp/src/public/astro-favicon.ico public/favicon.ico
else
  echo "warning: astro-favicon.ico not in artifact — keeping local public/favicon.ico" >&2
fi
# Verify every extracted file against the artifact's own manifest
# (written at push time). A corrupt pull fails loudly instead of shipping.
if [ -f ./_images-tmp/src/manifest.txt ]; then
  (
    cd ./_images-tmp/src
    MISMATCH=0
    while IFS= read -r line; do
      want_sum=$(printf '%s' "$line" | cut -d' ' -f1)
      want_size=$(printf '%s' "$line" | cut -d' ' -f3)
      f=$(printf '%s' "$line" | cut -d' ' -f5-)
      if [ ! -f "$f" ]; then
        echo "error: manifest lists missing file: $f" >&2
        MISMATCH=1
      elif [ "$(sha256sum "$f" | cut -d' ' -f1)" != "$want_sum" ] || [ "$(wc -c <"$f")" != "$want_size" ]; then
        echo "error: checksum/size mismatch: $f" >&2
        MISMATCH=1
      fi
    done < manifest.txt
    # Restored paths must stay inside public/ (plus the manifest itself).
    BADPATHS=$(cut -d' ' -f5- manifest.txt | grep -vE '^(public/|manifest\.txt$)' || true)
    if [ -n "$BADPATHS" ]; then
      echo "error: manifest escapes public:" >&2
      printf '%s\n' "$BADPATHS" >&2
      MISMATCH=1
    fi
    exit $MISMATCH
  )
  VERIFY_OK=$?
else
  echo "warning: no manifest.txt in artifact (old pin?) — skipping verification" >&2
  VERIFY_OK=0
fi
rm -rf ./_images-tmp
if [ "$VERIFY_OK" != "0" ]; then
  exit 1
fi
IMAGE_COUNT=$(find public/images -type f | wc -l)
if [ "$IMAGE_COUNT" -eq 0 ]; then
  echo "error: oras pull restored 0 files from GHCR" >&2
  exit 1
fi
echo "images: $IMAGE_COUNT files restored from GHCR"

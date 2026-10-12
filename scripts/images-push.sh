#!/bin/sh
# Push blog images to GHCR as an OCI artifact (full set, :latest),
# then optionally pin the new digest for local/Vercel builds.
#
# Files are stored with `images/...` titles (relative to public/), so
# `oras pull ... -o ./public` restores public/images/... exactly.
#
# Usage:
#   bash scripts/images-push.sh [--dry-run] [--pin] [tag]
#
#   --dry-run   list files that would be pushed, push nothing
#   --pin       after pushing, rewrite the sha256 pin in scripts/images.pin
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
REGISTRY="ghcr.io/maroayman/astro-portfolio-images"

# mktemp avoids collisions between parallel runs and guarantees cleanup.
LIST_FILE=$(mktemp /tmp/opencode-images-list.XXXXXX)
PUSH_LOG=$(mktemp /tmp/opencode-oras-push.XXXXXX)
trap 'rm -f "$LIST_FILE" "$PUSH_LOG"' EXIT INT TERM

command -v oras >/dev/null 2>&1 || {
  echo "error: oras not found (try: curl -sSL https://github.com/oras-project/oras/releases/download/v1.3.4/oras_1.3.4_linux_amd64.tar.gz | tar -xz -C /usr/local/bin oras)" >&2
  exit 1
}

if [ ! -d public/images ]; then
  echo "error: public/images missing — nothing to push" >&2
  exit 1
fi

# Collect files as <path>:<media-type> with public/-relative titles.
# Runs in a subshell so the repo root stays the working directory.
(
  cd public
  find images -type f 2>/dev/null | sort | while IFS= read -r f; do
    case "$f" in
      *.jpg|*.jpeg) printf '%s:%s\n' "$f" "image/jpeg" ;;
      *.png) printf '%s:%s\n' "$f" "image/png" ;;
      *.webp) printf '%s:%s\n' "$f" "image/webp" ;;
      *.svg) printf '%s:%s\n' "$f" "image/svg+xml" ;;
      *.avif) printf '%s:%s\n' "$f" "image/avif" ;;
      *.gif) printf '%s:%s\n' "$f" "image/gif" ;;
      *) printf '%s:%s\n' "$f" "application/octet-stream" ;;
    esac
  done >"$LIST_FILE"
)

if [ ! -s "$LIST_FILE" ]; then
  echo "error: no files under public/images" >&2
  exit 1
fi

if [ "$DRY_RUN" = "1" ]; then
  echo "Would push $REGISTRY:$TAG with $(wc -l < "$LIST_FILE") file(s):"
  cat "$LIST_FILE"
  exit 0
fi

# shellcheck disable=SC2046
(
	cd public
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
  echo "Updated pin in scripts/images.pin"
  cat scripts/images.pin
fi

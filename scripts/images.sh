#!/bin/sh
# Short dispatcher so image sync is one easy command:
#   pnpm images pull            # force re-pull shared art into public/images
#   pnpm images push --dry-run  # preview what would be overlaid
#   pnpm images push --pin      # push + rewrite scripts/images.pin
# Extra args are forwarded to the underlying script as-is.
set -eu

cd "$(dirname "$0")/.."

cmd="${1:-help}"
if [ "$#" -gt 0 ]; then shift; fi

case "$cmd" in
  pull) exec bash scripts/images-pull.sh --force "$@" ;;
  push) exec bash scripts/images-push.sh "$@" ;;
  *)
    echo "usage: pnpm images <pull|push> [args]" >&2
    echo "  pull  -- force re-pull into public/images" >&2
    echo "  push  -- overlay public/images onto GHCR (forwards --dry-run/--pin/tag)" >&2
    exit 1
    ;;
esac

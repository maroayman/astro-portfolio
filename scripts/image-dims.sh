#!/bin/sh
# Regenerate src/data/image-dims.json from the images in public/images/.
#
# Run after adding/removing images so the build can stamp width/height onto
# Markdown images (no layout shift) without hand-editing JSON.
#
# Requires: ImageMagick (identify) and jq.
#
# Usage:
#   bash scripts/image-dims.sh
set -eu
set -o pipefail

cd "$(dirname "$0")/.."

if ! command -v identify >/dev/null 2>&1; then
	echo "error: ImageMagick 'identify' not found" >&2
	exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
	echo "error: jq not found" >&2
	exit 1
fi

tmp=$(mktemp /tmp/opencode-image-dims.XXXXXX)
trap 'rm -f "$tmp"' EXIT INT TERM

# Collect "path width height" lines, then build JSON with jq.
find public/images -type f \( -iname '*.webp' -o -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.avif' -o -iname '*.gif' -o -iname '*.svg' \) -print0 |
	sort -z |
	while IFS= read -r -d '' f; do
		dims=$(identify -format '%w %h' "$f" 2>/dev/null | head -n1)
		[ -n "$dims" ] || continue
		w=$(printf '%s' "$dims" | cut -d' ' -f1)
		h=$(printf '%s' "$dims" | cut -d' ' -f2)
		# public path -> /images/...
		rel=${f#public}
		printf '%s\t%s\t%s\n' "$rel" "$w" "$h"
	done > "$tmp"

jq -R -s '
	split("\n") |
	map(select(length > 0) | split("\t")) |
	map({ (.[0]): { width: (.[1] | tonumber), height: (.[2] | tonumber) } }) |
	add // {}
' "$tmp" > src/data/image-dims.json

count=$(jq 'length' src/data/image-dims.json)
echo "image-dims: $count entries written to src/data/image-dims.json"
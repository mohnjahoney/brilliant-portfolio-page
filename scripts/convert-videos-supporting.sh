#!/usr/bin/env bash
set -euo pipefail

INPUT_DIR="${INPUT_DIR:-assets/videos}"
OUTPUT_DIR="${OUTPUT_DIR:-assets/videos-web}"
MAX_WIDTH="${MAX_WIDTH:-960}"
CRF="${CRF:-25}"
PRESET="${PRESET:-slow}"
FEATURED_OUTPUT_DIR="${FEATURED_OUTPUT_DIR:-$OUTPUT_DIR/featured}"
FEATURED_MAX_WIDTH="${FEATURED_MAX_WIDTH:-1280}"
FEATURED_CRF="${FEATURED_CRF:-21}"
RUN_SUPPORTING="${RUN_SUPPORTING:-true}"
RUN_FEATURED="${RUN_FEATURED:-true}"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$FEATURED_OUTPUT_DIR"

convert_video() {
  local input="$1"
  local output="$2"
  local max_width="$3"
  local crf="$4"

  echo "Converting $input -> $output"

  ffmpeg \
    -nostdin \
    -y \
    -i "$input" \
    -vf "scale=w='min(${max_width}\,iw)':h=-2" \
    -c:v libx264 \
    -preset "$PRESET" \
    -crf "$crf" \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "$output"
}

if [[ "$RUN_SUPPORTING" == "true" ]]; then
  find "$INPUT_DIR" -maxdepth 1 -type f \( -iname "*.mov" -o -iname "*.mp4" \) -print0 |
    while IFS= read -r -d '' input; do
      filename="$(basename "$input")"
      name="${filename%.*}"
      output="$OUTPUT_DIR/$name.mp4"

      convert_video "$input" "$output" "$MAX_WIDTH" "$CRF"
    done
fi

if [[ "$RUN_FEATURED" == "true" ]]; then
  for name in pythagorean-theorem icosahedron-construction; do
    input="$INPUT_DIR/$name.mov"
    output="$FEATURED_OUTPUT_DIR/$name.mp4"

    if [[ -f "$input" ]]; then
      convert_video "$input" "$output" "$FEATURED_MAX_WIDTH" "$FEATURED_CRF"
    else
      echo "Skipping featured video. Missing source: $input"
    fi
  done
fi

echo "Done. Supporting videos written to $OUTPUT_DIR"
echo "Done. Featured videos written to $FEATURED_OUTPUT_DIR"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXAMPLE_DIR="$ROOT_DIR/examples/basic-16x9"
OUTPUT_DIR="$EXAMPLE_DIR/output"
AUDIO_INPUT="${1:-}"
RAW_VIDEO="$OUTPUT_DIR/cards.mp4"
SILENT_AUDIO="$OUTPUT_DIR/silence.m4a"
FINAL_VIDEO="$OUTPUT_DIR/final.mp4"

mkdir -p "$OUTPUT_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install it with: brew install ffmpeg"
  exit 1
fi

cd "$EXAMPLE_DIR"

echo "Rendering HTML cards with HyperFrames..."
npx --yes hyperframes render --output "$RAW_VIDEO" --quality standard --fps 30

if [ -n "$AUDIO_INPUT" ]; then
  if [ ! -f "$AUDIO_INPUT" ]; then
    echo "Audio file not found: $AUDIO_INPUT"
    exit 1
  fi
  AUDIO_FILE="$AUDIO_INPUT"
else
  echo "No audio provided. Creating a silent placeholder for demo output..."
  ffmpeg -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -t 12 -c:a aac -b:a 128k "$SILENT_AUDIO" >/dev/null 2>&1
  AUDIO_FILE="$SILENT_AUDIO"
fi

echo "Muxing video and audio with FFmpeg..."
ffmpeg -y \
  -i "$RAW_VIDEO" \
  -i "$AUDIO_FILE" \
  -map 0:v:0 \
  -map 1:a:0 \
  -c:v libx264 \
  -preset medium \
  -crf 18 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 192k \
  -shortest \
  "$FINAL_VIDEO"

echo
echo "Done: $FINAL_VIDEO"


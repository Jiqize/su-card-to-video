#!/usr/bin/env bash
set -euo pipefail

ORIGINAL_ARGS=("$@")
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT_SPEC="$ROOT_DIR/data/demo-video.json"
HTML_OUT="$ROOT_DIR/examples/generated-16x9/index.html"
FINAL_VIDEO="$ROOT_DIR/examples/generated-16x9/output/final.mp4"
ENGINE="hyperframes"
STYLE=""
AUDIO_INPUT=""
DURATION=""
FPS="30"
QUALITY="standard"

usage() {
  cat <<'EOF'
Usage:
  npm run render
  npm run render -- --style y2k
  npm run render -- --engine remotion --style y2k
  npm run render -- --input data/demo-video.json --audio ./voice.mp3 --style art-deco

Options:
  --engine          hyperframes or remotion. Default: hyperframes
  --input, -i       JSON video spec. Default: data/demo-video.json
  --style, -s       Visual style key. Overrides meta.style.
  --audio, -a       Audio file. Positional audio path is also accepted.
  --out, -o         Final MP4 path. Default: examples/generated-16x9/output/final.mp4
  --duration        Visual duration in seconds. Audio duration wins when --audio is provided.
  --fps             Render metadata FPS. Default: 30
  --quality         HyperFrames quality. Default: standard
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --engine) ENGINE="$2"; shift 2 ;;
    --input|-i) INPUT_SPEC="$ROOT_DIR/$2"; shift 2 ;;
    --style|-s) STYLE="$2"; shift 2 ;;
    --audio|-a) AUDIO_INPUT="$2"; shift 2 ;;
    --out|-o) FINAL_VIDEO="$ROOT_DIR/$2"; shift 2 ;;
    --duration) DURATION="$2"; shift 2 ;;
    --fps) FPS="$2"; shift 2 ;;
    --quality) QUALITY="$2"; shift 2 ;;
    --*) echo "Unknown option: $1"; usage; exit 1 ;;
    *) AUDIO_INPUT="$1"; shift ;;
  esac
done

if [[ "$ENGINE" == "remotion" ]]; then
  exec bash "$ROOT_DIR/scripts/render-remotion.sh" "${ORIGINAL_ARGS[@]}"
elif [[ "$ENGINE" != "hyperframes" ]]; then
  echo "Unknown engine: $ENGINE"
  usage
  exit 1
fi

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "$1 is required."
    exit 1
  fi
}

require_cmd node
require_cmd ffmpeg
require_cmd ffprobe

if [[ ! -f "$INPUT_SPEC" ]]; then
  echo "Input spec not found: $INPUT_SPEC"
  exit 1
fi

if [[ -n "$AUDIO_INPUT" ]]; then
  case "$AUDIO_INPUT" in
    /*) ;;
    *) AUDIO_INPUT="$ROOT_DIR/$AUDIO_INPUT" ;;
  esac
  if [[ ! -f "$AUDIO_INPUT" ]]; then
    echo "Audio file not found: $AUDIO_INPUT"
    exit 1
  fi
  AUDIO_DURATION="$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$AUDIO_INPUT")"
  if [[ -n "$AUDIO_DURATION" ]]; then
    DURATION="$AUDIO_DURATION"
  fi
fi

node "$ROOT_DIR/scripts/validate-video-spec.mjs" "$INPUT_SPEC"

BUILD_ARGS=("$ROOT_DIR/scripts/build-video-html.mjs" --input "$INPUT_SPEC" --out "$HTML_OUT" --fps "$FPS")
if [[ -n "$STYLE" ]]; then BUILD_ARGS+=(--style "$STYLE"); fi
if [[ -n "$DURATION" ]]; then BUILD_ARGS+=(--duration "$DURATION"); fi
node "${BUILD_ARGS[@]}"

OUTPUT_DIR="$(dirname "$FINAL_VIDEO")"
mkdir -p "$OUTPUT_DIR"
RAW_VIDEO="$OUTPUT_DIR/cards.mp4"
SILENT_AUDIO="$OUTPUT_DIR/silence.m4a"

RENDER_DIR="$(dirname "$HTML_OUT")"
META_FILE="$RENDER_DIR/render-meta.json"
VISUAL_DURATION="$(node -e 'const fs=require("fs");const m=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(m.duration)' "$META_FILE")"

if [[ -z "$AUDIO_INPUT" ]]; then
  echo "No audio provided. Creating silent placeholder for ${VISUAL_DURATION}s..."
  ffmpeg -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -t "$VISUAL_DURATION" -c:a aac -b:a 128k "$SILENT_AUDIO" >/dev/null 2>&1
  AUDIO_INPUT="$SILENT_AUDIO"
fi

echo "Rendering HTML cards with HyperFrames..."
(
  cd "$RENDER_DIR"
  npx --yes hyperframes render --output "$RAW_VIDEO" --quality "$QUALITY" --fps "$FPS"
)

echo "Muxing video and audio with FFmpeg..."
ffmpeg -y \
  -i "$RAW_VIDEO" \
  -i "$AUDIO_INPUT" \
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

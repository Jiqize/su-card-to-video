#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT_SPEC="$ROOT_DIR/data/demo-video.json"
PROPS_OUT="$ROOT_DIR/examples/generated-remotion/props.json"
OUT_PATH="$ROOT_DIR/previews/poster.png"
ENTRY_POINT="$ROOT_DIR/remotion/index.jsx"
COMPOSITION_ID="CardVideo"
STYLE=""
FORMAT=""
FRAME="0"
FPS="30"

usage() {
  cat <<'EOF'
Usage:
  npm run poster -- --style bauhaus --frame 0

Options:
  --input, -i       JSON video spec
  --style, -s       Style key
  --format          landscape | vertical | square | wide
  --out, -o         Poster output path
  --frame           Frame number. Default: 0
  --fps             Frames per second. Default: 30
EOF
}

resolve_path() { case "$1" in /*) printf "%s" "$1" ;; *) printf "%s/%s" "$ROOT_DIR" "$1" ;; esac; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --input|-i) INPUT_SPEC="$(resolve_path "$2")"; shift 2 ;;
    --style|-s) STYLE="$2"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    --out|-o) OUT_PATH="$(resolve_path "$2")"; shift 2 ;;
    --frame) FRAME="$2"; shift 2 ;;
    --fps) FPS="$2"; shift 2 ;;
    --*) echo "Unknown option: $1"; usage; exit 1 ;;
    *) echo "Unknown argument: $1"; usage; exit 1 ;;
  esac
done

mkdir -p "$(dirname "$OUT_PATH")"
BUILD_ARGS=("$ROOT_DIR/scripts/build-remotion-props.mjs" --input "$INPUT_SPEC" --out "$PROPS_OUT" --fps "$FPS")
if [[ -n "$STYLE" ]]; then BUILD_ARGS+=(--style "$STYLE"); fi
if [[ -n "$FORMAT" ]]; then BUILD_ARGS+=(--format "$FORMAT"); fi
node "${BUILD_ARGS[@]}"

npx --yes remotion still "$ENTRY_POINT" "$COMPOSITION_ID" "$OUT_PATH" --props "$PROPS_OUT" --frame "$FRAME" --overwrite

echo "Done: $OUT_PATH"

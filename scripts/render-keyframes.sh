#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT_SPEC="$ROOT_DIR/data/demo-video.json"
PROPS_OUT="$ROOT_DIR/examples/generated-remotion/props.json"
OUT_DIR="$ROOT_DIR/previews/keyframes"
ENTRY_POINT="$ROOT_DIR/remotion/index.jsx"
COMPOSITION_ID="CardVideo"
STYLE=""
FORMAT=""
FPS="30"

usage() {
  cat <<'EOF'
Usage:
  npm run keyframes -- --engine remotion --style y2k

Options:
  --input, -i       JSON video spec
  --style, -s       Style key
  --format          landscape | vertical | square | wide
  --out, -o         Output directory
  --fps             Frames per second. Default: 30
EOF
}

resolve_path() { case "$1" in /*) printf "%s" "$1" ;; *) printf "%s/%s" "$ROOT_DIR" "$1" ;; esac; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --engine) shift 2 ;;
    --input|-i) INPUT_SPEC="$(resolve_path "$2")"; shift 2 ;;
    --style|-s) STYLE="$2"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    --out|-o) OUT_DIR="$(resolve_path "$2")"; shift 2 ;;
    --fps) FPS="$2"; shift 2 ;;
    --*) echo "Unknown option: $1"; usage; exit 1 ;;
    *) echo "Unknown argument: $1"; usage; exit 1 ;;
  esac
done

mkdir -p "$OUT_DIR"
BUILD_ARGS=("$ROOT_DIR/scripts/build-remotion-props.mjs" --input "$INPUT_SPEC" --out "$PROPS_OUT" --fps "$FPS")
if [[ -n "$STYLE" ]]; then BUILD_ARGS+=(--style "$STYLE"); fi
if [[ -n "$FORMAT" ]]; then BUILD_ARGS+=(--format "$FORMAT"); fi
node "${BUILD_ARGS[@]}"

node -e 'const fs=require("fs");const spec=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));const fps=Number(spec.meta.fps||30);spec.scenes.forEach((s,i)=>console.log(`${String(i+1).padStart(2,"0")} ${Math.round(Number(s.start||0)*fps)}`));' "$PROPS_OUT" | while read -r index frame; do
  out="$OUT_DIR/scene-${index}.png"
  npx --yes remotion still "$ENTRY_POINT" "$COMPOSITION_ID" "$out" --props "$PROPS_OUT" --frame "$frame" --overwrite
  echo "wrote $out"
done

echo "Done: $OUT_DIR"

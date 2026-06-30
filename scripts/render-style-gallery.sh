#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INPUT_SPEC="$ROOT_DIR/data/demo-video.json"
OUT_DIR="$ROOT_DIR/previews/style-gallery"
FORMAT=""
FPS="30"
FRAME="0"

usage() {
  cat <<'EOF'
Usage:
  npm run gallery -- --input data/demo-video.json

Options:
  --input, -i       JSON video spec
  --out, -o         Output directory
  --format          landscape | vertical | square | wide
  --frame           Frame number. Default: 0
  --fps             Frames per second. Default: 30
EOF
}

resolve_path() { case "$1" in /*) printf "%s" "$1" ;; *) printf "%s/%s" "$ROOT_DIR" "$1" ;; esac; }
while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) usage; exit 0 ;;
    --input|-i) INPUT_SPEC="$(resolve_path "$2")"; shift 2 ;;
    --out|-o) OUT_DIR="$(resolve_path "$2")"; shift 2 ;;
    --format) FORMAT="$2"; shift 2 ;;
    --frame) FRAME="$2"; shift 2 ;;
    --fps) FPS="$2"; shift 2 ;;
    --*) echo "Unknown option: $1"; usage; exit 1 ;;
    *) echo "Unknown argument: $1"; usage; exit 1 ;;
  esac
done

mkdir -p "$OUT_DIR"
MANIFEST="$OUT_DIR/manifest.jsonl"
: > "$MANIFEST"

node "$ROOT_DIR/scripts/build-video-html.mjs" --list-styles | while read -r style; do
  [[ -z "$style" ]] && continue
  out="$OUT_DIR/${style}.png"
  args=("$ROOT_DIR/scripts/render-poster.sh" --input "$INPUT_SPEC" --style "$style" --out "$out" --frame "$FRAME" --fps "$FPS")
  if [[ -n "$FORMAT" ]]; then args+=(--format "$FORMAT"); fi
  bash "${args[@]}"
  printf '{"style":"%s","file":"%s"}\n' "$style" "$out" >> "$MANIFEST"
done

INDEX="$OUT_DIR/index.html"
{
  echo '<!doctype html><html><head><meta charset="utf-8"><title>Style Gallery</title><style>body{font-family:system-ui;background:#111;color:#fff;margin:0;padding:32px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px}.card{background:#1d1d1f;padding:12px;border:1px solid #333}.card img{width:100%;display:block}.card b{display:block;margin-top:10px}</style></head><body><h1>su-card-to-video style gallery</h1><main class="grid">'
  while read -r line; do
    style="$(printf '%s' "$line" | sed -n 's/.*"style":"\([^"]*\)".*/\1/p')"
    echo "<div class=\"card\"><img src=\"${style}.png\"><b>${style}</b></div>"
  done < "$MANIFEST"
  echo '</main></body></html>'
} > "$INDEX"

echo "Done: $OUT_DIR"

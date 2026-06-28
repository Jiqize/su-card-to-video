#!/usr/bin/env bash
set -euo pipefail

missing=0

check_cmd() {
  local name="$1"
  local hint="$2"
  if command -v "$name" >/dev/null 2>&1; then
    echo "ok: $name -> $(command -v "$name")"
  else
    echo "missing: $name"
    echo "  install: $hint"
    missing=1
  fi
}

check_npx_package() {
  local name="$1"
  local hint="$2"
  if npx --yes "$name" --version >/dev/null 2>&1; then
    echo "ok: $name -> npx $name"
  else
    echo "missing: $name"
    echo "  install: $hint"
    missing=1
  fi
}

check_cmd node "brew install node"
check_cmd npm "brew install node"
check_cmd ffmpeg "brew install ffmpeg"
check_cmd ffprobe "brew install ffmpeg"
check_npx_package hyperframes "npm install"
check_npx_package remotion "npm install"

if [ "$missing" -ne 0 ]; then
  echo
  echo "Some tools are missing. Install them and run: npm run doctor"
  exit 1
fi

echo
echo "All required tools are available."

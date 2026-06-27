import fs from "node:fs";
import { STYLE_KEYS, getStylePreset } from "./video-styles.mjs";

const DEFAULT_DURATION = { cover: 4, cards: 4.8, process: 5.2, metrics: 4.2, closing: 3.2 };
const VALID_LAYOUTS = new Set(Object.keys(DEFAULT_DURATION));

export function parseArgs(argv) {
  const args = { input: "data/demo-video.json", out: "examples/generated-16x9/index.html", fps: "30" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--list-styles") args.listStyles = true;
    else if (arg === "--input" || arg === "-i") args.input = argv[++i];
    else if (arg === "--out" || arg === "-o") args.out = argv[++i];
    else if (arg === "--style" || arg === "-s") args.style = argv[++i];
    else if (arg === "--duration") args.duration = argv[++i];
    else if (arg === "--width") args.width = argv[++i];
    else if (arg === "--height") args.height = argv[++i];
    else if (arg === "--fps") args.fps = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

export function printHelp() {
  console.log(`su-card-to-video HTML builder

Usage:
  node scripts/build-video-html.mjs --input data/demo-video.json --style bauhaus
  node scripts/build-video-html.mjs --input data/demo-video.json --style y2k --duration 24.5

Options:
  --input, -i       Video spec JSON
  --out, -o         Output HTML path
  --style, -s       Visual style key
  --duration        Override total visual duration in seconds
  --width           Canvas width
  --height          Canvas height
  --fps             Metadata FPS
  --list-styles     Print available style keys
`);
}

export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read ${filePath}: ${error.message}`);
  }
}

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clean(value, fallback = "") {
  const text = String(value ?? fallback).trim();
  return text.length ? text : fallback;
}

export function normalizeSpec(rawSpec, args) {
  if (!rawSpec || typeof rawSpec !== "object") throw new Error("Spec must be an object.");
  const meta = rawSpec.meta && typeof rawSpec.meta === "object" ? rawSpec.meta : {};
  const style = getStylePreset(args.style || meta.style || "bauhaus");
  if (!style) throw new Error(`Unknown style. Valid styles: ${STYLE_KEYS.join(", ")}`);

  const sourceScenes = Array.isArray(rawSpec.scenes) ? rawSpec.scenes : [];
  if (!sourceScenes.length) throw new Error("Spec must contain at least one scene.");

  let scenes = sourceScenes.map((scene, index) => {
    const layout = clean(scene.layout, index === 0 ? "cover" : "cards");
    if (!VALID_LAYOUTS.has(layout)) throw new Error(`Scene ${index + 1} uses unsupported layout "${layout}".`);
    return { ...scene, id: `scene-${index + 1}`, layout, duration: positiveNumber(scene.duration, DEFAULT_DURATION[layout]) };
  });

  const currentTotal = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const requestedDuration = positiveNumber(args.duration, positiveNumber(meta.duration, currentTotal));
  const scale = currentTotal > 0 ? requestedDuration / currentTotal : 1;

  let start = 0;
  scenes = scenes.map(scene => {
    const duration = Number(Math.max(1.2, scene.duration * scale).toFixed(3));
    const normalized = { ...scene, start: Number(start.toFixed(3)), duration };
    start = Number((start + duration).toFixed(3));
    return normalized;
  });

  const compositionId = clean(meta.compositionId, "su-card-to-video-generated").replace(/[^a-zA-Z0-9_-]/g, "-");
  return {
    meta: {
      title: clean(meta.title, "su-card-to-video"),
      kicker: clean(meta.kicker, "Card Video"),
      compositionId,
      width: Math.round(positiveNumber(args.width, positiveNumber(meta.width, 1920))),
      height: Math.round(positiveNumber(args.height, positiveNumber(meta.height, 1080))),
      fps: Math.round(positiveNumber(args.fps, positiveNumber(meta.fps, 30))),
      duration: Number(start.toFixed(3))
    },
    style,
    scenes
  };
}

export function renderMeta(spec) {
  return {
    title: spec.meta.title,
    style: spec.style.key,
    styleLabel: spec.style.label,
    duration: spec.meta.duration,
    width: spec.meta.width,
    height: spec.meta.height,
    fps: spec.meta.fps,
    compositionId: spec.meta.compositionId,
    scenes: spec.scenes.map(scene => ({
      id: scene.id, layout: scene.layout, start: scene.start, duration: scene.duration, title: String(scene.title || "")
    }))
  };
}

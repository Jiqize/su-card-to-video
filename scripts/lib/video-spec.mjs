import fs from "node:fs";
import path from "node:path";
import { STYLE_KEYS, getStylePreset } from "./video-styles.mjs";
import { FORMAT_KEYS, getFormatPreset } from "./video-formats.mjs";
import { distributeCaptionsToScenes, normalizeCaptions, parseCaptionFile } from "./captions.mjs";

const DEFAULT_DURATION = {
  cover: 4,
  cards: 4.8,
  process: 5.2,
  metrics: 4.2,
  closing: 3.2,
  quote: 4,
  comparison: 4.8,
  "before-after": 4.8,
  timeline: 5.2,
  ranking: 5,
  "myth-fact": 4.8,
  checklist: 4.8,
  framework: 5,
  "case-study": 5.2,
  "data-story": 5,
  product: 5,
  gallery: 5,
  faq: 5
};
export const VALID_LAYOUTS = new Set(Object.keys(DEFAULT_DURATION));
export const MOTION_KEYS = new Set(["calm", "editorial", "kinetic", "cinematic", "glitch", "comic", "luxury", "default"]);

export function parseArgs(argv) {
  const args = { input: "data/demo-video.json", out: "examples/generated-16x9/index.html", fps: "30" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--list-styles") args.listStyles = true;
    else if (arg === "--input" || arg === "-i") args.input = argv[++i];
    else if (arg === "--out" || arg === "-o") args.out = argv[++i];
    else if (arg === "--style" || arg === "-s") args.style = argv[++i];
    else if (arg === "--format") args.format = argv[++i];
    else if (arg === "--motion") args.motion = argv[++i];
    else if (arg === "--audio") args.audio = argv[++i];
    else if (arg === "--transcript") args.transcript = argv[++i];
    else if (arg === "--duration") args.duration = argv[++i];
    else if (arg === "--width") args.width = argv[++i];
    else if (arg === "--height") args.height = argv[++i];
    else if (arg === "--fps") args.fps = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

export function printHelp() {
  console.log(`su-card-to-video builder

Usage:
  node scripts/build-video-html.mjs --input data/demo-video.json --style bauhaus
  node scripts/build-remotion-props.mjs --input data/demo-video.json --style y2k --duration 24.5

Options:
  --input, -i       Video spec JSON
  --out, -o         Output path
  --style, -s       Visual style key
  --format          landscape | vertical | square | wide
  --motion          Motion preset
  --audio           Prepared audio path
  --transcript      SRT, VTT, JSON, or text transcript
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

function normalizeAudio(rawSpec, args) {
  const audio = rawSpec.audio && typeof rawSpec.audio === "object" ? { ...rawSpec.audio } : {};
  if (args.audio) audio.path = args.audio;
  if (args.transcript) audio.transcript = args.transcript;
  if (!audio.source) audio.source = audio.path ? "external" : "silent";
  if (audio.path) audio.path = String(audio.path);
  if (audio.transcript) audio.transcript = String(audio.transcript);
  if (audio.duration !== undefined) audio.duration = positiveNumber(audio.duration, undefined);
  return audio;
}

function normalizeAssets(rawSpec) {
  const assets = Array.isArray(rawSpec.assets) ? rawSpec.assets : [];
  return assets.map((asset, index) => ({
    id: clean(asset.id, `asset-${index + 1}`),
    type: clean(asset.type, "image"),
    path: clean(asset.path, ""),
    fit: clean(asset.fit, "cover"),
    alt: clean(asset.alt, ""),
    required: Boolean(asset.required),
    caption: clean(asset.caption, ""),
    credit: clean(asset.credit, "")
  }));
}

function attachTranscriptCaptions(rawSpec, scenes, inputPath, audio) {
  const transcript = audio.transcript || rawSpec.transcript;
  if (!transcript) return scenes;
  const transcriptPath = path.isAbsolute(transcript) ? transcript : path.resolve(path.dirname(inputPath || process.cwd()), transcript);
  if (!fs.existsSync(transcriptPath)) return scenes;
  const captions = parseCaptionFile(transcriptPath);
  return distributeCaptionsToScenes(captions, scenes);
}

export function normalizeSpec(rawSpec, args = {}) {
  if (!rawSpec || typeof rawSpec !== "object") throw new Error("Spec must be an object.");
  const meta = rawSpec.meta && typeof rawSpec.meta === "object" ? rawSpec.meta : {};
  const style = getStylePreset(args.style || meta.style || "bauhaus");
  if (!style) throw new Error(`Unknown style. Valid styles: ${STYLE_KEYS.join(", ")}`);

  const format = getFormatPreset(args.format || meta.format || "landscape");
  if (!format) throw new Error(`Unknown format. Valid formats: ${FORMAT_KEYS.join(", ")}`);

  const motion = clean(args.motion || meta.motion || style.motion?.drift || "editorial");
  const audio = normalizeAudio(rawSpec, args);
  const assets = normalizeAssets(rawSpec);

  const sourceScenes = Array.isArray(rawSpec.scenes) ? rawSpec.scenes : [];
  if (!sourceScenes.length) throw new Error("Spec must contain at least one scene.");

  let scenes = sourceScenes.map((scene, index) => {
    const layout = clean(scene.layout, index === 0 ? "cover" : "cards");
    if (!VALID_LAYOUTS.has(layout)) throw new Error(`Scene ${index + 1} uses unsupported layout "${layout}".`);
    return {
      ...scene,
      id: clean(scene.id, `scene-${index + 1}`),
      layout,
      duration: positiveNumber(scene.duration, DEFAULT_DURATION[layout]),
      captions: normalizeCaptions(scene.captions),
      motion: clean(scene.motion, motion)
    };
  });

  const currentTotal = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const requestedDuration = positiveNumber(args.duration, positiveNumber(audio.duration, positiveNumber(meta.duration, currentTotal)));
  const scale = currentTotal > 0 ? requestedDuration / currentTotal : 1;

  let start = 0;
  scenes = scenes.map(scene => {
    const duration = Number(Math.max(1.2, scene.duration * scale).toFixed(3));
    const scaledCaptions = scene.captions.map(caption => ({ ...caption, start: Number((caption.start * scale).toFixed(3)), end: Number((caption.end * scale).toFixed(3)) }));
    const normalized = { ...scene, start: Number(start.toFixed(3)), duration, captions: scaledCaptions };
    start = Number((start + duration).toFixed(3));
    return normalized;
  });

  scenes = attachTranscriptCaptions(rawSpec, scenes, args.input, audio);

  const compositionId = clean(meta.compositionId, "su-card-to-video-generated").replace(/[^a-zA-Z0-9_-]/g, "-");
  const cliFormatOverride = Boolean(args.format);
  const widthFallback = cliFormatOverride ? format.width : positiveNumber(meta.width, format.width);
  const heightFallback = cliFormatOverride ? format.height : positiveNumber(meta.height, format.height);
  const width = Math.round(positiveNumber(args.width, widthFallback));
  const height = Math.round(positiveNumber(args.height, heightFallback));
  return {
    version: clean(rawSpec.version, "0.4"),
    meta: {
      title: clean(meta.title, "su-card-to-video"),
      kicker: clean(meta.kicker, "Card Video"),
      compositionId,
      format: format.key,
      formatLabel: format.label,
      safeArea: meta.safeArea || format.safeArea,
      motion,
      language: clean(meta.language, "zh-CN"),
      width,
      height,
      fps: Math.round(positiveNumber(args.fps, positiveNumber(meta.fps, 30))),
      duration: Number(start.toFixed(3))
    },
    audio,
    assets,
    output: rawSpec.output || {},
    style,
    scenes
  };
}

export function renderMeta(spec) {
  return {
    title: spec.meta.title,
    style: spec.style.key,
    styleLabel: spec.style.label,
    format: spec.meta.format,
    motion: spec.meta.motion,
    duration: spec.meta.duration,
    width: spec.meta.width,
    height: spec.meta.height,
    fps: spec.meta.fps,
    compositionId: spec.meta.compositionId,
    audio: spec.audio,
    assets: spec.assets.map(asset => ({ id: asset.id, type: asset.type, path: asset.path, required: asset.required })),
    scenes: spec.scenes.map(scene => ({ id: scene.id, layout: scene.layout, start: scene.start, duration: scene.duration, title: String(scene.title || ""), captions: Array.isArray(scene.captions) ? scene.captions.length : 0 }))
  };
}

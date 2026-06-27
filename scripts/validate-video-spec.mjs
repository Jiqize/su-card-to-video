#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { STYLE_KEYS, normalizeStyleKey } from "./lib/video-styles.mjs";

const VALID_LAYOUTS = new Set(["cover", "cards", "process", "metrics", "closing"]);

function usage() {
  console.log(`Usage:\n  node scripts/validate-video-spec.mjs data/demo-video.json\n  node scripts/validate-video-spec.mjs data/demo-video.json another.json`);
}
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read ${filePath}: ${error.message}`);
  }
}
function asText(value) { return String(value ?? "").trim(); }

function validateFile(filePath) {
  const spec = readJson(filePath);
  const errors = [];
  const warnings = [];
  const meta = spec.meta || {};
  const styleKey = normalizeStyleKey(meta.style || "bauhaus");

  if (!STYLE_KEYS.includes(styleKey)) errors.push(`meta.style "${meta.style}" is not supported. Valid styles: ${STYLE_KEYS.join(", ")}`);
  if (!Array.isArray(spec.scenes) || spec.scenes.length === 0) errors.push("scenes must be a non-empty array.");

  const scenes = Array.isArray(spec.scenes) ? spec.scenes : [];
  scenes.forEach((scene, index) => {
    const prefix = `scene ${index + 1}`;
    if (!VALID_LAYOUTS.has(scene.layout)) errors.push(`${prefix}: layout "${scene.layout}" is invalid.`);
    if (scene.duration !== undefined && !(Number(scene.duration) > 0)) errors.push(`${prefix}: duration must be a positive number.`);
    const title = asText(scene.title);
    if (!title) errors.push(`${prefix}: title is required.`);
    if (title.length > 42) warnings.push(`${prefix}: title is long for a 16:9 video card, consider shortening.`);
    if (scene.layout === "cards" && (!Array.isArray(scene.cards) || scene.cards.length < 2)) warnings.push(`${prefix}: cards layout works best with at least 3 cards.`);
    if (scene.layout === "process" && (!Array.isArray(scene.steps) || scene.steps.length < 3)) warnings.push(`${prefix}: process layout works best with 4 steps.`);
    if (scene.layout === "metrics" && (!Array.isArray(scene.metrics) || scene.metrics.length < 2)) warnings.push(`${prefix}: metrics layout works best with 3 metrics.`);
    if (!asText(scene.caption)) warnings.push(`${prefix}: caption is empty. Spoken-text captions improve video clarity.`);
  });

  const totalDuration = scenes.reduce((sum, scene) => {
    const value = Number(scene.duration);
    return sum + (Number.isFinite(value) && value > 0 ? value : 0);
  }, 0);
  return { filePath, styleKey, sceneCount: scenes.length, totalDuration, errors, warnings };
}

const files = process.argv.slice(2);
if (!files.length || files.includes("--help") || files.includes("-h")) {
  usage();
  process.exit(files.length ? 0 : 1);
}

let failed = false;
for (const file of files) {
  const result = validateFile(path.resolve(file));
  const rel = path.relative(process.cwd(), result.filePath);
  console.log(`\n${rel}`);
  console.log(`  style: ${result.styleKey}`);
  console.log(`  scenes: ${result.sceneCount}`);
  console.log(`  declared scene duration: ${result.totalDuration.toFixed(2)}s`);
  if (result.errors.length) {
    failed = true;
    console.log("  errors:");
    result.errors.forEach(item => console.log(`    - ${item}`));
  }
  if (result.warnings.length) {
    console.log("  warnings:");
    result.warnings.forEach(item => console.log(`    - ${item}`));
  }
  if (!result.errors.length && !result.warnings.length) console.log("  ok");
}
process.exit(failed ? 1 : 0);

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { STYLE_KEYS, normalizeStyleKey } from "./lib/video-styles.mjs";
import { FORMAT_KEYS, normalizeFormatKey } from "./lib/video-formats.mjs";
import { VALID_LAYOUTS } from "./lib/video-spec.mjs";

function usage() {
  console.log(`Usage:\n  node scripts/validate-video-spec.mjs data/demo-video.json\n  node scripts/validate-video-spec.mjs data/demo-video.json --report quality-report.json\n\nOptions:\n  --report         Write machine-readable quality report\n  --json           Print JSON report to stdout`);
}
function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch (error) { throw new Error(`Cannot read ${filePath}: ${error.message}`); }
}
function asText(value) { return String(value ?? "").trim(); }
function isPositive(value) { return Number.isFinite(Number(value)) && Number(value) > 0; }
function add(sceneNotes, index, level, message) { sceneNotes.push({ scene: index + 1, level, message }); }

function checkCaptions(scene, index, errors, warnings, sceneNotes) {
  if (!Array.isArray(scene.captions)) return;
  const sorted = [...scene.captions].sort((a, b) => Number(a.start) - Number(b.start));
  for (let i = 0; i < sorted.length; i += 1) {
    const caption = sorted[i];
    const prefix = `scene ${index + 1} caption ${i + 1}`;
    if (!isPositive(caption.end) || Number(caption.start) < 0 || Number(caption.end) <= Number(caption.start)) errors.push(`${prefix}: invalid start/end timing.`);
    if (scene.duration && Number(caption.end) > Number(scene.duration) + 0.01) errors.push(`${prefix}: caption ends outside scene duration.`);
    if (asText(caption.text).length > 64) warnings.push(`${prefix}: caption is long and may overflow.`);
    if (i > 0 && Number(caption.start) < Number(sorted[i - 1].end)) errors.push(`${prefix}: overlaps previous caption.`);
  }
  if (sorted.length) add(sceneNotes, index, "info", `${sorted.length} timed captions found.`);
}

function checkAssets(spec, specDir, errors, warnings) {
  const assets = Array.isArray(spec.assets) ? spec.assets : [];
  for (const asset of assets) {
    if (!asset.id) errors.push("asset: id is required.");
    if (!asset.path) {
      if (asset.required) errors.push(`asset ${asset.id || "unknown"}: required asset path is missing.`);
      else warnings.push(`asset ${asset.id || "unknown"}: optional asset path is missing.`);
      continue;
    }
    const assetPath = path.isAbsolute(asset.path) ? asset.path : path.resolve(specDir, asset.path);
    if (!fs.existsSync(assetPath)) {
      if (asset.required) errors.push(`asset ${asset.id}: file not found: ${asset.path}`);
      else warnings.push(`asset ${asset.id}: optional file not found: ${asset.path}`);
    }
  }
}

function validateFile(filePath) {
  const spec = readJson(filePath);
  const errors = [];
  const warnings = [];
  const suggestions = [];
  const sceneNotes = [];
  const meta = spec.meta || {};
  const styleKey = normalizeStyleKey(meta.style || "bauhaus");
  const formatKey = normalizeFormatKey(meta.format || "landscape");

  if (!STYLE_KEYS.includes(styleKey)) errors.push(`meta.style "${meta.style}" is not supported. Valid styles: ${STYLE_KEYS.join(", ")}`);
  if (!FORMAT_KEYS.includes(formatKey)) errors.push(`meta.format "${meta.format}" is not supported. Valid formats: ${FORMAT_KEYS.join(", ")}`);
  if (!Array.isArray(spec.scenes) || spec.scenes.length === 0) errors.push("scenes must be a non-empty array.");

  const scenes = Array.isArray(spec.scenes) ? spec.scenes : [];
  scenes.forEach((scene, index) => {
    const prefix = `scene ${index + 1}`;
    if (!VALID_LAYOUTS.has(scene.layout)) errors.push(`${prefix}: layout "${scene.layout}" is invalid.`);
    if (scene.duration !== undefined && !isPositive(scene.duration)) errors.push(`${prefix}: duration must be a positive number.`);
    const title = asText(scene.title);
    if (!title) errors.push(`${prefix}: title is required.`);
    if (title.length > (formatKey === "vertical" ? 30 : 42)) warnings.push(`${prefix}: title is long for ${formatKey} output.`);
    if (scene.layout === "cards" && (!Array.isArray(scene.cards) || scene.cards.length < 2)) warnings.push(`${prefix}: cards layout works best with at least 3 cards.`);
    if (scene.layout === "process" && (!Array.isArray(scene.steps) || scene.steps.length < 3)) warnings.push(`${prefix}: process layout works best with 4 steps.`);
    if (scene.layout === "metrics" && (!Array.isArray(scene.metrics) || scene.metrics.length < 2)) warnings.push(`${prefix}: metrics layout works best with 3 metrics.`);
    if (!asText(scene.caption) && !Array.isArray(scene.captions)) warnings.push(`${prefix}: caption is empty. Spoken-text captions improve video clarity.`);
    checkCaptions(scene, index, errors, warnings, sceneNotes);
    const roughText = [scene.title, scene.lead, scene.caption, ...(scene.cards || []).map(c => `${c.title || ""} ${c.body || ""}`), ...(scene.steps || []).map(s => `${s.title || ""} ${s.body || ""}`)].join(" ");
    if (formatKey === "vertical" && roughText.length > 420) warnings.push(`${prefix}: text density is high for vertical output.`);
  });

  checkAssets(spec, path.dirname(filePath), errors, warnings);
  if (spec.audio?.path) {
    const audioPath = path.isAbsolute(spec.audio.path) ? spec.audio.path : path.resolve(path.dirname(filePath), spec.audio.path);
    if (!fs.existsSync(audioPath)) warnings.push(`audio.path does not exist locally: ${spec.audio.path}`);
  }
  if (scenes.length < 3) suggestions.push("Use at least 3 scenes: cover, body, and closing.");
  if (scenes.length > 8) suggestions.push("Consider splitting long videos into multiple outputs.");

  const totalDuration = scenes.reduce((sum, scene) => sum + (isPositive(scene.duration) ? Number(scene.duration) : 0), 0);
  const score = Math.max(0, 100 - errors.length * 18 - warnings.length * 4 - suggestions.length * 2);
  const status = errors.length ? "fail" : warnings.length ? "pass-with-warnings" : "pass";
  return { filePath, styleKey, formatKey, sceneCount: scenes.length, totalDuration, status, score, errors, warnings, suggestions, scenes: sceneNotes };
}

const argv = process.argv.slice(2);
const reportIndex = argv.indexOf("--report");
const reportPath = reportIndex >= 0 ? argv[reportIndex + 1] : "";
const jsonMode = argv.includes("--json");
const files = argv.filter((arg, index) => arg !== "--json" && arg !== "--report" && index !== reportIndex + 1);

if (!files.length || files.includes("--help") || files.includes("-h")) {
  usage();
  process.exit(files.length ? 0 : 1);
}

let failed = false;
const results = [];
for (const file of files) {
  const result = validateFile(path.resolve(file));
  results.push(result);
  if (result.errors.length) failed = true;
  if (!jsonMode) {
    const rel = path.relative(process.cwd(), result.filePath);
    console.log(`\n${rel}`);
    console.log(`  style: ${result.styleKey}`);
    console.log(`  format: ${result.formatKey}`);
    console.log(`  scenes: ${result.sceneCount}`);
    console.log(`  declared scene duration: ${result.totalDuration.toFixed(2)}s`);
    console.log(`  quality: ${result.score}/100 (${result.status})`);
    if (result.errors.length) { console.log("  errors:"); result.errors.forEach(item => console.log(`    - ${item}`)); }
    if (result.warnings.length) { console.log("  warnings:"); result.warnings.forEach(item => console.log(`    - ${item}`)); }
    if (result.suggestions.length) { console.log("  suggestions:"); result.suggestions.forEach(item => console.log(`    - ${item}`)); }
    if (!result.errors.length && !result.warnings.length) console.log("  ok");
  }
}

const report = results.length === 1 ? results[0] : { status: failed ? "fail" : "pass", results };
if (reportPath) {
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
}
if (jsonMode) console.log(JSON.stringify(report, null, 2));
process.exit(failed ? 1 : 0);

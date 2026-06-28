#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const args = { dir: "", engine: "remotion", style: "", format: "", failFast: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--engine") args.engine = argv[++i];
    else if (arg === "--style" || arg === "-s") args.style = argv[++i];
    else if (arg === "--format") args.format = argv[++i];
    else if (arg === "--fail-fast") args.failFast = true;
    else if (!args.dir) args.dir = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}
function usage() { console.log("Usage:\n  npm run batch -- ./campaign --engine remotion --style y2k"); }
function listSpecs(campaignDir) {
  const specsDir = path.join(campaignDir, "specs");
  if (fs.existsSync(specsDir)) return fs.readdirSync(specsDir).filter(file => file.endsWith(".json")).map(file => path.join(specsDir, file));
  return fs.readdirSync(campaignDir).filter(file => file.endsWith(".json")).map(file => path.join(campaignDir, file));
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.dir) { usage(); process.exit(args.help ? 0 : 1); }
  const root = process.cwd();
  const campaignDir = path.resolve(args.dir);
  const specs = listSpecs(campaignDir);
  if (!specs.length) throw new Error(`No JSON specs found in ${campaignDir}`);
  const outputDir = path.join(campaignDir, "output");
  fs.mkdirSync(outputDir, { recursive: true });
  const manifest = [];
  for (const specPath of specs) {
    const base = path.basename(specPath, ".json");
    const audioCandidate = path.join(campaignDir, "audio", `${base}.mp3`);
    const outPath = path.join(outputDir, `${base}.mp4`);
    const reportPath = path.join(outputDir, `${base}.quality.json`);
    const cmdArgs = ["scripts/render.sh", "--input", specPath, "--engine", args.engine, "--out", outPath, "--report", reportPath];
    if (args.style) cmdArgs.push("--style", args.style);
    if (args.format) cmdArgs.push("--format", args.format);
    if (fs.existsSync(audioCandidate)) cmdArgs.push("--audio", audioCandidate);
    const startedAt = new Date().toISOString();
    const result = spawnSync("bash", cmdArgs, { cwd: root, stdio: "inherit" });
    const item = { spec: specPath, output: outPath, report: reportPath, engine: args.engine, style: args.style || null, format: args.format || null, audio: fs.existsSync(audioCandidate) ? audioCandidate : null, status: result.status === 0 ? "success" : "failed", exitCode: result.status, startedAt, endedAt: new Date().toISOString() };
    manifest.push(item);
    fs.writeFileSync(path.join(campaignDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    if (result.status !== 0 && args.failFast) process.exit(result.status || 1);
  }
  const failed = manifest.filter(item => item.status !== "success");
  console.log(`Batch complete: ${manifest.length - failed.length}/${manifest.length} succeeded.`);
  process.exit(failed.length ? 1 : 0);
} catch (error) {
  console.error(`batch-render: ${error.message}`);
  process.exitCode = 1;
}

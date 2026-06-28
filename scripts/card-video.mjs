#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", cwd: process.cwd(), ...options });
  if (result.status !== 0) process.exit(result.status || 1);
}
function usage() {
  console.log(`Usage:\n  npm run card-video -- init ./task\n  npm run card-video -- plan ./task/script.md --out ./task/video.json\n  npm run card-video -- validate ./task/video.json\n  npm run card-video -- render ./task --engine remotion --style y2k\n  npm run card-video -- batch ./campaign --engine remotion`);
}
function parseOptions(argv) {
  const opts = { rest: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.replace(/^--/, "");
      if (key === "fail-fast") opts[key] = true;
      else opts[key] = argv[++i];
    } else opts.rest.push(arg);
  }
  return opts;
}

const [command, target, ...argv] = process.argv.slice(2);
if (!command || command === "--help" || command === "-h") { usage(); process.exit(command ? 0 : 1); }
const opts = parseOptions(argv);

if (command === "init") {
  const dir = path.resolve(target || "./task");
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  fs.mkdirSync(path.join(dir, "output"), { recursive: true });
  if (!fs.existsSync(path.join(dir, "script.md"))) fs.writeFileSync(path.join(dir, "script.md"), "# Card video\n\nWrite your script here.\n");
  console.log(`Initialized ${dir}`);
} else if (command === "plan") {
  const input = target;
  const out = opts.out || path.join(path.dirname(input), "video.json");
  const args = ["scripts/create-video-spec.mjs", "--input", input, "--out", out];
  if (opts.style) args.push("--style", opts.style);
  if (opts.format) args.push("--format", opts.format);
  if (opts.language) args.push("--language", opts.language);
  run("node", args);
} else if (command === "validate") {
  const args = ["scripts/validate-video-spec.mjs", target];
  if (opts.report) args.push("--report", opts.report);
  run("node", args);
} else if (command === "render") {
  const dir = path.resolve(target || "./task");
  const spec = opts.input || path.join(dir, "video.json");
  const out = opts.out || path.join(dir, "output", "final.mp4");
  const args = ["scripts/render.sh", "--input", spec, "--out", out];
  if (opts.engine) args.push("--engine", opts.engine);
  if (opts.style) args.push("--style", opts.style);
  if (opts.format) args.push("--format", opts.format);
  if (opts.audio) args.push("--audio", opts.audio);
  else if (fs.existsSync(path.join(dir, "audio.mp3"))) args.push("--audio", path.join(dir, "audio.mp3"));
  if (opts.report) args.push("--report", opts.report);
  run("bash", args);
} else if (command === "batch") {
  const args = ["scripts/batch-render.mjs", target];
  if (opts.engine) args.push("--engine", opts.engine);
  if (opts.style) args.push("--style", opts.style);
  if (opts.format) args.push("--format", opts.format);
  if (opts["fail-fast"]) args.push("--fail-fast");
  run("node", args);
} else {
  usage();
  process.exit(1);
}

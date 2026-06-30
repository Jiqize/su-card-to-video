#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseScript } from "./lib/script-parser.mjs";
import { buildSpecFromParsed } from "./lib/spec-writer.mjs";

function parseArgs(argv) {
  const args = { input: "", out: "data/generated-video.json", style: "auto", format: "landscape", language: "zh-CN" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--input" || arg === "-i") args.input = argv[++i];
    else if (arg === "--out" || arg === "-o") args.out = argv[++i];
    else if (arg === "--style" || arg === "-s") args.style = argv[++i];
    else if (arg === "--format") args.format = argv[++i];
    else if (arg === "--motion") args.motion = argv[++i];
    else if (arg === "--language") args.language = argv[++i];
    else if (arg === "--scene-count") args.sceneCount = argv[++i];
    else if (arg === "--fps") args.fps = argv[++i];
    else if (!args.input) args.input = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  console.log(`Usage:\n  node scripts/create-video-spec.mjs --input script.md --out data/generated-video.json --style auto\n\nOptions:\n  --input, -i       Markdown or plain text script\n  --out, -o         Output JSON spec path\n  --style, -s       Style key or auto\n  --format          landscape | vertical | square | wide\n  --motion          Motion preset\n  --language        Language label\n  --scene-count     Optional target scene count\n  --fps             Frames per second`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.input) {
    usage();
    process.exit(args.help ? 0 : 1);
  }
  const inputPath = path.resolve(args.input);
  const outPath = path.resolve(args.out);
  const content = fs.readFileSync(inputPath, "utf8");
  const spec = buildSpecFromParsed(parseScript(content), args);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(spec, null, 2) + "\n");
  console.log(`Created ${path.relative(process.cwd(), outPath)}`);
  console.log(`Style: ${spec.meta.style}`);
  console.log(`Format: ${spec.meta.format}`);
  console.log(`Scenes: ${spec.scenes.length}`);
} catch (error) {
  console.error(`create-video-spec: ${error.message}`);
  process.exitCode = 1;
}

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { STYLE_KEYS } from "./lib/video-styles.mjs";
import { normalizeSpec, parseArgs, printHelp, readJson, renderMeta } from "./lib/video-spec.mjs";

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.listStyles) {
    console.log(STYLE_KEYS.join("\n"));
    return;
  }

  const inputPath = path.resolve(args.input);
  const outPath = path.resolve(args.out || "examples/generated-remotion/props.json");
  const spec = normalizeSpec(readJson(inputPath), args);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(spec, null, 2) + "\n");

  const metaPath = path.join(path.dirname(outPath), "render-meta.json");
  fs.writeFileSync(metaPath, JSON.stringify(renderMeta(spec), null, 2) + "\n");

  console.log(`Built ${path.relative(process.cwd(), outPath)}`);
  console.log(`Style: ${spec.style.key} (${spec.style.label})`);
  console.log(`Duration: ${spec.meta.duration}s`);
}

try {
  main();
} catch (error) {
  console.error(`build-remotion-props: ${error.message}`);
  process.exitCode = 1;
}

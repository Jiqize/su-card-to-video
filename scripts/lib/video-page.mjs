import { renderAnimation } from "./video-animation.mjs";
import { renderCss } from "./video-css.mjs";
import { esc, renderScene } from "./video-layouts.mjs";

export function renderVideoPage(spec) {
  const scenes = spec.scenes.map((scene, index) => renderScene(scene, spec, index)).join("");
  return [
    "<!doctype html>",
    `<html lang="${esc(spec.meta.language || "zh-CN")}"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>`,
    `<title>${esc(spec.meta.title)} | ${esc(spec.style.label)}</title><style>${renderCss(spec)}</style></head>`,
    `<body><div id="root" data-style="${esc(spec.style.key)}" data-format="${esc(spec.meta.format)}" data-motion="${esc(spec.meta.motion)}" data-composition-id="${esc(spec.meta.compositionId)}" data-start="0" data-duration="${spec.meta.duration}" data-width="${spec.meta.width}" data-height="${spec.meta.height}">`,
    scenes,
    `</div>${renderAnimation(spec)}</body></html>\n`
  ].join("");
}

import { renderCssBase } from "./video-css-base.mjs";
import { renderCssComponents } from "./video-css-components.mjs";
import { renderCssOverlays } from "./video-css-overlays.mjs";

export function renderCss(spec) {
  return [renderCssBase(spec), renderCssComponents(), renderCssOverlays()].join("\n");
}

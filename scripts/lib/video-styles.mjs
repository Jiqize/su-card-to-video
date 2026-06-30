import { styleGroupA } from "./video-style-group-a.mjs";
import { styleGroupB } from "./video-style-group-b.mjs";
import { styleGroupC } from "./video-style-group-c.mjs";
import { styleGroupD } from "./video-style-group-d.mjs";

export const STYLE_PRESETS = Object.assign({}, styleGroupA, styleGroupB, styleGroupC, styleGroupD);
export const STYLE_KEYS = Object.freeze(Object.keys(STYLE_PRESETS));

const ALIASES = {
  "de-stijl": "destijl",
  "de stijl": "destijl",
  "constructivism": "constructivist",
  "new typography": "new-typography",
  "minimalism": "minimal",
  "art deco": "art-deco",
  "art nouveau": "art-nouveau",
  "pop art": "pop-art",
  "new wave": "new-wave",
  "brutalism": "brutalist"
};

export function normalizeStyleKey(value) {
  if (!value) return "bauhaus";
  const raw = String(value).trim().toLowerCase();
  return ALIASES[raw] || raw;
}

export function getStylePreset(value) {
  const key = normalizeStyleKey(value);
  return STYLE_PRESETS[key] ? { key, ...STYLE_PRESETS[key] } : null;
}

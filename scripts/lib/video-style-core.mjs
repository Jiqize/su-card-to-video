export const SANS = "\"Inter\",\"Noto Sans SC\",\"PingFang SC\",system-ui,sans-serif";
export const SERIF = "\"Georgia\",\"Noto Serif SC\",serif";
export const MONO = "\"SFMono-Regular\",\"Cascadia Code\",monospace";
export const BLACK = "\"Arial Black\",\"Noto Sans SC\",system-ui,sans-serif";

const base = {
  bg: "#f5f3ee", fg: "#111", muted: "#666",
  accent: "#df2b24", accent2: "#2458d3", accent3: "#efc927",
  surface: "#fff", surface2: "#e9e5de", line: "#111", onAccent: "#fff",
  titleFont: SANS, bodyFont: SANS, monoFont: MONO,
  titleWeight: "800", titleTrack: "-0.04em",
  border: "3px", radius: "0px", shadow: "none",
  pattern: "none", patternSize: "auto", grain: ".10"
};

export const grid72 = "linear-gradient(90deg,rgba(0,0,0,.052) 1px,transparent 1px),linear-gradient(rgba(0,0,0,.052) 1px,transparent 1px)";
export const grid44 = "linear-gradient(rgba(114,233,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(114,233,255,.08) 1px,transparent 1px)";
export const dots = "radial-gradient(currentColor 2px,transparent 2.5px)";

export function make(label, description, tokens, motion = {}) {
  return {
    label,
    description,
    tokens: { ...base, ...tokens },
    motion: { entrance: "default", drift: "soft", intensity: .8, ...motion }
  };
}

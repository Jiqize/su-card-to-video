import { SERIF, make } from "./video-style-core.mjs";

export const styleGroupB = {
  minimal: make("Minimal", "Quiet luxury and restrained pacing.", {
    bg: "#f5f3ee", fg: "#1b1a18", muted: "#777169",
    accent: "#7d4e43", accent2: "#7a8374", accent3: "#d9d3c9",
    surface: "#faf9f6", surface2: "#e9e5de", line: "#aaa39a",
    titleWeight: "320", border: "1px",
    shadow: "0 24px 80px rgba(27,26,24,.08)", grain: ".05"
  }, { intensity: .55 }),

  "art-deco": make("Art Deco", "Black gold, premium frames.", {
    bg: "#11100f", fg: "#f3ead8", muted: "#aa9c83",
    accent: "#c9a45c", accent2: "#7b2632", accent3: "#f3ead8",
    surface: "#1c1a17", surface2: "#27231e", line: "#c9a45c",
    onAccent: "#11100f", titleFont: SERIF, titleWeight: "600",
    titleTrack: ".012em", border: "2px",
    shadow: "0 30px 90px rgba(201,164,92,.13)",
    pattern: "repeating-conic-gradient(from 0deg at 50% 110%,rgba(201,164,92,.1) 0 2deg,transparent 2deg 10deg)",
    patternSize: "100% 100%", grain: ".20"
  }, { drift: "gold", intensity: .8 }),

  "art-nouveau": make("Art Nouveau", "Organic curves and serif voice.", {
    bg: "#eee7d5", fg: "#17352a", muted: "#667466",
    accent: "#a04d3b", accent2: "#6d8468", accent3: "#d6c29b",
    surface: "#f7f0df", surface2: "#dfe2cf", line: "#42624f",
    titleFont: SERIF, bodyFont: SERIF, titleWeight: "600",
    border: "2px", radius: "30px",
    shadow: "0 24px 70px rgba(23,53,42,.10)"
  }, { drift: "organic", intensity: .7 }),

  surreal: make("Surreal", "Soft dream layers and floating shapes.", {
    bg: "#e9e7ed", fg: "#1e2340", muted: "#66677a",
    accent: "#e25b51", accent2: "#7056a4", accent3: "#a8c9d7",
    surface: "#f6f4f8", surface2: "#d9d5e5",
    titleFont: SERIF, titleWeight: "600", radius: "38px",
    shadow: "0 26px 80px rgba(30,35,64,.14)"
  }, { drift: "float", intensity: .85 })
};

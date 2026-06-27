import { BLACK, make, grid72 } from "./video-style-core.mjs";

export const styleGroupA = {
  bauhaus: make("Bauhaus", "Geometry, strict grid, primary accents.", {
    bg: "#f1ecdf", fg: "#111315", muted: "#5d564b",
    accent: "#df2b24", accent2: "#1d52a5", accent3: "#efc927",
    surface: "#fff8e8", surface2: "#ded5c5",
    titleFont: BLACK, titleWeight: "900", titleTrack: "-0.055em",
    border: "5px", pattern: grid72, patternSize: "72px 72px", grain: ".18"
  }, { drift: "geometry", intensity: 1 }),

  destijl: make("De Stijl", "Orthogonal rules and primary color planes.", {
    bg: "#f8f7f2", fg: "#080808", muted: "#44413d",
    accent: "#d92323", accent2: "#1650a0", accent3: "#f1d127",
    surface: "#fff", surface2: "#ecebe7",
    titleWeight: "850", titleTrack: "-0.05em", border: "8px"
  }, { drift: "orthogonal", intensity: .9 }),

  constructivist: make("Constructivist", "Diagonal poster energy.", {
    bg: "#e8dfcc", fg: "#111", muted: "#5d5548",
    accent: "#c91f1f", accent2: "#111", accent3: "#e8dfcc",
    surface: "#f4ebd8", surface2: "#d9cdb5",
    titleFont: "\"Impact\",\"Noto Sans SC\",sans-serif",
    titleWeight: "800", border: "4px",
    shadow: "10px 12px 0 rgba(0,0,0,.18)",
    pattern: "repeating-linear-gradient(-18deg,transparent 0 45px,rgba(0,0,0,.05) 45px 48px)",
    grain: ".24"
  }, { drift: "diagonal", intensity: 1.15 }),

  "new-typography": make("New Typography", "Asymmetric editorial grid.", {
    bg: "#f6f6f2", fg: "#111", muted: "#66645f",
    accent: "#e12b25", accent2: "#111", accent3: "#cfcfc8",
    surface: "#fff", surface2: "#e9e9e4",
    titleWeight: "620", titleTrack: "-0.055em", border: "2px",
    pattern: "linear-gradient(90deg,transparent 0 83px,rgba(0,0,0,.058) 83px 84px)",
    patternSize: "84px 100%"
  }, { drift: "vertical", intensity: .82 })
};

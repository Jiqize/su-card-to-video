import { BLACK, SANS, grid44, grid72, make } from "./video-style-core.mjs";

export const styleGroupD = {
  memphis: make("Memphis", "Playful shapes and rounded cards.", {
    bg: "#f3eadb", fg: "#171717", muted: "#676056",
    accent: "#ef6b84", accent2: "#42a6a2", accent3: "#f0c63f",
    surface: "#fff8ec", surface2: "#d9c9ef", onAccent: "#171717",
    titleWeight: "820", border: "4px", radius: "24px",
    shadow: "8px 8px 0 rgba(23,23,23,.18)"
  }, { drift: "playful", intensity: 1 }),

  punk: make("Punk", "Zine texture and noisy high contrast.", {
    bg: "#e9e5dc", fg: "#0d0d0d", muted: "#5c5952",
    accent: "#ef2c6b", accent2: "#d52222", accent3: "#f2e228",
    surface: "#f5f1e8", surface2: "#d4d0c8",
    titleFont: BLACK, titleWeight: "900", titleTrack: "-0.065em",
    border: "4px", shadow: "7px 7px 0 #0d0d0d", grain: ".28"
  }, { drift: "shake", intensity: 1.15 }),

  brutalist: make("Brutalist", "Heavy borders and raw blocks.", {
    bg: "#f5f5f2", fg: "#050505", muted: "#3f3f3f",
    accent: "#214cff", accent2: "#ff3b30", accent3: "#efef00",
    surface: "#fff", surface2: "#d9d9d4",
    titleFont: BLACK, bodyFont: "\"Arial\",\"Noto Sans SC\",system-ui,sans-serif",
    titleWeight: "900", titleTrack: "-0.07em",
    border: "7px", pattern: grid72, patternSize: "36px 36px"
  }, { drift: "block", intensity: .88 }),

  y2k: make("Y2K", "Glass panels, cyan grid, chrome title energy.", {
    bg: "#090d23", fg: "#f7fbff", muted: "#a8b6d4",
    accent: "#72e9ff", accent2: "#9b78ff", accent3: "#ff7bc4",
    surface: "rgba(20,31,65,.72)", surface2: "#111a3b",
    line: "#72e9ff", onAccent: "#071020",
    titleFont: "\"Trebuchet MS\"," + SANS,
    titleWeight: "650", titleTrack: "-0.055em",
    border: "2px", radius: "28px",
    shadow: "0 22px 70px rgba(72,194,255,.18)",
    pattern: grid44, patternSize: "44px 44px", grain: ".13"
  }, { drift: "scan", intensity: .95 })
};

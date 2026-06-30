import { BLACK, SERIF, SANS, dots, make } from "./video-style-core.mjs";

export const styleGroupC = {
  "pop-art": make("Pop Art", "Halftone dots and heavy outline.", {
    bg: "#f4d52b", fg: "#101010", muted: "#3c3514",
    accent: "#e62b25", accent2: "#1e63b6", accent3: "#fff",
    surface: "#fffdf3", surface2: "#f3b8c3",
    titleFont: BLACK, titleWeight: "900", titleTrack: "-0.06em",
    border: "6px", shadow: "12px 12px 0 #101010",
    pattern: dots, patternSize: "18px 18px", grain: ".12"
  }, { drift: "comic", intensity: 1.1 }),

  psychedelic: make("Psychedelic", "Neon radial rhythm.", {
    bg: "#29114a", fg: "#fff1c9", muted: "#d2bfd9",
    accent: "#b7f23d", accent2: "#ff54b0", accent3: "#ff7a34",
    surface: "#40225e", surface2: "#552f70", line: "#fff1c9",
    onAccent: "#29114a", titleFont: SERIF, titleWeight: "700",
    radius: "42px", shadow: "0 0 42px rgba(183,242,61,.18)"
  }, { drift: "wave", intensity: 1.05 }),

  postmodern: make("Postmodern", "Mixed type and collage offsets.", {
    bg: "#f0e9dd", fg: "#151515", muted: "#625d58",
    accent: "#dd2d86", accent2: "#168e8d", accent3: "#c9b7e6",
    surface: "#faf6ef", surface2: "#d9e4dd",
    titleFont: SERIF, bodyFont: "\"Trebuchet MS\"," + SANS,
    titleWeight: "600", border: "3px", radius: "6px",
    shadow: "8px 8px 0 #c9b7e6"
  }, { drift: "offset", intensity: .95 }),

  "new-wave": make("New Wave", "Digital editorial grid and neon lines.", {
    bg: "#e8e9ec", fg: "#111", muted: "#5a5b61",
    accent: "#ef3d91", accent2: "#1b9cca", accent3: "#f4d638",
    surface: "#f7f7f8", surface2: "#d6d7dc",
    titleFont: "\"Trebuchet MS\"," + SANS,
    titleWeight: "520", titleTrack: "-0.065em", border: "2px"
  }, { drift: "scan", intensity: .92 })
};

export const FORMAT_PRESETS = {
  landscape: { key: "landscape", width: 1920, height: 1080, label: "16:9 landscape", safeArea: { top: 76, right: 96, bottom: 42, left: 96 } },
  vertical: { key: "vertical", width: 1080, height: 1920, label: "9:16 vertical", safeArea: { top: 88, right: 72, bottom: 118, left: 72 } },
  square: { key: "square", width: 1080, height: 1080, label: "1:1 square", safeArea: { top: 70, right: 70, bottom: 70, left: 70 } },
  wide: { key: "wide", width: 2100, height: 900, label: "21:9 wide", safeArea: { top: 64, right: 112, bottom: 42, left: 112 } }
};

export const FORMAT_KEYS = Object.freeze(Object.keys(FORMAT_PRESETS));

export function normalizeFormatKey(value) {
  if (!value) return "landscape";
  const raw = String(value).trim().toLowerCase();
  const aliases = {
    "16:9": "landscape",
    "horizontal": "landscape",
    "9:16": "vertical",
    "portrait": "vertical",
    "shorts": "vertical",
    "reels": "vertical",
    "1:1": "square",
    "21:9": "wide",
    "banner": "wide"
  };
  return aliases[raw] || raw;
}

export function getFormatPreset(value) {
  const key = normalizeFormatKey(value);
  return FORMAT_PRESETS[key] || null;
}

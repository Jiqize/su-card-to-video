import fs from "node:fs";

function toSeconds(value) {
  const text = String(value || "").trim().replace(",", ".");
  const match = text.match(/(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?/);
  if (!match) return null;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const ms = Number((match[4] || "0").padEnd(3, "0"));
  return hours * 3600 + minutes * 60 + seconds + ms / 1000;
}

function parseTimedBlocks(content) {
  const blocks = content.replace(/\r/g, "").split(/\n\s*\n/g);
  const captions = [];
  for (const block of blocks) {
    const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
    if (!lines.length) continue;
    const timeLine = lines.find(line => line.includes("-->"));
    if (!timeLine) continue;
    const [startRaw, endRaw] = timeLine.split("-->").map(part => part.trim().split(/\s+/)[0]);
    const start = toSeconds(startRaw);
    const end = toSeconds(endRaw);
    const textLines = lines.slice(lines.indexOf(timeLine) + 1);
    if (start !== null && end !== null && textLines.length) captions.push({ start, end, text: textLines.join(" ") });
  }
  return captions;
}

export function parseCaptionFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith(".json")) {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.captions || [];
  }
  if (filePath.endsWith(".srt") || filePath.endsWith(".vtt")) return parseTimedBlocks(content);
  return content.split(/\n+/).map((text, index) => ({ start: index * 2.2, end: index * 2.2 + 2, text: text.trim() })).filter(item => item.text);
}

export function normalizeCaptions(value) {
  if (!Array.isArray(value)) return [];
  return value.map(item => ({ start: Number(item.start), end: Number(item.end), text: String(item.text || "").trim() })).filter(item => Number.isFinite(item.start) && Number.isFinite(item.end) && item.end > item.start && item.text);
}

export function distributeCaptionsToScenes(captions, scenes) {
  if (!captions.length) return scenes;
  return scenes.map(scene => {
    const sceneStart = Number(scene.start || 0);
    const sceneEnd = sceneStart + Number(scene.duration || 0);
    const localCaptions = captions
      .filter(caption => caption.end > sceneStart && caption.start < sceneEnd)
      .map(caption => ({ ...caption, start: Math.max(0, Number((caption.start - sceneStart).toFixed(3))), end: Math.min(scene.duration, Number((caption.end - sceneStart).toFixed(3))) }));
    return localCaptions.length ? { ...scene, captions: localCaptions, caption: scene.caption || localCaptions[0].text } : scene;
  });
}

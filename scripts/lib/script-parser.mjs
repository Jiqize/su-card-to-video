function clean(value) { return String(value || "").trim(); }
function stripMd(value) { return clean(value).replace(/^#+\s*/, "").replace(/^[-*]\s*/, "").replace(/^\d+[.)]\s*/, ""); }
function sentences(text) { return clean(text).split(/(?<=[。！？.!?])\s+/).map(clean).filter(Boolean); }
function titleCase(text, fallback) {
  const value = stripMd(text).replace(/[:：]$/, "");
  return value.length > 58 ? value.slice(0, 56) + "…" : value || fallback;
}

export function parseScript(content) {
  const raw = String(content || "").replace(/\r/g, "");
  const lines = raw.split("\n").map(line => line.trim());
  const heading = lines.find(line => /^#{1,3}\s+/.test(line));
  const title = titleCase(heading || lines.find(Boolean) || "Card video", "Card video");
  const paragraphs = raw.split(/\n\s*\n/g).map(block => block.trim()).filter(Boolean);
  const bodyParagraphs = paragraphs.filter(block => !/^#{1,3}\s+/.test(block));
  const bullets = lines.filter(line => /^[-*]\s+/.test(line)).map(stripMd);
  const numbered = lines.filter(line => /^\d+[.)]\s+/.test(line)).map(stripMd);
  const numericMatches = raw.match(/(?:\d+(?:\.\d+)?\s?%|[$¥€]\s?\d+(?:\.\d+)?|\d{2,}(?:\.\d+)?[万亿kmb]?)/gi) || [];

  return {
    title,
    lead: titleCase(bodyParagraphs[0] || "Use one script to generate reusable card-video scenes.", "Use one script to generate reusable card-video scenes."),
    paragraphs: bodyParagraphs,
    bullets,
    numbered,
    numbers: Array.from(new Set(numericMatches)).slice(0, 4),
    closing: titleCase(bodyParagraphs[bodyParagraphs.length - 1] || "Render, review, and reuse the final video.", "Render, review, and reuse the final video."),
    allText: raw,
    sentenceList: sentences(raw)
  };
}

export function estimateDuration(sceneCount, words) {
  const base = Math.max(12, Math.min(42, Math.ceil((words || 80) / 8)));
  return Math.max(sceneCount * 3.2, base);
}

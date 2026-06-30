import { recommendStyle } from "./style-recommender.mjs";
import { estimateDuration } from "./script-parser.mjs";

function trimTitle(value, fallback) {
  const text = String(value || fallback || "").trim().replace(/\s+/g, " ");
  return text.length > 58 ? text.slice(0, 56) + "…" : text;
}
function caption(value) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return text.length > 86 ? text.slice(0, 84) + "…" : text;
}
function cardify(items, fallback) {
  const source = items.length ? items : fallback;
  return source.slice(0, 4).map((item, index) => ({ title: trimTitle(item, `Point ${index + 1}`), body: caption(item) }));
}

export function buildSpecFromParsed(parsed, options = {}) {
  const text = parsed.allText || "";
  const style = options.style && options.style !== "auto" ? options.style : recommendStyle(text, "bauhaus");
  const format = options.format || "landscape";
  const targetCount = Number(options.sceneCount) > 0 ? Number(options.sceneCount) : null;
  const scenes = [];
  const wordCount = text.split(/\s+/).filter(Boolean).length + Math.ceil((text.match(/[\u4e00-\u9fff]/g) || []).length / 2);

  scenes.push({
    layout: "cover",
    duration: 4,
    kicker: "Card Video",
    title: trimTitle(parsed.title, "Card video"),
    lead: caption(parsed.lead),
    caption: caption(parsed.lead),
    marquee: "script / spec / style / motion / mp4"
  });

  const cardItems = parsed.bullets.length ? parsed.bullets : parsed.paragraphs.slice(1, 5);
  scenes.push({
    layout: "cards",
    duration: 4.8,
    kicker: "Key Points",
    title: "Core message",
    lead: "The script is condensed into short, readable card-video scenes.",
    cards: cardify(cardItems, [parsed.lead, parsed.closing, "Render the final video locally."]),
    caption: "Each card should carry one idea only."
  });

  if (parsed.numbered.length >= 2) {
    scenes.push({
      layout: "process",
      duration: 5.2,
      kicker: "Process",
      title: "Step by step",
      steps: parsed.numbered.slice(0, 4).map((item, index) => ({ title: trimTitle(item, `Step ${index + 1}`), body: caption(item) })),
      caption: "The numbered list becomes a clear video sequence."
    });
  }

  if (parsed.numbers.length >= 1) {
    scenes.push({
      layout: "metrics",
      duration: 4.2,
      kicker: "Numbers",
      title: "Data worth showing",
      lead: "Large numbers and percentages become a visual emphasis scene.",
      metrics: parsed.numbers.slice(0, 3).map((value, index) => ({ value, label: index === 0 ? "hero metric" : `metric ${index + 1}` })),
      caption: "Use numbers only when they clarify the message."
    });
  }

  scenes.push({
    layout: "closing",
    duration: 3.4,
    kicker: "Takeaway",
    title: trimTitle(parsed.closing, "Render the next video"),
    lead: "Review the JSON, choose a style, and render through HyperFrames or Remotion.",
    cta: "npm run render",
    caption: "The generated spec is a draft. Edit before final render."
  });

  const finalScenes = targetCount ? scenes.slice(0, Math.max(3, Math.min(targetCount, scenes.length))) : scenes;
  const totalDuration = estimateDuration(finalScenes.length, wordCount);
  const scale = totalDuration / finalScenes.reduce((sum, scene) => sum + scene.duration, 0);

  return {
    version: "0.4",
    meta: {
      title: trimTitle(parsed.title, "Card video"),
      kicker: "su-card-to-video",
      style,
      motion: options.motion || "editorial",
      format,
      fps: Number(options.fps) > 0 ? Number(options.fps) : 30,
      compositionId: "su-card-to-video-generated",
      language: options.language || "zh-CN"
    },
    scenes: finalScenes.map(scene => ({ ...scene, duration: Number((scene.duration * scale).toFixed(2)) }))
  };
}

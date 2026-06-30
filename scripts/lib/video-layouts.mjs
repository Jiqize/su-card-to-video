function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function text(value) { return esc(value).replaceAll("\n", "<br>"); }
function list(value, fallback) { return Array.isArray(value) && value.length ? value : fallback; }
function top(scene, spec) { return `<div class="topline"><span>${esc(scene.kicker || spec.meta.kicker)}</span><span>${esc(scene.meta || spec.style.label)}</span></div>`; }
function timedCaptions(scene) {
  if (!Array.isArray(scene.captions) || !scene.captions.length) return "";
  return `<div class="timed-captions">${scene.captions.map(caption => `<span data-start="${caption.start}" data-end="${caption.end}">${text(caption.text)}</span>`).join("")}</div>`;
}
function caption(scene) { return `${scene.caption ? `<div class="caption">${text(scene.caption)}</div>` : ""}${timedCaptions(scene)}`; }
function bg() { return `<div class="scene-bg"><span class="shape shape-one"></span><span class="shape shape-two"></span><span class="shape shape-three"></span></div>`; }
function motif(scene) { return `<div class="visual-stack"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="motif-grid"><i class="motif-piece a"></i><i class="motif-piece b"></i><i class="motif-piece c"></i><i class="motif-piece d"></i></div><div class="ticker marquee"><span class="marquee-track">${esc(scene.marquee || "HTML / CSS / GSAP / FFMPEG / LOCAL VIDEO")}</span></div></div>`; }
function assetPanel(scene, spec) {
  const assetId = scene.asset || scene.media;
  const asset = assetId && Array.isArray(spec.assets) ? spec.assets.find(item => item.id === assetId) : null;
  if (!asset || !asset.path) return motif(scene);
  return `<figure class="visual-stack asset-panel"><img src="${esc(asset.path)}" alt="${esc(asset.alt || asset.id)}"/><figcaption>${esc(asset.caption || asset.credit || asset.id)}</figcaption></figure>`;
}

function cover(scene, spec) {
  return `<div class="scene-grid two-col"><div class="copy-block">${top(scene, spec)}<div class="kicker">${esc(scene.kicker || spec.meta.kicker)}</div><h1 class="title">${text(scene.title || spec.meta.title)}</h1><p class="lead">${text(scene.lead || "")}</p></div>${assetPanel(scene, spec)}</div>${caption(scene)}`;
}
function cards(scene, spec) {
  const cards = list(scene.cards, [{ title: "JSON driven", body: "Write content once and generate a reusable HTML composition." }, { title: "Style selectable", body: "Switch visual systems with one flag." }, { title: "Motion ready", body: "Scenes, captions, and motifs animate together." }]);
  return `<div class="scene-grid single"><div>${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Engine")}</div><h2 class="title title-md">${text(scene.title || "Reusable video engine")}</h2>${scene.lead ? `<p class="lead narrow">${text(scene.lead)}</p>` : ""}<div class="card-grid count-${Math.min(cards.length, 4)}">${cards.map((card, i) => `<article class="info-card"><span class="index">${String(i + 1).padStart(2, "0")}</span><h3>${text(card.title || `Card ${i + 1}`)}</h3><p>${text(card.body || card.text || "")}</p></article>`).join("")}</div></div></div>${caption(scene)}`;
}
function process(scene, spec) {
  const steps = list(scene.steps, [{ title: "Script", body: "Write a short script." }, { title: "Cards", body: "Build HTML composition." }, { title: "Motion", body: "Animate scene rhythm." }, { title: "Mux", body: "Combine audio and video." }]);
  return `<div class="scene-grid single"><div>${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Workflow")}</div><h2 class="title title-md">${text(scene.title || "From idea to MP4")}</h2><div class="process-line">${steps.map((step, i) => `<article class="step-card"><span class="index">${String(i + 1).padStart(2, "0")}</span><h3>${text(step.title || `Step ${i + 1}`)}</h3><p>${text(step.body || step.text || "")}</p></article>`).join("")}</div></div></div>${caption(scene)}`;
}
function metrics(scene, spec) {
  const metrics = list(scene.metrics, [{ value: "16", label: "visual systems" }, { value: "5", label: "scene layouts" }, { value: "1", label: "render command" }]);
  const hero = metrics[0];
  return `<div class="scene-grid two-col metrics-layout"><div class="copy-block">${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Metrics")}</div><h2 class="title title-md">${text(scene.title || "Production defaults")}</h2>${scene.lead ? `<p class="lead">${text(scene.lead)}</p>` : ""}</div><div class="metric-panel pulse"><div><div class="hero-number">${esc(hero.value)}</div><div class="hero-label">${esc(hero.label || "")}</div></div><div class="metric-list">${metrics.slice(1).map(metric => `<div class="metric-row"><strong>${esc(metric.value)}</strong><span>${esc(metric.label || "")}</span></div>`).join("")}</div></div></div>${caption(scene)}`;
}
function closing(scene, spec) {
  return `<div class="scene-grid closing-layout"><div class="closing-panel">${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Ready")}</div><h2 class="title">${text(scene.title || "Render the next video")}</h2>${scene.lead ? `<p class="lead narrow">${text(scene.lead)}</p>` : ""}<div class="cta-row"><span class="pill">${esc(scene.cta || "npm run render")}</span><span class="pill ghost">${esc(spec.style.label)}</span></div></div></div>${caption(scene)}`;
}
function quote(scene, spec) { return `<div class="scene-grid closing-layout"><div class="closing-panel quote-panel">${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Quote")}</div><h2 class="title">“${text(scene.quote || scene.title)}”</h2>${scene.lead ? `<p class="lead narrow">${text(scene.lead)}</p>` : ""}</div></div>${caption(scene)}`; }
function dataStory(scene, spec) {
  const items = scene.data?.items || scene.metrics || [];
  return `<div class="scene-grid two-col metrics-layout"><div class="copy-block">${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Data")}</div><h2 class="title title-md">${text(scene.title || "Data story")}</h2>${scene.lead ? `<p class="lead">${text(scene.lead)}</p>` : ""}</div><div class="metric-panel chart-panel">${items.map(item => `<div class="metric-row"><strong>${esc(item.value)}</strong><span>${esc(item.label || item.name || "")}</span></div>`).join("")}</div></div>${caption(scene)}`;
}
function product(scene, spec) { return `<div class="scene-grid two-col"><div class="copy-block">${top(scene, spec)}<div class="kicker">${esc(scene.kicker || "Product")}</div><h2 class="title title-md">${text(scene.title || "Product story")}</h2>${scene.lead ? `<p class="lead">${text(scene.lead)}</p>` : ""}</div>${assetPanel(scene, spec)}</div>${caption(scene)}`; }

const layouts = { cover, cards, process, metrics, closing, quote, comparison: cards, "before-after": cards, timeline: process, ranking: process, "myth-fact": cards, checklist: process, framework: cards, "case-study": cards, "data-story": dataStory, product, gallery: product, faq: process };
export { esc };
export function renderScene(scene, spec, index) {
  const renderer = layouts[scene.layout] || cards;
  return `<section id="${scene.id}" class="scene ${index === 0 ? "is-first" : ""}" data-layout="${scene.layout}" data-start="${scene.start}" data-duration="${scene.duration}">${bg()}${renderer(scene, spec)}</section>`;
}

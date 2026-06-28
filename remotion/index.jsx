import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  registerRoot,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const fallbackSpec = {
  meta: {
    title: "Card Video",
    kicker: "su-card-to-video",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 12,
    compositionId: "CardVideo"
  },
  style: {
    key: "bauhaus",
    label: "Bauhaus",
    tokens: {
      bg: "#f1ecdf",
      fg: "#111315",
      muted: "#5d564b",
      accent: "#df2b24",
      accent2: "#1d52a5",
      accent3: "#efc927",
      surface: "#fff8e8",
      surface2: "#ded5c5",
      line: "#111315",
      onAccent: "#ffffff",
      titleFont: "Arial Black, Noto Sans SC, system-ui, sans-serif",
      bodyFont: "Inter, Noto Sans SC, system-ui, sans-serif",
      monoFont: "SFMono-Regular, Cascadia Code, monospace",
      titleWeight: "900",
      titleTrack: "-0.055em",
      border: "5px",
      radius: "0px",
      shadow: "none"
    }
  },
  scenes: [
    {
      id: "scene-1",
      layout: "cover",
      start: 0,
      duration: 4,
      title: "Card video",
      lead: "JSON driven content and selectable visual systems.",
      caption: "Rendered through Remotion."
    },
    {
      id: "scene-2",
      layout: "closing",
      start: 4,
      duration: 4,
      title: "Reusable renderer",
      lead: "Switch between HyperFrames and Remotion.",
      caption: "Use --engine remotion."
    }
  ]
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const text = (value, fallback = "") => String(value ?? fallback);
const asList = (value, fallback) => (Array.isArray(value) && value.length ? value : fallback);

function getCompositionMeta(props) {
  const meta = props?.meta || fallbackSpec.meta;
  const fps = Number(meta.fps) > 0 ? Number(meta.fps) : 30;
  const duration = Number(meta.duration) > 0 ? Number(meta.duration) : fallbackSpec.meta.duration;
  return {
    fps,
    width: Number(meta.width) > 0 ? Number(meta.width) : 1920,
    height: Number(meta.height) > 0 ? Number(meta.height) : 1080,
    durationInFrames: Math.max(1, Math.ceil(duration * fps))
  };
}

function sceneFrames(scene, fps) {
  return {
    from: Math.max(0, Math.round(Number(scene.start || 0) * fps)),
    duration: Math.max(1, Math.round(Number(scene.duration || 1) * fps))
  };
}

function sceneOpacity(frame, duration) {
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [Math.max(0, duration - 18), duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(fadeIn, fadeOut);
}

function Layout({ scene, spec, children }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spec.style.tokens;
  const duration = sceneFrames(scene, fps).duration;
  const progress = frame / Math.max(1, duration);
  const opacity = sceneOpacity(frame, duration);
  const y = interpolate(frame, [0, 28], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        overflow: "hidden",
        background: t.bg,
        color: t.fg,
        fontFamily: t.bodyFont
      }}
    >
      <Background tokens={t} frame={frame} progress={progress} styleKey={spec.style.key} />
      <div style={{ position: "absolute", inset: 0, padding: "76px 96px 68px", zIndex: 4 }}>{children}</div>
      {scene.caption ? <Caption tokens={t}>{scene.caption}</Caption> : null}
    </AbsoluteFill>
  );
}

function Background({ tokens: t, frame, progress, styleKey }) {
  const spin = frame * 0.32;
  const drift = Math.sin(progress * Math.PI * 2) * 18;
  const grid = styleKey === "y2k" || styleKey === "brutalist" || styleKey === "bauhaus";
  return (
    <AbsoluteFill style={{ zIndex: 1, background: t.bg }}>
      {grid ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(90deg,currentColor 1px,transparent 1px),linear-gradient(currentColor 1px,transparent 1px)",
            backgroundSize: styleKey === "y2k" ? "44px 44px" : "72px 72px",
            color: t.line
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          width: 290,
          height: 290,
          borderRadius: 999,
          right: 70 + drift,
          top: 78 - drift,
          background: t.accent,
          mixBlendMode: styleKey === "y2k" ? "screen" : "multiply",
          opacity: 0.9
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 230,
          height: 230,
          left: 70 - drift,
          bottom: 126 + drift,
          background: t.accent2,
          transform: `rotate(${12 + spin / 5}deg)`,
          opacity: 0.82
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 22,
          right: 340,
          bottom: 156,
          background: t.accent3,
          transform: `rotate(${-8 + spin / 12}deg)`,
          opacity: 0.9
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 460,
          height: 460,
          left: -180,
          bottom: -150,
          border: `${t.border} solid ${t.accent2}`,
          borderRadius: 999,
          transform: `rotate(${-spin}deg)`,
          opacity: 0.42
        }}
      />
    </AbsoluteFill>
  );
}

function Topline({ scene, spec }) {
  const t = spec.style.tokens;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.monoFont, fontSize: 19, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: t.muted, marginBottom: 56 }}>
      <span>{text(scene.kicker || spec.meta.kicker)}</span>
      <span>{spec.style.label}</span>
    </div>
  );
}

function Kicker({ tokens: t, children }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 16, color: t.accent, fontFamily: t.monoFont, fontSize: 23, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 28 }}><span style={{ width: 50, height: t.border, background: t.accent }} />{children}</div>;
}

function Title({ tokens: t, children, small = false, center = false }) {
  return <h1 style={{ margin: 0, maxWidth: small ? 1280 : 940, fontFamily: t.titleFont, fontWeight: t.titleWeight, letterSpacing: t.titleTrack, fontSize: small ? 82 : 104, lineHeight: small ? 1.02 : 0.96, textAlign: center ? "center" : "left", whiteSpace: "pre-line" }}>{children}</h1>;
}

function Lead({ tokens: t, children, center = false }) {
  if (!children) return null;
  return <p style={{ maxWidth: 980, margin: center ? "34px auto 0" : "34px 0 0", color: t.muted, fontSize: 33, lineHeight: 1.46, fontWeight: 560, textAlign: center ? "center" : "left", whiteSpace: "pre-line" }}>{children}</p>;
}

function Caption({ tokens: t, children }) {
  return <div style={{ position: "absolute", left: 96, right: 96, bottom: 42, zIndex: 8, minHeight: 66, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 28px", border: `${t.border} solid ${t.line}`, borderRadius: t.radius, background: t.surface, boxShadow: t.shadow, fontSize: 29, lineHeight: 1.34, fontWeight: 760, textAlign: "center" }}>{children}</div>;
}

function Cover({ scene, spec }) {
  const t = spec.style.tokens;
  return (
    <Layout scene={scene} spec={spec}>
      <div style={{ display: "grid", gridTemplateColumns: "1.02fr .98fr", gap: 58, alignItems: "center", height: "100%" }}>
        <div>
          <Topline scene={scene} spec={spec} />
          <Kicker tokens={t}>{text(scene.kicker || spec.meta.kicker)}</Kicker>
          <Title tokens={t}>{text(scene.title || spec.meta.title)}</Title>
          <Lead tokens={t}>{scene.lead}</Lead>
        </div>
        <Motif scene={scene} tokens={t} />
      </div>
    </Layout>
  );
}

function Motif({ scene, tokens: t }) {
  const frame = useCurrentFrame();
  const offset = (frame * 2) % 500;
  return (
    <div style={{ position: "relative", minHeight: 720, border: `${t.border} solid ${t.line}`, borderRadius: t.radius, background: t.surface, boxShadow: t.shadow, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: "92px 78px 118px", display: "grid", gridTemplateColumns: "1.12fr .88fr", gridTemplateRows: ".82fr 1.18fr", border: `${t.border} solid ${t.line}` }}>
        {[t.surface, t.accent, t.accent2, t.accent3].map((color, index) => <i key={index} style={{ display: "block", background: color, borderRight: index % 2 === 0 ? `${t.border} solid ${t.line}` : 0, borderBottom: index < 2 ? `${t.border} solid ${t.line}` : 0 }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 78, borderTop: `${t.border} solid ${t.line}`, background: t.fg, color: t.bg, overflow: "hidden", display: "flex", alignItems: "center", fontFamily: t.monoFont, fontSize: 24, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        <span style={{ transform: `translateX(${-offset}px)`, display: "inline-block", minWidth: "180%" }}>{text(scene.marquee || "script / card / motion / audio / mp4")} / {text(scene.marquee || "script / card / motion / audio / mp4")}</span>
      </div>
    </div>
  );
}

function Cards({ scene, spec }) {
  const t = spec.style.tokens;
  const cards = asList(scene.cards, [
    { title: "JSON driven", body: "Edit content in a spec file." },
    { title: "Style selectable", body: "Switch visual systems with one flag." },
    { title: "Motion ready", body: "Render with Remotion or HyperFrames." }
  ]);
  return (
    <Layout scene={scene} spec={spec}>
      <Topline scene={scene} spec={spec} />
      <Kicker tokens={t}>{text(scene.kicker || "Engine")}</Kicker>
      <Title tokens={t} small>{text(scene.title || "Reusable card-video engine")}</Title>
      <Lead tokens={t}>{scene.lead}</Lead>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${clamp(cards.length, 2, 4)}, minmax(0, 1fr))`, gap: 28, marginTop: 54 }}>
        {cards.map((card, index) => <InfoCard key={index} index={index} item={card} tokens={t} />)}
      </div>
    </Layout>
  );
}

function InfoCard({ item, index, tokens: t }) {
  const bg = index === 2 ? t.accent : index === 3 ? t.accent2 : index === 1 ? t.surface2 : t.surface;
  const fg = index >= 2 ? t.onAccent : t.fg;
  return <article style={{ minHeight: 270, padding: 32, border: `${t.border} solid ${t.line}`, borderRadius: t.radius, background: bg, color: fg, boxShadow: t.shadow }}><span style={{ display: "block", marginBottom: 26, fontFamily: t.monoFont, fontSize: 21, fontWeight: 800, letterSpacing: ".12em", opacity: .72 }}>{String(index + 1).padStart(2, "0")}</span><h3 style={{ margin: "0 0 16px", fontFamily: t.titleFont, fontSize: 42, lineHeight: 1.05, letterSpacing: t.titleTrack }}>{text(item.title)}</h3><p style={{ margin: 0, fontSize: 25, lineHeight: 1.46, opacity: .78 }}>{text(item.body || item.text)}</p></article>;
}

function Process({ scene, spec }) {
  const t = spec.style.tokens;
  const steps = asList(scene.steps, [
    { title: "Write", body: "Create the JSON spec." },
    { title: "Style", body: "Pick a visual system." },
    { title: "Render", body: "Use Remotion for video." },
    { title: "Mux", body: "Combine audio with FFmpeg." }
  ]);
  return (
    <Layout scene={scene} spec={spec}>
      <Topline scene={scene} spec={spec} />
      <Kicker tokens={t}>{text(scene.kicker || "Workflow")}</Kicker>
      <Title tokens={t} small>{text(scene.title || "From script to video")}</Title>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${clamp(steps.length, 2, 4)}, minmax(0, 1fr))`, marginTop: 56, border: `${t.border} solid ${t.line}`, background: t.surface, boxShadow: t.shadow }}>
        {steps.map((step, index) => <div key={index} style={{ minHeight: 330, padding: 32, borderRight: index === steps.length - 1 ? 0 : `${t.border} solid ${t.line}`, background: index === 2 ? t.accent : index === 3 ? t.accent2 : index === 1 ? t.surface2 : t.surface, color: index >= 2 ? t.onAccent : t.fg }}><span style={{ fontFamily: t.monoFont, fontSize: 21, fontWeight: 800, opacity: .72 }}>{String(index + 1).padStart(2, "0")}</span><h3 style={{ margin: "88px 0 16px", fontFamily: t.titleFont, fontSize: 42, lineHeight: 1.05, letterSpacing: t.titleTrack }}>{text(step.title)}</h3><p style={{ margin: 0, fontSize: 25, lineHeight: 1.46, opacity: .78 }}>{text(step.body || step.text)}</p></div>)}
      </div>
    </Layout>
  );
}

function Metrics({ scene, spec }) {
  const t = spec.style.tokens;
  const metrics = asList(scene.metrics, [{ value: "16", label: "style presets" }, { value: "5", label: "scene layouts" }, { value: "1", label: "render command" }]);
  const hero = metrics[0];
  return (
    <Layout scene={scene} spec={spec}>
      <div style={{ display: "grid", gridTemplateColumns: ".92fr 1.08fr", gap: 58, alignItems: "center", height: "100%" }}>
        <div>
          <Topline scene={scene} spec={spec} />
          <Kicker tokens={t}>{text(scene.kicker || "Metrics")}</Kicker>
          <Title tokens={t} small>{text(scene.title || "Production defaults")}</Title>
          <Lead tokens={t}>{scene.lead}</Lead>
        </div>
        <div style={{ minHeight: 650, padding: 42, display: "flex", flexDirection: "column", justifyContent: "space-between", border: `${t.border} solid ${t.line}`, borderRadius: t.radius, background: t.surface, boxShadow: t.shadow }}>
          <div><div style={{ fontFamily: t.titleFont, fontWeight: t.titleWeight, fontSize: 250, lineHeight: .78, letterSpacing: "-.07em", color: t.accent }}>{text(hero.value)}</div><div style={{ marginTop: 12, fontFamily: t.monoFont, fontSize: 27, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: t.muted }}>{text(hero.label)}</div></div>
          <div style={{ display: "grid", gap: 16 }}>{metrics.slice(1).map((metric, index) => <div key={index} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 24, alignItems: "center", paddingTop: 18, borderTop: `${t.border} solid ${t.line}` }}><strong style={{ fontFamily: t.titleFont, fontSize: 60, lineHeight: .95, color: t.accent }}>{text(metric.value)}</strong><span style={{ fontSize: 26, lineHeight: 1.35, color: t.muted }}>{text(metric.label)}</span></div>)}</div>
        </div>
      </div>
    </Layout>
  );
}

function Closing({ scene, spec }) {
  const t = spec.style.tokens;
  return (
    <Layout scene={scene} spec={spec}>
      <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
        <div style={{ width: 1380, maxWidth: "100%", padding: "86px 92px", border: `${t.border} solid ${t.line}`, borderRadius: t.radius, background: t.surface, boxShadow: t.shadow, textAlign: "center" }}>
          <Topline scene={scene} spec={spec} />
          <div style={{ display: "inline-flex" }}><Kicker tokens={t}>{text(scene.kicker || "Ready")}</Kicker></div>
          <Title tokens={t} center>{text(scene.title || "Render the next video")}</Title>
          <Lead tokens={t} center>{scene.lead}</Lead>
          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 44 }}><span style={{ padding: "14px 20px", border: `${t.border} solid ${t.line}`, borderRadius: 999, background: t.accent, color: t.onAccent, fontFamily: t.monoFont, fontSize: 19, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>{text(scene.cta || "npm run render")}</span><span style={{ padding: "14px 20px", border: `${t.border} solid ${t.line}`, borderRadius: 999, fontFamily: t.monoFont, fontSize: 19, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>{spec.style.label}</span></div>
        </div>
      </div>
    </Layout>
  );
}

const sceneComponents = { cover: Cover, cards: Cards, process: Process, metrics: Metrics, closing: Closing };

export const CardVideo = (props) => {
  const spec = props?.meta ? props : fallbackSpec;
  const fps = Number(spec.meta.fps) > 0 ? Number(spec.meta.fps) : 30;
  return (
    <AbsoluteFill style={{ background: spec.style.tokens.bg }}>
      {spec.scenes.map((scene, index) => {
        const Component = sceneComponents[scene.layout] || Cards;
        const frames = sceneFrames(scene, fps);
        return <Sequence key={scene.id || index} from={frames.from} durationInFrames={frames.duration}><Component scene={scene} spec={spec} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};

const RemotionRoot = () => {
  const meta = getCompositionMeta(fallbackSpec);
  return (
    <Composition
      id="CardVideo"
      component={CardVideo}
      defaultProps={fallbackSpec}
      fps={meta.fps}
      width={meta.width}
      height={meta.height}
      durationInFrames={meta.durationInFrames}
      calculateMetadata={({ props }) => getCompositionMeta(props)}
    />
  );
};

registerRoot(RemotionRoot);

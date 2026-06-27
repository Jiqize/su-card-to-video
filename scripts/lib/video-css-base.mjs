function vars(tokens) {
  return Object.entries({
    "--bg": tokens.bg, "--fg": tokens.fg, "--muted": tokens.muted, "--accent": tokens.accent, "--accent-2": tokens.accent2, "--accent-3": tokens.accent3,
    "--surface": tokens.surface, "--surface-2": tokens.surface2, "--line": tokens.line, "--on-accent": tokens.onAccent,
    "--title-font": tokens.titleFont, "--body-font": tokens.bodyFont, "--mono-font": tokens.monoFont,
    "--title-weight": tokens.titleWeight, "--title-track": tokens.titleTrack, "--border": tokens.border, "--radius": tokens.radius,
    "--shadow": tokens.shadow, "--pattern": tokens.pattern, "--pattern-size": tokens.patternSize, "--grain-opacity": tokens.grain
  }).map(([key, value]) => `${key}:${value};`).join("");
}

export function renderCssBase(spec) {
  return `
:root{--canvas-w:${spec.meta.width}px;--canvas-h:${spec.meta.height}px;${vars(spec.style.tokens)}}
*{box-sizing:border-box}html,body{margin:0;min-height:100%}
body{background:#101012;color:var(--fg);font-family:var(--body-font);-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
#root{position:relative;width:var(--canvas-w);height:var(--canvas-h);overflow:hidden;isolation:isolate;background:var(--bg);color:var(--fg)}
#root::before{content:"";position:absolute;inset:0;z-index:0;background:var(--pattern);background-size:var(--pattern-size);pointer-events:none}
#root::after{content:"";position:absolute;inset:0;z-index:20;pointer-events:none;opacity:var(--grain-opacity);background-image:radial-gradient(circle at 20% 30%,rgba(255,255,255,.22) 0 1px,transparent 1.2px),radial-gradient(circle at 78% 18%,rgba(0,0,0,.14) 0 1px,transparent 1.2px);background-size:15px 15px,19px 19px;mix-blend-mode:soft-light}
.scene{position:absolute;inset:0;padding:76px 96px 68px;opacity:0;overflow:hidden;transform:translateZ(0)}.scene.is-first{opacity:1}
.scene-bg{position:absolute;inset:0;z-index:1;pointer-events:none}.scene-grid{position:relative;z-index:3;width:100%;height:100%;display:grid;gap:58px;align-items:center}.two-col{grid-template-columns:1.02fr .98fr}.single{grid-template-columns:1fr}.closing-layout{place-items:center;text-align:center}
.topline{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;gap:28px;font-family:var(--mono-font);font-size:19px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.copy-block,.closing-panel{position:relative;min-height:690px;padding-top:66px}.kicker{display:inline-flex;align-items:center;gap:16px;margin-bottom:28px;font-family:var(--mono-font);color:var(--accent);font-size:23px;font-weight:800;letter-spacing:.18em;text-transform:uppercase}.kicker::before{content:"";width:50px;height:max(3px,var(--border));background:currentColor}
.title{margin:0;max-width:940px;font-family:var(--title-font);font-weight:var(--title-weight);letter-spacing:var(--title-track);font-size:104px;line-height:.96;text-wrap:balance}.title-md{max-width:1280px;font-size:82px;line-height:1.02}.lead{max-width:780px;margin:34px 0 0;color:color-mix(in srgb,var(--fg) 78%,transparent);font-size:33px;line-height:1.46;font-weight:560;text-wrap:pretty}.lead.narrow{max-width:980px}
`;
}

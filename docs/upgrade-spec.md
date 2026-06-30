# Upgrade spec

Status: draft
Target scope: v0.4 to v1.0
Repository branch: feature/multistyle-video-engine

This document defines the next-stage product and technical specification for `su-card-to-video`. The current baseline already supports a JSON-driven video spec, 16 visual styles, HyperFrames rendering, Remotion rendering, audio duration alignment, validation, generated HTML, generated Remotion props, and FFmpeg muxing. The next stage should turn the project into a stable local card-video production system that can be operated by humans and coding agents.

## 1. Product goals

1. Accept a plain script, structured JSON, prepared audio, and optional local assets.
2. Generate publishable 16:9 and 9:16 card videos with selectable visual systems.
3. Keep HyperFrames as the simplest HTML renderer.
4. Use Remotion for componentized video logic, richer timing, captions, and future production features.
5. Keep all core workflows local and reproducible.
6. Keep the Skill friendly to Codex, Claude Code, Cursor Agent, and other coding agents.
7. Preserve a clean boundary around voice generation. The project can accept audio from any source, while the core repository does not bind to one voice API.

## 2. Non goals

1. No hosted SaaS requirement in the core workflow.
2. No forced dependency on Jianying, CapCut, or any manual editing tool.
3. No mandatory image generation API.
4. No built-in voice cloning service.
5. No direct publishing automation in the core renderer. Publishing can become an optional integration later.
6. No hidden remote dependency for rendering.

## 3. Current baseline

The baseline contains these capabilities:

1. `data/demo-video.json` as the default source of truth.
2. `scripts/validate-video-spec.mjs` for structural validation.
3. `scripts/build-video-html.mjs` for HyperFrames HTML generation.
4. `scripts/build-remotion-props.mjs` for Remotion props generation.
5. `scripts/render.sh` as the default renderer router.
6. `scripts/render-remotion.sh` as the Remotion render path.
7. `scripts/lib/video-styles.mjs` plus four style group files for 16 visual styles.
8. `remotion/index.jsx` as the Remotion `CardVideo` composition.
9. Five scene layouts: `cover`, `cards`, `process`, `metrics`, and `closing`.
10. FFmpeg muxing for user audio or silent placeholder audio.

## 4. Target architecture

The upgraded system should have five layers.

### 4.1 Input layer

Supported input forms:

1. Plain text script or markdown script.
2. Existing JSON video spec.
3. Prepared audio file.
4. Optional transcript file.
5. Optional local assets, including screenshots, product images, logos, SVG diagrams, and chart data.
6. Optional batch manifest for multi-video rendering.

### 4.2 Planning layer

The planning layer converts script-level input into a video spec.

Required outputs:

1. Main message.
2. Scene list.
3. Layout selection per scene.
4. Suggested style.
5. Suggested format.
6. Caption text.
7. Estimated duration.
8. Optional voiceover script.
9. Optional asset references.

Initial implementation can be rule-based. A coding agent can later enrich the generated spec.

### 4.3 Spec layer

The JSON spec remains the source of truth. All renderer-specific files are generated from it.

Generated files:

1. `examples/generated-16x9/index.html`
2. `examples/generated-16x9/render-meta.json`
3. `examples/generated-remotion/props.json`
4. `examples/generated-remotion/render-meta.json`

### 4.4 Render layer

Supported renderers:

1. HyperFrames for HTML-first rendering.
2. Remotion for React component rendering and frame-accurate sequencing.

Both renderers should receive the same normalized spec and produce semantically equivalent videos.

### 4.5 Delivery layer

Delivery outputs:

1. Final MP4.
2. Raw visual MP4.
3. Silent placeholder audio when no audio is supplied.
4. Poster frame PNG.
5. Keyframe PNGs per scene.
6. Render metadata.
7. Quality report.
8. Batch manifest when rendering multiple videos.

## 5. Canonical JSON spec

The canonical spec should evolve from the current `data/demo-video.json` shape. The following structure is the target contract.

```json
{
  "version": "0.4",
  "meta": {
    "title": "AI Card Video Pipeline",
    "kicker": "su-card-to-video",
    "style": "bauhaus",
    "motion": "editorial",
    "format": "landscape",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "compositionId": "su-card-to-video-generated",
    "language": "zh-CN"
  },
  "audio": {
    "path": "./voice.mp3",
    "transcript": "./transcript.srt",
    "duration": 24.8,
    "source": "recorded"
  },
  "assets": [],
  "scenes": [],
  "output": {
    "engine": "remotion",
    "path": "examples/generated-remotion/output/final.mp4",
    "posterFrame": 0
  }
}
```

## 6. Meta fields

### 6.1 Required meta fields

1. `title`: project title.
2. `style`: visual style key.
3. `format`: target format.
4. `fps`: frame rate.
5. `compositionId`: renderer timeline or composition identifier.

### 6.2 Optional meta fields

1. `kicker`: reusable small label.
2. `motion`: motion preset key.
3. `language`: content language.
4. `safeArea`: custom title and caption safe area.
5. `brand`: optional brand token set.
6. `themeOverrides`: optional style token overrides.

## 7. Format support

Target formats:

1. `landscape`: 1920 by 1080.
2. `vertical`: 1080 by 1920.
3. `square`: 1080 by 1080.
4. `wide`: 2100 by 900.

Each format needs layout-specific reflow rules.

Landscape should prefer two-column covers, horizontal process rows, and bottom captions.
Vertical should prefer stacked covers, single-column cards, larger safe area, and shorter captions.
Square should prefer compact cards and center-aligned hierarchy.
Wide should prefer editorial banner composition and fewer text blocks.

## 8. Audio spec

The audio object describes an already prepared audio file or a silent placeholder.

Fields:

1. `path`: local audio path.
2. `transcript`: optional SRT, VTT, JSON, or plain text transcript path.
3. `duration`: duration in seconds.
4. `source`: `recorded`, `tts`, `voice-clone`, `silent`, or `external`.
5. `provider`: optional provider label.
6. `voice`: optional voice label.
7. `language`: optional audio language.

Renderer behavior:

1. If `path` is present, use `ffprobe` as source of truth for duration.
2. If `duration` is present and no audio exists, create silent placeholder audio.
3. If transcript timing exists, captions use transcript timing.
4. If transcript has no timing, distribute captions over scenes.

## 9. Captions and timing

Captions should support two levels.

### 9.1 Scene captions

Each scene can define one bottom caption:

```json
{
  "caption": "Generate a 16:9 HTML composition, then render it to MP4."
}
```

### 9.2 Timed captions

Each scene can define timed caption segments:

```json
{
  "captions": [
    { "start": 0.2, "end": 1.8, "text": "Write content once." },
    { "start": 1.8, "end": 3.4, "text": "Render it through Remotion." }
  ]
}
```

Target behavior:

1. Remotion renders timed captions with frame precision.
2. HyperFrames can render scene-level captions first.
3. Word-level highlighting is optional and should start in Remotion.
4. Captions must respect safe area.
5. Captions should support emphasis spans later.

## 10. Asset spec

Assets allow videos to include local images, screenshots, logos, and SVGs.

```json
{
  "assets": [
    {
      "id": "product-shot",
      "type": "image",
      "path": "./assets/product.png",
      "fit": "cover",
      "alt": "Product screenshot"
    }
  ]
}
```

Supported asset types:

1. `image`
2. `svg`
3. `logo`
4. `screenshot`
5. `chart-data`
6. `video-snippet`, later

Asset constraints:

1. Paths must be local or repository-relative.
2. Missing assets should produce validation errors.
3. Renderers should provide a visual fallback for optional assets.
4. Assets should remain decoupled from image generation APIs.

## 11. Scene model

Every scene should support:

```json
{
  "id": "scene-1",
  "layout": "cover",
  "duration": 4,
  "kicker": "AI Card Video",
  "title": "Turn a script into motion cards",
  "lead": "JSON owns the content.",
  "caption": "Generate a composition, then render it to MP4.",
  "motion": "default",
  "tone": "neutral"
}
```

Required fields:

1. `layout`
2. `title`

Recommended fields:

1. `duration`
2. `caption`
3. `kicker`
4. `lead`

Optional fields:

1. `cards`
2. `steps`
3. `metrics`
4. `assets`
5. `captions`
6. `cta`
7. `marquee`
8. `data`
9. `themeOverrides`

## 12. Layout roadmap

Current layouts:

1. `cover`
2. `cards`
3. `process`
4. `metrics`
5. `closing`

Target V01 to V18 layout set:

1. `cover`: opening title and motif.
2. `cards`: three or four information cards.
3. `process`: workflow steps.
4. `metrics`: hero number and metrics.
5. `closing`: summary and CTA.
6. `quote`: quote or founder statement.
7. `comparison`: side-by-side comparison.
8. `before-after`: transformation story.
9. `timeline`: chronological sequence.
10. `ranking`: ordered list.
11. `myth-fact`: misconception and correction.
12. `checklist`: action checklist.
13. `framework`: 2 by 2 or 3 part model.
14. `case-study`: problem, action, result.
15. `data-story`: chart with explanation.
16. `product`: product screenshot and feature copy.
17. `gallery`: image or screenshot grid.
18. `faq`: question and answer sequence.

## 13. Visual style model

A style preset should contain:

1. Color tokens.
2. Typography tokens.
3. Border and radius tokens.
4. Surface and shadow tokens.
5. Pattern and texture tokens.
6. Shape grammar.
7. Motion tone.
8. Optional format-specific overrides.

Existing style keys:

```text
bauhaus
destijl
constructivist
new-typography
minimal
art-deco
art-nouveau
surreal
pop-art
psychedelic
postmodern
new-wave
memphis
punk
brutalist
y2k
```

## 14. Motion model

Motion should be controlled separately from visual style.

Target motion presets:

1. `calm`: soft fades and slow drift.
2. `editorial`: title reveals and rule-line movement.
3. `kinetic`: fast card entry and stronger transitions.
4. `cinematic`: slower scale, blur, and depth.
5. `glitch`: scanline, jitter, and digital cuts.
6. `comic`: bounce and snap transitions.
7. `luxury`: slow gold-frame movement and restrained opacity changes.

Motion fields:

1. `entrance`
2. `transition`
3. `caption`
4. `motif`
5. `intensity`
6. `reduceMotion`

Renderer parity target:

1. HyperFrames can implement CSS and GSAP motion.
2. Remotion can implement frame-based React motion.
3. Both renderers should respect `motion` and `reduceMotion`.

## 15. Renderer contract

Both renderers must support:

1. Normalized spec input.
2. All required scene layouts.
3. Style tokens.
4. Duration scaling.
5. Caption safe areas.
6. Final MP4 output.
7. Render metadata.

HyperFrames renderer responsibilities:

1. Generate single HTML composition.
2. Use GSAP timeline.
3. Prioritize simplicity and inspectability.
4. Keep good compatibility with existing HTML/CSS agents.

Remotion renderer responsibilities:

1. Use React components for every layout.
2. Use `Sequence` for scenes.
3. Use frame-accurate animation.
4. Support timed captions first.
5. Support still frame and keyframe export later.
6. Support richer asset and chart components later.

## 16. Script to spec planner

A planner should convert unstructured input into JSON.

Input forms:

1. Markdown article.
2. Plain voiceover script.
3. Product notes.
4. Data summary.
5. Transcript.

Planner output:

1. Proposed `meta`.
2. Scene breakdown.
3. Layout per scene.
4. Caption text.
5. Duration estimate.
6. Style recommendation.
7. Missing input warnings.

Initial rule-based planner:

1. First heading becomes cover title.
2. Numbered lists become process scenes.
3. Percentages and large numbers become metrics scenes.
4. Final paragraph becomes closing scene.
5. Remaining paragraphs become cards.

## 17. Validation and quality report

The validator should produce two outputs.

1. CLI-readable warnings and errors.
2. `quality-report.json` for agents.

Validation categories:

1. Structural validity.
2. Missing fields.
3. Unsupported style.
4. Unsupported layout.
5. Invalid asset path.
6. Invalid audio path.
7. Duration mismatch.
8. Caption overflow risk.
9. Title length risk.
10. Scene density risk.
11. Format compatibility risk.

Quality score categories:

1. Readability.
2. Timing.
3. Narrative structure.
4. Visual fit.
5. Caption quality.
6. Delivery readiness.

## 18. Batch rendering

Batch mode should render multiple specs under one campaign directory.

Example command:

```bash
npm run batch -- ./campaign --engine remotion --style y2k
```

Campaign directory target shape:

```text
campaign/
  specs/
    video-001.json
    video-002.json
  audio/
    video-001.mp3
    video-002.mp3
  assets/
  output/
  manifest.json
```

Batch manifest should include:

1. Spec path.
2. Style.
3. Format.
4. Engine.
5. Audio path.
6. Duration.
7. Output path.
8. Poster path.
9. Validation result.
10. Render status.

## 19. Poster and keyframe export

Target commands:

```bash
npm run poster -- --style bauhaus --frame 0
npm run keyframes -- --engine remotion
```

Poster outputs:

1. `poster.png`
2. `scene-01.png`
3. `scene-02.png`
4. `contact-sheet.png`

Use cases:

1. Video cover image.
2. Visual QA.
3. Style gallery.
4. Social card reuse.

## 20. Style gallery

A gallery command should preview all visual styles against the same spec.

Target command:

```bash
npm run gallery -- --input data/demo-video.json
```

Outputs:

1. 16 still frames.
2. Optional 16 short preview clips.
3. Contact sheet.
4. HTML gallery page.

Gallery metadata:

1. Style key.
2. Style label.
3. Recommended use.
4. Output file path.

## 21. Data and chart components

Target chart components:

1. Bar chart.
2. Line chart.
3. Score card.
4. Matrix.
5. Radar chart, later.
6. Funnel chart, later.

Chart input should live in JSON:

```json
{
  "layout": "data-story",
  "data": {
    "type": "bar",
    "items": [
      { "label": "A", "value": 42 },
      { "label": "B", "value": 68 }
    ]
  }
}
```

## 22. CLI target design

The current scripts can remain. A future CLI can wrap them.

Target commands:

```bash
npm run card-video -- init ./task
npm run card-video -- plan ./task/script.md
npm run card-video -- validate ./task/video.json
npm run card-video -- render ./task --engine remotion --style y2k
npm run card-video -- gallery ./task
npm run card-video -- poster ./task
```

CLI goals:

1. One entry point.
2. Clear task directory model.
3. Agent-friendly output.
4. Machine-readable logs.
5. Stable exit codes.

## 23. Agent contract

Agents should follow this order:

1. Read `skill/SKILL.md`.
2. Gather or create the user script.
3. Build or modify JSON spec.
4. Choose style and format.
5. Validate.
6. Render preview.
7. Read quality report.
8. Fix spec.
9. Render final MP4.
10. Report output paths and known limitations.

Agents should avoid editing generated HTML or generated Remotion props unless debugging renderer internals.

## 24. Success criteria

The next completed upgrade should satisfy these criteria:

1. A user can paste a script and get a valid JSON spec.
2. A user can render the same spec through HyperFrames and Remotion.
3. A user can render at least landscape and vertical videos.
4. A user can pass audio and receive timing-aligned visuals.
5. A user can export a poster image.
6. A user can preview all 16 styles.
7. Validator can produce a machine-readable quality report.
8. Batch mode can render more than one video with a manifest.
9. Skill documentation tells an agent exactly what to edit and what commands to run.

## 25. Open design questions

1. Should vertical format be a first-class default or an optional output variant.
2. Should timed captions use SRT, VTT, or a custom JSON structure as canonical source.
3. Should Remotion become the default renderer after caption and poster export mature.
4. Should style presets include topic recommendations in machine-readable form.
5. Should the repository include example audio or keep all audio generated locally.
6. Should future publishing workflows live in this repository or in a separate integration package.

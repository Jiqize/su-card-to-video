# Upgrade plan

Status: draft
Target scope: v0.4 to v1.0
Repository branch: feature/multistyle-video-engine

This plan turns `docs/upgrade-spec.md` into an implementation roadmap. The current branch already includes JSON-driven content, 16 styles, HyperFrames rendering, Remotion rendering, validation, generated workspaces, and audio-aware render scripts. The next objective is to turn the project into a stable local card-video production system.

## 1. Principles

1. Keep the project local-first.
2. Keep JSON as the source of truth.
3. Keep renderer output reproducible.
4. Keep HyperFrames as the simple HTML path.
5. Use Remotion for richer sequencing, timed captions, previews, and future production features.
6. Give coding agents stable files to edit and stable commands to run.
7. Add one complete vertical slice at a time.
8. Keep generated files out of manual editing workflows.
9. Make every milestone testable from the command line.

## 2. Priority order

1. Script to spec planner.
2. Timed captions and transcript support.
3. Vertical and square format support.
4. Poster and keyframe export.
5. Style gallery.
6. Quality report.
7. Asset layer.
8. Additional video layouts.
9. Batch rendering.
10. Unified CLI.

## 3. Milestone v0.4: script to spec planner

Goal: let users start from a script or markdown file instead of hand-writing JSON.

Scope:

1. Add `scripts/create-video-spec.mjs`.
2. Accept `--input script.md` and `--out data/generated-video.json`.
3. Generate a valid spec with `meta`, `scenes`, style recommendation, format, and estimated duration.
4. Use rule-based parsing first.
5. Keep generated spec human-editable.
6. Add `--language` and `--scene-count` options.

Parser rules:

1. First heading becomes cover title.
2. First paragraph becomes cover lead.
3. Numbered list becomes process scene.
4. Bulleted list becomes cards scene.
5. Percentages, currency, and large numbers become metrics scene.
6. Final paragraph becomes closing scene.
7. Short content generates cover, cards, closing.
8. Longer content generates cover, cards, process, metrics, closing.

Files:

1. `scripts/create-video-spec.mjs`
2. `scripts/lib/script-parser.mjs`
3. `scripts/lib/spec-writer.mjs`
4. `scripts/lib/style-recommender.mjs`
5. `docs/video-spec.md`
6. `skill/SKILL.md`
7. `README.md`

Acceptance:

1. A markdown file can generate a valid JSON spec.
2. The generated spec passes validation.
3. Generated scenes have titles and captions.
4. The planner produces 3 to 6 scenes by default.
5. The generated spec can render through HyperFrames and Remotion.

Test commands:

```bash
node scripts/create-video-spec.mjs --input ./examples/scripts/demo.md --out ./data/generated-video.json
node scripts/validate-video-spec.mjs ./data/generated-video.json
npm run render -- --input data/generated-video.json --style bauhaus
npm run render -- --engine remotion --input data/generated-video.json --style y2k
```

## 4. Milestone v0.5: timed captions and transcript support

Goal: move from scene-level captions to timed captions that can track prepared audio.

Scope:

1. Add `captions` array support to scene spec.
2. Add transcript loader for SRT and VTT.
3. Add JSON caption format.
4. Render timed captions in Remotion first.
5. Keep HyperFrames support at scene-caption level initially.
6. Add caption validation.
7. Add safe area checks for caption length.

Target spec:

```json
{
  "layout": "cards",
  "title": "Three ideas",
  "captions": [
    { "start": 0.2, "end": 1.8, "text": "First, write the idea." },
    { "start": 1.8, "end": 3.4, "text": "Then, turn it into cards." }
  ]
}
```

Files:

1. `scripts/lib/captions.mjs`
2. `scripts/validate-video-spec.mjs`
3. `scripts/lib/video-spec.mjs`
4. `remotion/index.jsx`
5. `scripts/lib/video-layouts.mjs`
6. `docs/video-spec.md`
7. `docs/remotion.md`

Acceptance:

1. SRT can be parsed into timed captions.
2. VTT can be parsed into timed captions.
3. Timed captions appear in Remotion renders.
4. Captions respect bottom safe area.
5. Validator reports overlapping captions.
6. Validator reports captions outside scene duration.
7. Validator warns when caption text is too long.

Future extension:

1. Word-level highlighting.
2. Karaoke-style progress.
3. Keyword emphasis.
4. Bilingual captions.
5. Exported subtitles as SRT or VTT.

## 5. Milestone v0.6: vertical and square format support

Goal: support short-video and social output formats.

Scope:

1. Add `meta.format` support.
2. Add landscape, vertical, square, and wide presets.
3. Add layout reflow rules per format.
4. Add safe area model.
5. Update validators for format-specific text density.
6. Update both renderers.
7. Add `--format` argument to scripts.

Target formats:

1. `landscape`: 1920 by 1080.
2. `vertical`: 1080 by 1920.
3. `square`: 1080 by 1080.
4. `wide`: 2100 by 900.

Acceptance:

1. `--format vertical` generates 1080 by 1920 output.
2. Cover layout reflows into stacked vertical composition.
3. Cards layout uses one-column or two-column vertical rules.
4. Caption safe area is larger in vertical mode.
5. Remotion and HyperFrames both accept the same format field.
6. Validator warns when a scene is too dense for vertical.

Suggested command:

```bash
npm run render -- --engine remotion --style y2k --format vertical
```

## 6. Milestone v0.7: poster, keyframes, and style gallery

Goal: give users visual previews and video cover assets.

Scope:

1. Add poster export command.
2. Add scene keyframe export.
3. Add 16-style gallery generation.
4. Add contact sheet generation.
5. Prefer Remotion still export first.
6. Add HyperFrames fallback later.

Target commands:

```bash
npm run poster -- --engine remotion --style bauhaus
npm run keyframes -- --engine remotion
npm run gallery -- --input data/demo-video.json
```

Acceptance:

1. Poster PNG exports from frame 0.
2. Scene keyframes export for every scene start.
3. Gallery renders all 16 style keys.
4. Gallery writes a manifest.
5. Contact sheet can be generated locally.
6. Gallery output can be used for design QA.

Output targets:

```text
previews/poster.png
previews/keyframes/scene-01.png
previews/keyframes/scene-02.png
previews/style-gallery/bauhaus.png
previews/style-gallery/contact-sheet.png
previews/style-gallery/manifest.json
```

## 7. Milestone v0.8: quality report

Goal: make validation actionable for humans and agents.

Scope:

1. Extend validator to produce `quality-report.json`.
2. Add scoring by category.
3. Add recommended fixes.
4. Add machine-readable output mode.
5. Add renderer parity checks.
6. Add per-scene density and timing notes.

Quality categories:

1. Structure.
2. Readability.
3. Timing.
4. Captions.
5. Visual density.
6. Asset readiness.
7. Renderer compatibility.
8. Delivery readiness.

Target command:

```bash
node scripts/validate-video-spec.mjs data/demo-video.json --report examples/generated-remotion/quality-report.json
```

Acceptance:

1. Report includes total score.
2. Report includes errors, warnings, and suggestions.
3. Report includes per-scene notes.
4. Report exits nonzero on blocking errors.
5. Agent can use the report to revise JSON spec.
6. Report includes renderer compatibility flags.

## 8. Milestone v0.9: asset layer and data components

Goal: allow videos to use local images, logos, screenshots, SVGs, and chart data.

Scope:

1. Add `assets` object to spec.
2. Validate local asset paths.
3. Add image panel component.
4. Add logo placement.
5. Add chart data scene support.
6. Add product and data-story layouts.
7. Add placeholder behavior for optional assets.

Asset fields:

1. `id`
2. `type`
3. `path`
4. `fit`
5. `alt`
6. `required`
7. `caption`
8. `credit`

Layouts to add:

1. `product`
2. `data-story`
3. `comparison`
4. `quote`
5. `timeline`

Acceptance:

1. Missing required asset blocks render and returns validation error.
2. Optional missing asset uses placeholder.
3. Remotion can render local images from props.
4. HyperFrames can render local relative image paths.
5. Chart data can render at least bar chart and score card.
6. Asset paths remain local or repository-relative.

## 9. Milestone v1.0: batch rendering and unified CLI

Goal: make the Skill useful for campaign-level production.

Scope:

1. Add task directory model.
2. Add campaign manifest.
3. Add batch render command.
4. Add unified `card-video` CLI wrapper.
5. Add predictable logs and exit codes.
6. Add docs for end-to-end workflows.
7. Add partial error handling in batch mode.

Task directory shape:

```text
task/
  script.md
  video.json
  audio.mp3
  assets/
  output/
  report.json
```

Campaign directory shape:

```text
campaign/
  specs/
  audio/
  assets/
  output/
  manifest.json
```

Target CLI:

```bash
npm run card-video -- init ./task
npm run card-video -- plan ./task/script.md
npm run card-video -- validate ./task/video.json
npm run card-video -- render ./task --engine remotion --style y2k
npm run card-video -- batch ./campaign --engine remotion
```

Acceptance:

1. One task can be initialized from scratch.
2. One markdown script can produce a draft spec.
3. One task can render final MP4.
4. One campaign can render multiple videos.
5. Batch manifest records status per video.
6. CLI returns stable exit codes.
7. Batch mode supports a stop-on-error option.

## 10. Engineering tasks by file area

Spec and validation:

1. Extend `scripts/lib/video-spec.mjs` with `format`, `audio`, `assets`, `captions`, and `motion`.
2. Extend `scripts/validate-video-spec.mjs` with quality report mode.
3. Add validation fixtures.
4. Add sample specs for each layout family.

HyperFrames renderer:

1. Add format-aware CSS.
2. Add more layout renderers.
3. Add scene-caption compatibility with the new caption model.
4. Add image and chart components.
5. Add output metadata checks.

Remotion renderer:

1. Split `remotion/index.jsx` into smaller components.
2. Add timed caption component.
3. Add format-aware layout components.
4. Add still export scripts.
5. Add chart and asset components.
6. Add shared animation utilities.

Scripts:

1. Add planner script.
2. Add poster script.
3. Add keyframes script.
4. Add gallery script.
5. Add batch script.
6. Add unified CLI.
7. Add shared path resolution helpers.

Documentation:

1. Update README for every milestone.
2. Update `skill/SKILL.md` for agent usage.
3. Keep `docs/video-spec.md` as the canonical JSON reference.
4. Keep `docs/remotion.md` focused on renderer behavior.
5. Keep `docs/visual-styles.md` focused on style selection and extension.
6. Keep `docs/upgrade-spec.md` and `docs/upgrade-plan.md` aligned.

## 11. Test plan

Static checks:

1. Validate default spec.
2. Validate generated spec from markdown.
3. Validate unsupported style fails.
4. Validate unsupported layout fails.
5. Validate missing required asset fails.
6. Validate caption timing overlaps fail.
7. Validate format-specific safe area warnings.

Build checks:

1. Build HyperFrames HTML.
2. Build Remotion props.
3. Confirm both metadata files have matching duration.
4. Confirm scene count matches in both renderers.
5. Confirm width, height, and fps match target format.
6. Confirm props contain style tokens.

Render checks:

1. Render HyperFrames demo MP4.
2. Render Remotion demo MP4.
3. Render with prepared audio.
4. Render without audio.
5. Render vertical output.
6. Render poster PNG.
7. Render style gallery.
8. Render batch campaign.

Manual QA:

1. First frame is not blank.
2. Text is readable on a laptop and phone screen.
3. Captions stay within safe area.
4. Scene transitions feel clean.
5. Final frame feels complete.
6. Audio does not cut off early.
7. Visual duration matches audio duration.
8. Style selection feels meaningfully different across presets.

## 12. Release plan

v0.4 release:

1. `create-video-spec` command works.
2. Generated spec validates.
3. README documents script input.
4. Skill doc tells agents how to plan from script.
5. Demo markdown fixture exists.

v0.5 release:

1. SRT parser works.
2. VTT parser works.
3. Remotion timed captions render.
4. Caption validator works.
5. Example spec includes timed captions.

v0.6 release:

1. `--format vertical` works.
2. `--format square` works.
3. Remotion vertical render works.
4. HyperFrames vertical render works.
5. Docs include landscape, vertical, and square examples.

v0.7 release:

1. Poster export works.
2. Keyframe export works.
3. Style gallery works.
4. Contact sheet works.
5. Preview manifest exists.

v0.8 release:

1. JSON report exists.
2. Agent suggestions are actionable.
3. Validator catches caption, timing, asset, and density risks.
4. Quality report path is documented.

v0.9 release:

1. Local images render.
2. Logos render.
3. Bar chart renders.
4. Product layout works.
5. Data-story layout works.
6. Missing asset validation works.

v1.0 release:

1. Unified CLI works.
2. Task initialization works.
3. Batch rendering works.
4. Campaign manifest records status.
5. Docs include complete end-to-end examples.
6. Migration notes from v0.3 exist.

## 13. Dependency policy

1. Keep Remotion and React in regular dependencies because Remotion rendering is a first-class renderer.
2. Keep HyperFrames as the simple renderer path.
3. Keep FFmpeg and ffprobe as system dependencies.
4. Avoid adding heavy chart libraries until data-story layouts need them.
5. Prefer SVG and CSS for first chart components.
6. Avoid runtime network calls in core render scripts.

## 14. Backward compatibility

1. Existing `data/demo-video.json` should remain valid.
2. Existing `npm run render -- --style y2k` should keep working.
3. HyperFrames remains the default engine.
4. New fields should be optional unless a new command explicitly requires them.
5. Generated output directories should remain ignored by git.
6. Old scene-level `caption` should keep rendering after timed captions are added.

## 15. Immediate next recommendation

The next coding task should be v0.4 script planner. It has the highest leverage because it changes the user experience from editing JSON manually to generating a draft spec from an article or narration script.

Suggested first PR after the current branch:

1. Add `scripts/create-video-spec.mjs`.
2. Add parser and writer helpers.
3. Add `examples/scripts/demo.md`.
4. Add `npm run plan` command.
5. Update README and Skill docs.
6. Add validation command to the generated spec workflow.

Suggested acceptance command sequence:

```bash
npm run plan -- --input examples/scripts/demo.md --out data/generated-video.json
node scripts/validate-video-spec.mjs data/generated-video.json
npm run render -- --input data/generated-video.json --style bauhaus
npm run render -- --engine remotion --input data/generated-video.json --style y2k
```

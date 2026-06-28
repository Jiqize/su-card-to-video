# Upgrade plan

Status: draft
Target scope: v0.4 to v1.0
Repository branch: feature/multistyle-video-engine

This plan turns the upgrade specification into an implementation roadmap. The plan assumes the current branch already contains JSON-driven content, 16 styles, HyperFrames renderer, Remotion renderer, validation, generated workspaces, and audio-aware render scripts.

## 1. Planning principles

1. Keep the project local-first.
2. Keep JSON as the source of truth.
3. Keep renderer output reproducible.
4. Keep HyperFrames as the simple HTML path.
5. Use Remotion for richer animation, timed captions, posters, and future production features.
6. Give coding agents stable files to edit and stable commands to run.
7. Add one complete vertical slice at a time.

## 2. Priority order

The recommended order is:

1. Script to spec planner.
2. Timed captions and transcript support.
3. Vertical format support.
4. Poster and keyframe export.
5. Style gallery.
6. Quality report.
7. Asset layer.
8. More video layouts.
9. Batch rendering.
10. Unified CLI.

This order creates the fastest path from demo-level rendering to practical production.

## 3. Milestone v0.4: script to spec planner

Goal: let users start from a script or markdown file instead of hand-writing JSON.

### Scope

1. Add `scripts/create-video-spec.mjs`.
2. Accept `--input script.md` and `--out data/generated-video.json`.
3. Generate a valid spec with `meta`, `scenes`, style recommendation, format, and estimated duration.
4. Use rule-based parsing first.
5. Keep generated spec human-editable.

### Suggested command

```bash
node scripts/create-video-spec.mjs --input ./script.md --out ./data/generated-video.json --style auto
```

### Rule-based parser behavior

1. First heading becomes cover title.
2. First paragraph becomes cover lead.
3. Numbered list becomes process scene.
4. Bulleted list becomes cards scene.
5. Percentages, currency, and large numbers become metrics scene.
6. Final paragraph becomes closing scene.
7. If content is short, generate cover, cards, closing.
8. If content is long, generate cover, cards, process, metrics, closing.

### Files to add or modify

1. `scripts/create-video-spec.mjs`
2. `scripts/lib/script-parser.mjs`
3. `scripts/lib/spec-writer.mjs`
4. `docs/video-spec.md`
5. `skill/SKILL.md`
6. `README.md`

### Acceptance criteria

1. A markdown file can generate a valid JSON spec.
2. `npm run validate` passes on the generated spec.
3. Generated scenes have titles and captions.
4. The planner produces 3 to 6 scenes by default.
5. The planner never edits generated HTML or generated Remotion props.

### Risks

1. Rule-based parsing can produce generic scenes.
2. Long Chinese text may need smarter sentence splitting.
3. Style recommendation may feel shallow until topic rules improve.

### Follow-up improvements

1. Add topic-to-style mapping.
2. Add language-specific sentence segmentation.
3. Add agent prompt template for rewriting generated specs.

## 4. Milestone v0.5: timed captions and transcript support

Goal: move from scene-level captions to timed captions that can track audio.

### Scope

1. Add `captions` array support to scene spec.
2. Add transcript loader for SRT and VTT.
3. Add JSON caption format.
4. Render timed captions in Remotion first.
5. Keep HyperFrames support at scene-caption level initially.
6. Add caption validation.

### Target spec

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

### Files to add or modify

1. `scripts/lib/captions.mjs`
2. `scripts/validate-video-spec.mjs`
3. `remotion/index.jsx`
4. `scripts/lib/video-layouts.mjs`
5. `docs/video-spec.md`
6. `docs/remotion.md`

### Acceptance criteria

1. SRT can be parsed into timed captions.
2. Timed captions appear in Remotion renders.
3. Captions respect bottom safe area.
4. Validator reports overlapping captions.
5. Validator reports captions outside scene duration.
6. Validator warns when caption text is too long.

### Future extension

1. Word-level highlighting.
2. Karaoke-style progress.
3. Keyword emphasis.
4. Bilingual captions.

## 5. Milestone v0.6: vertical and square format support

Goal: support short-video and social output formats.

### Scope

1. Add `meta.format` support.
2. Add landscape, vertical, square, and wide presets.
3. Add layout reflow rules per format.
4. Add safe area model.
5. Update validators for format-specific text density.
6. Update both renderers.

### Target formats

1. `landscape`: 1920 by 1080.
2. `vertical`: 1080 by 1920.
3. `square`: 1080 by 1080.
4. `wide`: 2100 by 900.

### Files to add or modify

1. `scripts/lib/video-formats.mjs`
2. `scripts/lib/video-css-base.mjs`
3. `scripts/lib/video-css-components.mjs`
4. `scripts/lib/video-layouts.mjs`
5. `remotion/index.jsx`
6. `scripts/lib/video-spec.mjs`
7. `docs/video-spec.md`

### Acceptance criteria

1. `--format vertical` generates 1080 by 1920 output.
2. Cover layout reflows into stacked vertical composition.
3. Cards layout uses one-column or two-column vertical rules.
4. Caption safe area is larger in vertical mode.
5. Remotion and HyperFrames both accept the same format field.

### Suggested command

```bash
npm run render -- --engine remotion --style y2k --format vertical
```

Implementation note: `parseArgs` currently does not expose `--format`, so this milestone should add it.

## 6. Milestone v0.7: poster, keyframes, and style gallery

Goal: give users visual previews and video cover assets.

### Scope

1. Add poster export command.
2. Add scene keyframe export.
3. Add 16-style gallery generation.
4. Add contact sheet generation.
5. Prefer Remotion still export first.
6. Add HyperFrames fallback later.

### Target commands

```bash
npm run poster -- --engine remotion --style bauhaus
npm run keyframes -- --engine remotion
npm run gallery -- --input data/demo-video.json
```

### Files to add or modify

1. `scripts/render-poster.sh`
2. `scripts/render-keyframes.sh`
3. `scripts/render-style-gallery.sh`
4. `docs/visual-styles.md`
5. `docs/remotion.md`
6. `README.md`

### Acceptance criteria

1. Poster PNG exports from frame 0.
2. Scene keyframes export for every scene start.
3. Gallery renders all 16 style keys.
4. Gallery writes a manifest.
5. Contact sheet can be generated locally.

### Output targets

```text
previews/poster.png
previews/keyframes/scene-01.png
previews/style-gallery/bauhaus.png
previews/style-gallery/contact-sheet.png
previews/style-gallery/manifest.json
```

## 7. Milestone v0.8: quality report

Goal: make validation actionable for humans and agents.

### Scope

1. Extend validator to produce `quality-report.json`.
2. Add scoring by category.
3. Add recommended fixes.
4. Add machine-readable output mode.
5. Add renderer parity checks.

### Quality categories

1. Structure.
2. Readability.
3. Timing.
4. Captions.
5. Visual density.
6. Asset readiness.
7. Renderer compatibility.
8. Delivery readiness.

### Target command

```bash
node scripts/validate-video-spec.mjs data/demo-video.json --report examples/generated-remotion/quality-report.json
```

### Acceptance criteria

1. Report includes total score.
2. Report includes errors, warnings, and suggestions.
3. Report includes per-scene notes.
4. Report exits nonzero on blocking errors.
5. Agent can use the report to revise JSON spec.

### Example report shape

```json
{
  "score": 86,
  "status": "pass-with-warnings",
  "errors": [],
  "warnings": [],
  "suggestions": [],
  "scenes": []
}
```

## 8. Milestone v0.9: asset layer and data components

Goal: allow videos to use local images, logos, screenshots, SVGs, and chart data.

### Scope

1. Add `assets` object to spec.
2. Validate local asset paths.
3. Add image panel component.
4. Add logo placement.
5. Add chart data scene support.
6. Add product and data-story layouts.

### Asset fields

1. `id`
2. `type`
3. `path`
4. `fit`
5. `alt`
6. `required`

### Layouts to add

1. `product`
2. `data-story`
3. `comparison`
4. `quote`
5. `timeline`

### Acceptance criteria

1. Missing required asset blocks render and returns validation error.
2. Optional missing asset uses placeholder.
3. Remotion can render local images from props.
4. HyperFrames can render local relative image paths.
5. Chart data can render at least bar chart and score card.

## 9. Milestone v1.0: batch rendering and unified CLI

Goal: make the Skill useful for campaign-level production.

### Scope

1. Add task directory model.
2. Add campaign manifest.
3. Add batch render command.
4. Add unified `card-video` CLI wrapper.
5. Add predictable logs and exit codes.
6. Add docs for end-to-end workflows.

### Task directory shape

```text
task/
  script.md
  video.json
  voice.mp3
  assets/
  output/
  report.json
```

### Campaign directory shape

```text
campaign/
  specs/
  audio/
  assets/
  output/
  manifest.json
```

### Target CLI

```bash
npm run card-video -- init ./task
npm run card-video -- plan ./task/script.md
npm run card-video -- validate ./task/video.json
npm run card-video -- render ./task --engine remotion --style y2k
npm run card-video -- batch ./campaign --engine remotion
```

### Acceptance criteria

1. One task can be initialized from scratch.
2. One markdown script can produce a draft spec.
3. One task can render final MP4.
4. One campaign can render multiple videos.
5. Batch manifest records success and failure per video.
6. CLI returns stable exit codes.

## 10. Engineering tasks by file area

### 10.1 Spec and validation

1. Extend `scripts/lib/video-spec.mjs` with `format`, `audio`, `assets`, `captions`, and `motion`.
2. Extend `scripts/validate-video-spec.mjs` with quality report mode.
3. Add tests for normalization edge cases.

### 10.2 HyperFrames renderer

1. Add format-aware CSS.
2. Add more layout renderers.
3. Add scene-caption compatibility with new caption model.
4. Add image and chart components.

### 10.3 Remotion renderer

1. Split `remotion/index.jsx` into smaller components.
2. Add timed caption component.
3. Add format-aware layout components.
4. Add still export scripts.
5. Add chart and asset components.

### 10.4 Scripts

1. Add planner script.
2. Add poster script.
3. Add keyframes script.
4. Add gallery script.
5. Add batch script.
6. Add unified CLI.

### 10.5 Documentation

1. Update README for every milestone.
2. Update `skill/SKILL.md` for agent usage.
3. Keep `docs/video-spec.md` as the canonical JSON reference.
4. Keep `docs/remotion.md` focused on renderer behavior.
5. Keep `docs/visual-styles.md` focused on style selection and extension.

## 11. Test plan

### 11.1 Static checks

1. Validate default spec.
2. Validate generated spec from markdown.
3. Validate unsupported style fails.
4. Validate unsupported layout fails.
5. Validate missing required asset fails.
6. Validate caption timing overlaps fail.

### 11.2 Build checks

1. Build HyperFrames HTML.
2. Build Remotion props.
3. Confirm both metadata files have matching duration.
4. Confirm scene count matches in both renderers.
5. Confirm width, height, and fps match target format.

### 11.3 Render checks

1. Render HyperFrames demo MP4.
2. Render Remotion demo MP4.
3. Render with user audio.
4. Render without audio.
5. Render vertical output.
6. Render poster PNG.
7. Render style gallery.

### 11.4 Manual QA

1. First frame is not blank.
2. Text is readable on a laptop and phone screen.
3. Captions stay within safe area.
4. Scene transitions feel clean.
5. Final frame feels complete.
6. Audio does not cut off early.
7. Visual duration matches audio duration.

## 12. Release plan

### 12.1 v0.4 release

Ship script planner and better docs.

Release checklist:

1. `create-video-spec` command works.
2. Generated spec validates.
3. README documents script input.
4. Skill doc tells agents how to plan from script.

### 12.2 v0.5 release

Ship timed captions.

Release checklist:

1. SRT parser works.
2. Remotion timed captions render.
3. Caption validator works.
4. Example spec includes timed captions.

### 12.3 v0.6 release

Ship vertical format.

Release checklist:

1. `--format vertical` works.
2. Remotion vertical render works.
3. HyperFrames vertical render works.
4. Docs include landscape and vertical examples.

### 12.4 v0.7 release

Ship previews.

Release checklist:

1. Poster export works.
2. Keyframe export works.
3. Style gallery works.
4. Contact sheet works.

### 12.5 v0.8 release

Ship quality report.

Release checklist:

1. JSON report exists.
2. Agent suggestions are actionable.
3. Validator catches caption, timing, asset, and density risks.

### 12.6 v0.9 release

Ship asset and chart layer.

Release checklist:

1. Local images render.
2. Logos render.
3. Bar chart renders.
4. Product layout works.
5. Data-story layout works.

### 12.7 v1.0 release

Ship campaign workflow.

Release checklist:

1. Task CLI works.
2. Batch CLI works.
3. Campaign manifest works.
4. Docs provide end-to-end workflows.
5. Default demo still renders through both engines.

## 13. Work breakdown for next PR

Recommended next PR: `feature/script-to-spec-planner`.

Tasks:

1. Add `scripts/create-video-spec.mjs`.
2. Add `scripts/lib/script-parser.mjs`.
3. Add `scripts/lib/style-recommender.mjs`.
4. Add `examples/scripts/demo-script.md`.
5. Add `data/generated-from-script.json` as an example output.
6. Add README section for script input.
7. Update `skill/SKILL.md` with planning workflow.
8. Add validator call in the planner.

Estimated complexity:

1. Parser: medium.
2. Style recommendation: low to medium.
3. Docs: low.
4. Agent guidance: medium.
5. Test coverage: medium.

## 14. Work breakdown for following PR

Recommended following PR: `feature/timed-captions`.

Tasks:

1. Add caption parser.
2. Add SRT and VTT support.
3. Add `captions` schema support.
4. Add Remotion caption component.
5. Add caption validator.
6. Add caption examples.
7. Update docs.

Estimated complexity:

1. Parser: medium.
2. Remotion component: medium.
3. Validator: medium.
4. HyperFrames compatibility: medium.

## 15. Main risks and mitigations

### 15.1 Renderer drift

Risk: HyperFrames and Remotion renderers diverge.

Mitigation:

1. Keep one normalized spec.
2. Add renderer parity checks.
3. Document renderer-specific differences.
4. Prefer shared tokens and layout metadata.

### 15.2 Overcomplex spec

Risk: JSON becomes too hard for users to edit.

Mitigation:

1. Keep simple fields first.
2. Make advanced fields optional.
3. Provide examples.
4. Add planner and validation suggestions.

### 15.3 Visual quality regression

Risk: More layouts and formats reduce design quality.

Mitigation:

1. Add style gallery.
2. Add keyframe export.
3. Add manual QA checklist.
4. Add density warnings.

### 15.4 Long render time

Risk: Batch and gallery rendering can become slow.

Mitigation:

1. Add render manifest.
2. Cache generated props.
3. Support concurrency flags.
4. Let users render stills before full videos.

### 15.5 Asset path issues

Risk: Local assets fail across working directories.

Mitigation:

1. Normalize paths from project root.
2. Validate existence before render.
3. Write resolved paths to render metadata.
4. Give clear errors.

## 16. Definition of done

A milestone is complete when:

1. The default demo still validates.
2. HyperFrames path still renders.
3. Remotion path still renders when the milestone touches renderer code.
4. Docs are updated.
5. Skill instructions are updated.
6. Generated artifacts are ignored by git.
7. New commands have help output.
8. Validation catches obvious misuse.
9. PR description includes local verification commands.

## 17. Recommended immediate next action

Start with `feature/script-to-spec-planner`. This unlocks the highest user value because it removes the need to hand-author JSON. After that, implement timed captions, then vertical format. These three upgrades will make the Skill feel much closer to a real video production assistant.

# su-card-to-video

A local-first, JSON-driven card-video Skill. It can plan a video spec from a script, validate the spec, render through HyperFrames or Remotion, export previews, and mux the result with prepared audio through FFmpeg.

This branch upgrades the original demo into a reusable card-video production system. Content lives in JSON, visual style is selectable, output format is selectable, visual duration can align to audio duration, and the renderer is selected with `--engine hyperframes` or `--engine remotion`.

## Install

```bash
brew install node
brew install ffmpeg
npm install
```

Node.js 22+ is recommended.

## Quick start

```bash
npm run doctor
npm run validate
npm run build
npm run render
```

Default HyperFrames MP4:

```text
examples/generated-16x9/output/final.mp4
```

## Plan from a script

```bash
npm run plan -- --input examples/scripts/demo.md --out data/generated-video.json --style auto
node scripts/validate-video-spec.mjs data/generated-video.json
npm run render -- --input data/generated-video.json --style bauhaus
```

## Render with Remotion

```bash
npm run build:remotion
npm run render:remotion -- --style y2k
npm run render -- --engine remotion --style art-deco --audio ./voice.mp3
```

Remotion writes visual props and metadata into:

```text
examples/generated-remotion/props.json
examples/generated-remotion/render-meta.json
examples/generated-remotion/output/final.mp4
```

## Formats, captions, and reports

```bash
npm run render -- --engine remotion --format vertical --style y2k
npm run render -- --engine remotion --transcript ./captions.srt --audio ./voice.mp3
node scripts/validate-video-spec.mjs data/demo-video.json --report examples/generated-remotion/quality-report.json
```

Supported formats: `landscape`, `vertical`, `square`, `wide`.

## Previews

```bash
npm run poster -- --style bauhaus --frame 0
npm run keyframes -- --engine remotion --style y2k
npm run gallery -- --input data/demo-video.json
```

Preview outputs are written under `previews/`.

## Batch and unified CLI

```bash
npm run card-video -- init ./task
npm run card-video -- plan ./task/script.md --out ./task/video.json
npm run card-video -- validate ./task/video.json --report ./task/report.json
npm run card-video -- render ./task --engine remotion --style y2k
npm run batch -- ./campaign --engine remotion --style y2k
```

## Supported visual styles

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

The style system is inspired by the multi-style social-card workflow in `xiaoliang-socialcard-skills`, then adapted for video with scene entrances, floating shapes, motif motion, tickers, captions and scene transitions.

## Scene layouts

Current primary layouts: `cover`, `cards`, `process`, `metrics`, `closing`.

Roadmap-compatible fallback layouts are also accepted by the spec and renderers: `quote`, `comparison`, `before-after`, `timeline`, `ranking`, `myth-fact`, `checklist`, `framework`, `case-study`, `data-story`, `product`, `gallery`, `faq`.

## Generated files

```text
examples/generated-16x9/index.html
examples/generated-16x9/render-meta.json
examples/generated-16x9/output/cards.mp4
examples/generated-16x9/output/final.mp4

examples/generated-remotion/props.json
examples/generated-remotion/render-meta.json
examples/generated-remotion/output/cards-remotion.mp4
examples/generated-remotion/output/final.mp4
```

## Agent workflow

Give the whole repository to a coding agent. The agent should edit source inputs such as `script.md` or `data/demo-video.json`, then run validation, preview, and render commands. Generated HTML and generated Remotion props should only be edited for renderer debugging.

## License

MIT. The style direction references the visual-system idea from `xiaoliang-socialcard-skills`; copying files from that repository directly would require separate license handling.

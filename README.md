# su-card-to-video

A JSON-driven card-video starter. It turns a script file into a 16:9 composition, renders it through HyperFrames or Remotion, then muxes the result with an audio file through FFmpeg.

This branch upgrades the original single demo into a reusable local video engine. Content lives in JSON, visual style is selectable, visual duration can be aligned to audio duration, and the renderer is selectable with `--engine hyperframes` or `--engine remotion`.

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

## Render with style and audio

```bash
npm run styles
npm run render -- --style y2k
npm run render -- --style art-deco --audio ./voice.mp3
```

When audio is passed in, the render scripts read its duration with `ffprobe` and rebuild the visual composition with the same total duration.

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

## Input spec

Default spec:

```text
data/demo-video.json
```

Scene layouts:

- `cover`: opening title scene
- `cards`: information cards
- `process`: step-by-step sequence
- `metrics`: large number and metric rows
- `closing`: final call-to-action scene

Useful commands:

```bash
node scripts/validate-video-spec.mjs data/demo-video.json
node scripts/build-video-html.mjs --input data/demo-video.json --style pop-art
node scripts/build-remotion-props.mjs --input data/demo-video.json --style pop-art
bash scripts/render.sh --input data/demo-video.json --style brutalist --audio ./voice.mp3
bash scripts/render.sh --engine remotion --input data/demo-video.json --style y2k --audio ./voice.mp3
```

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

Give the whole repository to a coding agent, ask it to edit `data/demo-video.json`, then run either renderer:

```bash
npm run validate
npm run render -- --style bauhaus
npm run render -- --engine remotion --style bauhaus
```

## License

MIT. The style direction references the visual-system idea from `xiaoliang-socialcard-skills`; copying files from that repository directly would require separate license handling.

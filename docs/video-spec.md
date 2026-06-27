# Video spec

`data/demo-video.json` is the source of truth for generated card videos. The build command converts this JSON into `examples/generated-16x9/index.html` and writes render metadata next to it.

## Top-level shape

```json
{
  "meta": {
    "title": "AI Card Video Pipeline",
    "kicker": "su-card-to-video",
    "style": "bauhaus",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "compositionId": "su-card-to-video-generated"
  },
  "scenes": []
}
```

## Meta fields

- `title`: page title and default project label.
- `kicker`: default small label shown in scenes.
- `style`: one of the supported visual style keys.
- `width` and `height`: composition size. Defaults to 1920 by 1080.
- `fps`: metadata FPS passed to the build command.
- `compositionId`: ID used by HyperFrames to locate the GSAP timeline.

## Scene fields

Every scene supports:

- `layout`: `cover`, `cards`, `process`, `metrics`, or `closing`.
- `duration`: declared visual duration in seconds.
- `kicker`: optional scene label.
- `title`: main title. Keep this short.
- `lead`: supporting copy.
- `caption`: subtitle-style text shown near the bottom.

## Layout-specific fields

`cover` supports `marquee`.

`cards` supports:

```json
"cards": [
  { "title": "JSON driven", "body": "Edit data instead of hand-editing HTML." }
]
```

`process` supports:

```json
"steps": [
  { "title": "Write script", "body": "Put the content in JSON." }
]
```

`metrics` supports:

```json
"metrics": [
  { "value": "16", "label": "style presets" },
  { "value": "5", "label": "scene layouts" }
]
```

`closing` supports `cta`.

## Duration behavior

The build command uses the scene durations from JSON by default. `--duration 18.5` scales all scene durations to that total. `scripts/render.sh --audio voice.mp3` reads the audio length with `ffprobe` and passes that value as the build duration.

## Validation

Run:

```bash
npm run validate
```

The validator checks supported style keys, supported layouts, positive scene duration, required titles, and layout-specific content quality warnings.

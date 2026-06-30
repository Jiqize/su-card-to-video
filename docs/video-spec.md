# Video spec

`data/demo-video.json` is the source of truth for generated card videos. Builders convert this JSON into generated HTML or Remotion props. Render scripts then produce MP4 output and optional preview artifacts.

## Top-level shape

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
    "language": "en-US"
  },
  "audio": {
    "path": "./voice.mp3",
    "transcript": "./captions.srt",
    "source": "recorded"
  },
  "assets": [],
  "scenes": []
}
```

## Meta fields

- `title`: page title and default project label.
- `kicker`: default small label shown in scenes.
- `style`: one of the supported visual style keys.
- `motion`: `calm`, `editorial`, `kinetic`, `cinematic`, `glitch`, `comic`, `luxury`, or `default`.
- `format`: `landscape`, `vertical`, `square`, or `wide`.
- `width` and `height`: optional explicit composition size. If omitted, the format preset supplies size.
- `fps`: metadata FPS passed to the build command.
- `compositionId`: ID used by HyperFrames or Remotion.
- `language`: content language label.

## Formats

- `landscape`: 1920 by 1080.
- `vertical`: 1080 by 1920.
- `square`: 1080 by 1080.
- `wide`: 2100 by 900.

## Audio fields

- `path`: prepared audio file path.
- `transcript`: optional SRT, VTT, JSON, or plain-text transcript.
- `duration`: optional declared duration.
- `source`: `recorded`, `tts`, `voice-clone`, `silent`, or `external`.

When `--audio` is provided, render scripts use `ffprobe` to read the audio duration and scale visual duration to match.

## Assets

```json
{
  "assets": [
    { "id": "product", "type": "image", "path": "./assets/product.png", "fit": "cover", "alt": "Product screenshot", "required": false }
  ]
}
```

Assets are local or repository-relative. Missing required assets are validation errors. Missing optional assets are warnings.

## Scene fields

Every scene supports:

- `layout`: primary or roadmap-compatible layout key.
- `duration`: declared visual duration in seconds.
- `kicker`: optional scene label.
- `title`: main title.
- `lead`: supporting copy.
- `caption`: scene-level caption.
- `captions`: timed caption segments.
- `motion`: optional scene motion override.
- `asset` or `media`: optional asset ID reference.

Timed caption shape:

```json
"captions": [
  { "start": 0.2, "end": 1.8, "text": "First, write the idea." }
]
```

## Layouts

Primary layouts:

- `cover`: opening title and visual motif.
- `cards`: information cards.
- `process`: step-by-step sequence.
- `metrics`: large number and metric rows.
- `closing`: final call-to-action scene.

Roadmap-compatible fallback layouts:

```text
quote | comparison | before-after | timeline | ranking | myth-fact | checklist | framework | case-study | data-story | product | gallery | faq
```

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

`metrics` and `data-story` support:

```json
"metrics": [
  { "value": "16", "label": "style presets" }
]
```

`closing` supports `cta`.

## Validation

```bash
node scripts/validate-video-spec.mjs data/demo-video.json --report examples/generated-remotion/quality-report.json
```

The validator checks style, format, layouts, durations, titles, scene density, captions, audio path, asset path, and renderer compatibility risks.

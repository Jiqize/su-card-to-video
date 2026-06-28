---
name: su-card-to-video
description: Create local AI card videos from a plain script or JSON spec with selectable visual styles, multiple output formats, HyperFrames or Remotion rendering, timed captions, previews, quality reports, batch rendering, and FFmpeg audio-video muxing. Use when the user wants reusable card-video generation without Jianying/CapCut, without appearing on camera, and without image generation APIs.
---

# su-card-to-video

Use this skill to create a local AI card video:

```text
script or JSON spec -> validated video spec -> HyperFrames or Remotion render -> FFmpeg mux -> MP4
```

## Boundaries

- Do not call image generation APIs by default.
- Do not require the user to appear on camera.
- Do not require Jianying/CapCut.
- Do not include or assume a voice-cloning API.
- Accept any prepared audio: recorded speech, TTS, voice clone, or a silent placeholder.
- Keep generated renderer files out of normal manual editing workflows.

## Source of Truth

Edit one of these source inputs:

- Plain script: `examples/scripts/demo.md` or a user-provided markdown file.
- JSON spec: `data/demo-video.json` or a generated task spec.

Generated files such as `examples/generated-16x9/index.html` and `examples/generated-remotion/props.json` should only be edited when debugging renderer internals.

## Outputs

- HyperFrames output: `examples/generated-16x9/output/final.mp4`
- Remotion output: `examples/generated-remotion/output/final.mp4`
- Preview output: `previews/`
- Quality report: any path passed with `--report`

## Workflow

1. Turn the user's script into 3 to 6 concise card-video scenes.
2. Use `npm run plan` when starting from markdown or plain text.
3. Edit and validate the JSON spec.
4. Choose a style and format.
5. Export a poster or style gallery when visual choice matters.
6. Render with HyperFrames for the simplest HTML path.
7. Render with Remotion for richer sequencing, timed captions, stills, and future production workflows.
8. Pass prepared audio with `--audio`; render scripts align visual duration to audio duration.

## Commands

```bash
npm run plan -- --input examples/scripts/demo.md --out data/generated-video.json --style auto
npm run validate
node scripts/validate-video-spec.mjs data/demo-video.json --report examples/generated-remotion/quality-report.json
npm run render -- --style bauhaus
npm run render -- --engine remotion --style y2k
npm run render -- --engine remotion --format vertical --style y2k --audio ./voice.mp3
npm run poster -- --style bauhaus --frame 0
npm run keyframes -- --engine remotion --style y2k
npm run gallery -- --input data/demo-video.json
npm run card-video -- init ./task
npm run batch -- ./campaign --engine remotion --style y2k
```

## Supported Styles

```text
bauhaus | destijl | constructivist | new-typography | minimal | art-deco | art-nouveau | surreal | pop-art | psychedelic | postmodern | new-wave | memphis | punk | brutalist | y2k
```

## Supported Formats

```text
landscape | vertical | square | wide
```

## Scene Layouts

Primary layouts:

- `cover`: opening title and visual motif.
- `cards`: 3 to 4 information cards.
- `process`: 3 to 4 workflow steps.
- `metrics`: hero number and supporting metrics.
- `closing`: final message and call to action.

Roadmap-compatible layouts are accepted with renderer fallbacks:

```text
quote | comparison | before-after | timeline | ranking | myth-fact | checklist | framework | case-study | data-story | product | gallery | faq
```

## Quality Rules

- First frame must not be blank.
- Text must be readable in the target format.
- Keep scenes concise. Prefer 3 to 6 scenes for a short video.
- Use captions as close as possible to spoken text.
- Match visual duration to audio duration.
- Give the final frame a complete ending.
- Use motion as hierarchy: scene entrance, light object drift, caption entrance, and clean transition.
- Run validation before rendering final output.
- Use a quality report when an agent is iterating on a spec.

## Agent Instructions

When adapting a user script:

1. Extract one main message, then split it into scenes.
2. Generate a draft spec with `npm run plan` when possible.
3. Put all user-facing text in JSON.
4. Pick a visual style and output format that match the topic.
5. Validate and read warnings before rendering.
6. Use poster, keyframes, or gallery commands for visual QA.
7. Use HyperFrames for simple HTML rendering.
8. Use Remotion for timed captions, richer sequencing, stills, and batch production.
9. Render with audio when the user provides audio.

---
name: su-card-to-video
description: Create a local 16:9 AI card video from a JSON script, selectable visual styles, GSAP motion, HyperFrames rendering, and FFmpeg audio-video muxing. Use when the user wants reusable card-video generation without Jianying/CapCut, without appearing on camera, and without image generation APIs.
---

# su-card-to-video

Use this skill to create a local AI card video:

```text
script/captions JSON -> generated HTML/CSS cards -> GSAP timeline -> HyperFrames render -> FFmpeg mux -> MP4
```

## Boundaries

- Do not call image generation APIs by default.
- Do not require the user to appear on camera.
- Do not require Jianying/CapCut.
- Do not include or assume a voice-cloning API.
- Accept any prepared audio: recorded speech, TTS, voice clone, or a silent placeholder.
- Keep the workflow simple enough for coding agents to modify and rerun.

## Default Output

- Aspect ratio: 16:9
- Video format: MP4
- Script source: `data/demo-video.json`
- Generated HTML: `examples/generated-16x9/index.html`
- Final output: `examples/generated-16x9/output/final.mp4`

## Workflow

1. Turn the user's script into 4 to 6 concise card-video scenes.
2. Edit `data/demo-video.json`, not the generated HTML.
3. Choose a style with `--style`, or set `meta.style` in JSON.
4. Run `npm run validate`.
5. Run `npm run render -- --style <style-key>`.
6. If an audio file is provided, pass `--audio ./voice.mp3`; the render script will align visual duration to the audio duration.

## Supported Styles

```text
bauhaus | destijl | constructivist | new-typography | minimal | art-deco | art-nouveau | surreal | pop-art | psychedelic | postmodern | new-wave | memphis | punk | brutalist | y2k
```

## Scene Layouts

- `cover`: opening title and visual motif.
- `cards`: 3 to 4 information cards.
- `process`: 3 to 4 workflow steps.
- `metrics`: hero number and supporting metrics.
- `closing`: final message and call to action.

## Commands

```bash
npm run styles
npm run validate
npm run build
npm run render -- --style bauhaus
npm run render -- --style y2k --audio ./voice.mp3
```

## Quality Rules

- First frame must not be blank.
- Text must be readable at 1920 by 1080.
- Keep scenes concise. Prefer 4 to 6 scenes for a short demo.
- Use captions as close as possible to the spoken text.
- Match visual duration to audio duration. Do not stretch audio to fit visuals.
- Give the final frame a complete ending.
- Use motion as hierarchy: scene entrance, light object drift, caption entrance, and clean transition.

## Agent Instructions

When adapting a user script:

1. Extract one main message, then split it into scenes.
2. Put all user-facing text in `data/demo-video.json`.
3. Pick a visual style that matches the topic.
4. Keep titles short and captions direct.
5. Validate before rendering.
6. Render with audio when the user provides audio.

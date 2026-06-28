# Remotion renderer

This project supports Remotion as an optional renderer alongside the default HyperFrames path.

## Commands

```bash
npm run build:remotion
npm run render:remotion -- --style y2k
npm run render -- --engine remotion --style art-deco --audio ./voice.mp3
```

## Files

```text
remotion/index.jsx
scripts/build-remotion-props.mjs
scripts/render-remotion.sh
examples/generated-remotion/props.json
examples/generated-remotion/render-meta.json
examples/generated-remotion/output/final.mp4
```

## How it works

1. `scripts/build-remotion-props.mjs` reads `data/demo-video.json`.
2. It normalizes style, scenes, duration, width, height and fps.
3. It writes Remotion input props to `examples/generated-remotion/props.json`.
4. `scripts/render-remotion.sh` calls `npx remotion render remotion/index.jsx CardVideo` with `--props` pointing at the generated props file.
5. The script uses FFmpeg to mux the Remotion visual render with user audio, or a silent placeholder when no audio is provided.

## Why keep HyperFrames too

HyperFrames remains the simplest HTML rendering path. Remotion is better when the video needs React components, richer sequencing, reusable animation logic, future captions, or more complex production workflows.

## Notes

The Remotion composition ID is `CardVideo`. The entry point is `remotion/index.jsx`.

# generated-remotion

This directory is the generated Remotion render workspace.

`npm run build:remotion` writes:

```text
examples/generated-remotion/props.json
examples/generated-remotion/render-meta.json
```

`npm run render:remotion` or `npm run render -- --engine remotion` writes video artifacts under:

```text
examples/generated-remotion/output/
```

The props and media files are ignored by git. Regenerate them locally whenever the JSON script, style or audio changes.

# generated-16x9

This directory is the generated render workspace.

`npm run build` writes:

```text
examples/generated-16x9/index.html
examples/generated-16x9/render-meta.json
```

`npm run render` then writes video artifacts under:

```text
examples/generated-16x9/output/
```

The media files in `output/` are ignored by git. Regenerate them locally whenever the JSON script, style or audio changes.

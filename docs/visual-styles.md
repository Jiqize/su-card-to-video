# Visual styles

The video engine supports 16 style keys inspired by the multi-style social-card workflow. The implementation is token based: each style controls color, type, border, radius, texture, surface, shadow and motion tone.

## Style keys

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

## Recommended usage

- `bauhaus`: explainers, systems, structured knowledge.
- `destijl`: hierarchy, frameworks, grid-based comparisons.
- `constructivist`: strong opinions, manifestos, action lists.
- `new-typography`: research summaries and editorial narratives.
- `minimal`: premium, calm, product or lifestyle stories.
- `art-deco`: luxury, finance, high-end positioning.
- `art-nouveau`: culture, lifestyle, organic or craft topics.
- `surreal`: reflective essays, abstract ideas, softer narrative videos.
- `pop-art`: consumer products, trends, playful social content.
- `psychedelic`: music, culture, creativity, high-energy topics.
- `postmodern`: commentary, media, mixed-format storytelling.
- `new-wave`: technology, digital culture, interface-heavy stories.
- `memphis`: cheerful product explainers and carousel-like videos.
- `punk`: contrarian takes and zine-like visual language.
- `brutalist`: direct, loud, utilitarian information.
- `y2k`: AI tools, futuristic tech, dashboards and digital products.

## Implementation files

```text
scripts/lib/video-style-core.mjs
scripts/lib/video-style-group-a.mjs
scripts/lib/video-style-group-b.mjs
scripts/lib/video-style-group-c.mjs
scripts/lib/video-style-group-d.mjs
scripts/lib/video-styles.mjs
```

## Adding a new style

1. Add a style object to one of the style group files.
2. Define token values for background, foreground, accent colors, type, border, radius, shadow and pattern.
3. Add a motion tone if needed.
4. Run `npm run styles` to confirm it appears in the registry.
5. Run `npm run render -- --style your-style-key`.

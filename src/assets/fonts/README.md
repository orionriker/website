# Fonts

Three tiers of files live here. Only files referenced by a variant in
`astro.config.mts` are copied to `dist`; the browser downloads only what page
codepoints demand.

## Latin subsets (`*-Latin-*.woff2`)

Generated with fonttools from the original sources (weights kept: Mona Sans
400/500/600/700, Fira Mono 400/500). Declared with `LATIN_RANGE` in
`astro.config.mts`, which is the exact subset codepoint list. Weight 400 faces
preload on every route.

## Full-coverage sources (everything else, when declared)

- `Mona_Sans/MonaSans-VariableFont.woff2` and
  `Mona_Sans/MonaSans-Italic-VariableFont.woff2` (weight range `200 900`)
- `Fira_Mono/FiraMono-Regular.woff2` and `Fira_Mono/FiraMono-Medium.woff2`

Declared last in each variant list with `MONA_EXT` / `FIRA_EXT` — ranges
verified against each file's cmap and kept disjoint from `LATIN_RANGE`, so
latin text never matches them. The browser downloads one only when a matching
codepoint renders (non-latin script or currency symbol).

Coverage: Mona Sans variable carries latin-ext A, U+01A0-01B0, the Vietnamese
block U+1EA0-1EF9 and the rupee (no real greek, no cyrillic). Fira Mono fulls
carry latin-ext A, greek and cyrillic (no Vietnamese). None carries Devanagari;
that needs a new family.

`subsetFontProvider()` in `astro.config.mts` tags each face `latin` or `ext`
from the filename (`*-Latin-*`), which is what the preload filters dispatch
on. Keep that naming convention for new subset files.

## Undeclared sources (not referenced by any variant)

- `Instrument_Serif/InstrumentSerif-Italic.woff2`
- `Fira_Mono/FiraMono-Bold.woff2`

Kept for future styles; wire them the same way if needed.

The `*VariableFont.woff2` and `FiraMono-Regular/Medium/Bold` files above are
the original, unsubsetted sources as they existed before the `perf(fonts)`
subset pass.

# Midnight Boulevard — Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/satriawahyu872/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/satriawahyu872/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A free offline web app that turns your photos and captions into GTA 6-style
cover art: a seven-panel movie-poster cast grid on a dark neon boulevard,
exported as a PNG to share.

## What it does

- **Any photo** — load your own photos per panel, or use the five included
  samples. Each panel has its own zoom and focus point, so you can crop and
  position every face exactly where you want it.
- **The cast** — seven panels with editable role labels and sub-captions.
  The hero panel on the left is the star of the poster; the six panels on
  the right complete the crew. Role chips sit on a dark plate, so the text
  stays readable over any photo.
- **The art** — a dark neon title band, a BEST CAST seal, a handwritten
  quote ribbon, a tagline strip, credits, a barcode, a volume number and a
  COMING SOON line, all drawn on canvas.
- **Four looks** — Midnight Noir, Crimson Rush, Electric Dawn and Silver
  Screen colour grades, painted over every photo.
- **Three sizes** — Square 1080×1080, Portrait 1080×1350 and Wide
  1920×1080, one click to export a PNG.

## Looks

- **Midnight Noir** — deep navy and hot pink, the default boulevard night.
- **Crimson Rush** — dark red and amber, a heist at golden hour.
- **Electric Dawn** — ocean blue and orange, sunrise over the bay.
- **Silver Screen** — black and white, the classic movie-poster grade.

Tip: use each panel's focus sliders to keep faces inside their frames
when you zoom in.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network: every file the app loads lives under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory and
writes `dossier.json` with the vendored make.fun library.

## Screenshots

The four screenshots under `screenshots/` are renders of this app, taken
with headless Chromium from the `?shot=` scenes in `shots.json`:

- `1-cover.jpg` — the exported portrait cover in the Midnight Noir look
- `2-editor.jpg` — the editor with a photo loaded
- `3-cover-portrait.jpg` — the portrait cover in the Electric Dawn look
- `4-export-square.jpg` — the square export in the Crimson Rush look

The app reads no network and uploads nothing: photos are read on your
own machine and stay there.

## Fonts & photos

- Display lettering: **Alfa Slab One** (SIL Open Font License 1.1,
  `app/fonts/OFL-AlfaSlabOne.txt`)
- Script lettering: **Permanent Marker** (SIL Open Font License 1.1,
  `app/fonts/OFL-PermanentMarker.txt`)
- Sample photos: made with an image model for this entry; no real person,
  no Rockstar artwork, no Rockstar fonts.

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=wb7v2fm3&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>

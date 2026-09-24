# Working on KKGR Player

Guidance for AI assistants (and new contributors) working in this repository.
Read this first, then the doc for the layer you are changing.

## What this project is

A **reusable template**, not a single-video page. One engine plays any number of
video lessons, and the whole thing is intended to be adopted into a larger
website. Every design decision follows from that: content is data, the engine
holds no content, and appearance is decided in one place.

When you are asked for a change, first work out **which layer it belongs to**.
Changes that cross a layer boundary are almost always a mistake.

## Map

| I want to… | Go to | Read |
| :--- | :--- | :--- |
| Add or edit a video's slides | `lessons/<id>.js` | [docs/AUTHORING-LESSONS.md](docs/AUTHORING-LESSONS.md) |
| Register a new lesson | `lessons/index.js` | [docs/AUTHORING-LESSONS.md](docs/AUTHORING-LESSONS.md) |
| Add a slide archetype | `slide-utils/` | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Change playback / chapters / fullscreen | `player.js` | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Change how slides look or size themselves | `slide-layout.js`, `style.css` | [docs/SLIDE-LAYOUT.md](docs/SLIDE-LAYOUT.md) |
| Change the lesson list / landing page | `landing.js`, `index.html` | [docs/EMBEDDING.md](docs/EMBEDDING.md) |
| Put the player into a website | `player.js`, `watch.html` | [docs/EMBEDDING.md](docs/EMBEDDING.md) |
| Understand why something is the way it is | — | [docs/CHANGELOG.md](docs/CHANGELOG.md) |

## Invariants — do not break these

Each of these has already been violated once and caused a real bug. The history
is in [docs/CHANGELOG.md](docs/CHANGELOG.md).

1. **Slide typography lives only in `slide-layout.js`.**
   Never add a slide font size, line-height, bullet gap or card padding to
   `style.css`, a slide factory, or an inline style. The layout model measures
   the slide and chooses these; anything set elsewhere overrides it and breaks
   every viewport except the one it was eyeballed at.
   *This was the original defect: inline `clamp(…rem, …cqw, …rem)` sizes from the
   factories silently beat the whole stylesheet. It recurred in the announcement
   banner via `redSize` / `blackSize`, so check the factories too — any default
   carrying a `rem` unit is a bug waiting to happen.*

   The same applies to the announcement banner. It always uses the full 1600×900
   canvas, scaled by `--banner-scale` on `.player-stage`, and deliberately does
   **not** follow the slides onto the smaller canvases (it was already readable
   there).

2. **Lesson files are pure data.** No DOM access, no player imports, no styling.

3. **The engine contains no lesson content.** No video ids, titles or bullet text
   in `player.js`.

4. **Resizing scales; it does not reflow.** A viewport change may only update
   `--slide-scale`. Re-running the typography fit on resize makes the slide jump
   while the viewer drags the window. The one exception is the player moving to
   a different logical canvas (a phone rotating, a window resized past a size
   class), which must re-fit once — see `docs/SLIDE-LAYOUT.md` §1e.

5. **Never truncate or drop lesson content.** A slide that will not fit above the
   readability floor is *reported* (`data-slide-overflow`, console warning), never
   shrunk into illegibility or clipped.

6. **Overlays must render in our own DOM.** Anything that hands the frame to the
   YouTube iframe (native iframe fullscreen) makes slides impossible to display.
   This is why pseudo-fullscreen exists — see `docs/SLIDE-LAYOUT.md` §1d.

7. **The runtime has no third-party dependencies.** Do not add one without a
   clear reason; the bundle size and integration surface are features here.

8. **Runtime assets must exist at the repo root, not only in `public/`.**
   The live site (GitHub Pages at `/kkgr-player/`) serves the **repository root**
   — not `dist/`, which is gitignored and never published. A lesson referencing
   `audio/refuge.mp3` therefore needs `audio/refuge.mp3` at the root, mirrored
   from `public/audio/`.

   That is why `slides/` and `public/slides/` both exist. It looks like accidental
   duplication and is not: `public/` is what `npm run dev` and `npm run build`
   serve, the root copy is what the deployed site serves. Add new assets to both.
   *This has already bitten once: the chant recordings went into `public/audio/`
   only, so the images loaded on the live site and the chant button 404'd, while
   everything worked locally.*

   `assets.test.mjs` now enforces this: it walks every asset each lesson
   references and fails if either copy is missing or the two differ. Run
   `npm test` before pushing anything that adds an asset.

## Conventions

- **ES modules everywhere.** The `window.*` assignments in
  `slide-utils/index.js` are explicitly-marked back-compatibility shims, not the
  pattern to copy.
- **Comments explain *why*.** The repo is deliberately commented at decision
  points (why a backdrop root matters, why the fullscreen selector list is split).
  Match that: describe the reason, not the syntax.
- **Design constants get names and a rationale.** No bare magic numbers; put them
  in `TOKENS` or a named constant with a comment saying how it was chosen.
- **Prefer deleting to adding.** Several bugs here came from duplicated logic
  (`slide-utils/index.js` once re-implemented every factory). Re-export, do not
  re-implement.

## Checks

```bash
npm test        # layout model, slide factories, lesson assets — no framework needed
npm run build   # Vite production build
npm run dev     # dev server
```

There is no linter or type checker. `npm test` covers only the pure arithmetic of
the layout model — the measurement half needs a real browser, so **verify visual
changes in a browser**, at a narrow viewport as well as a wide one.

When adding tests, keep them dependency-free in the style of
`slide-layout.test.js`. Do not introduce a test framework for a small change.

## Verification expectations

For anything touching slide rendering, check across:

- 2 bullets, 4 bullets, 7+ long bullets, one overlong bullet
- mobile portrait, mobile landscape, laptop, fullscreen
- resizing and entering/leaving fullscreen **while a keypoint is displayed**

Watch for: clipping, unexpected scrollbars, text too small or too large, layout
jumping, and controls covering slide text.

## Known gaps

- **No mount API yet.** `player.js` runs at module top level against hard-coded
  element ids, so one player per page and the host must supply the markup (`watch.html`). See
  [docs/EMBEDDING.md](docs/EMBEDDING.md) for the plan.
- **Native fullscreen is unverified on hardware.** It could not be exercised in
  the available automation environments; the mobile fallback path is the one that
  has been tested (by simulating the API being absent, and by a browser that
  silently ignores the request, as iPhone Safari does). The iPhone fix in
  docs/CHANGELOG.md still needs confirming on a real device.
- **The landing page is provisional.** `index.html` lists every registered lesson
  in registry order and links to `watch.html?lesson=<id>`. It has no grouping by
  series yet; a host site with its own navigation can replace it outright.

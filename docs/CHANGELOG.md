# Changelog

## Image Slides: Refuge and Dedication

Added a slide archetype whose content is the artwork itself — no heading, no
label, no bullets. Used for the refuge prayer at the start of a sitting and the
dedication at the end, both supplied as finished 16:9 slides with their text
already set.

`slide-utils/image-slide.js` provides `imageSlide(src, opts)` plus the named
`refuge()` and `dedication()` wrappers.

Three decisions worth keeping:

- **`contain`, not `cover`.** These images carry lesson text. Cropping them would
  cut words off the slide, which invariant 5 forbids. The canvas background fit
  became `var(--slide-bg-fit, cover)` so image slides can override it while the
  decorative artwork behind the bullet archetypes keeps cropping to fill.

- **The refuge slide is offered, not imposed.** It carries
  `openFromSegment: true`: it never fires on the timeline, and instead appears as
  the first entry in the segments list, above "Start of the Video". Choosing it
  opens the slide with the video still paused; continuing starts the teaching. A
  viewer who simply presses play goes straight into the lesson.

  An earlier iteration gated it on playback starting (`atStart`), so pressing
  play always showed it. That was replaced because taking refuge should be an
  invitation rather than a toll gate. The change also removed a subtle hazard:
  the engine resets every slide's `passed` flag when playback starts below 1.0s
  (to re-arm slides when a viewer replays from the beginning), which meant a
  start-gated slide re-opened the instant the viewer continued — the lesson could
  never begin — and needed a dedicated `once` flag to suppress. Segment-opened
  slides sidestep the timeline entirely, so that flag and its guards are gone.

- **The dedication is offered as a segment too, without leaving the timeline.**
  A viewer can go straight to it to dedicate or to learn the chant, and the
  teaching still reaches it in its proper place at the end.

  This required splitting one flag into two. `openFromSegment` had meant both
  "list it as a segment" and "do not fire on the timeline", which is right for
  the refuge slide and wrong for the dedication. Listing and timeline firing are
  now independent: `openFromSegment` lists it, `onTimeline` (default true) says
  whether the teaching reaches it.

- **Continuing from a segment-opened slide returns the viewer where they were.**
  Opening one never moves the playhead, so the only thing to restore is what it
  interrupted: the start of the teaching if they had not begun (`hasStartedPlayback`),
  the keypoint slide they were reading, or their position in the video.

  The return point is captured in `seekToSegment()` before anything is torn down
  and keyed to the slide instance (`segmentReturn.forSlide`), so a dedication
  reached by the timeline — which is also listed as a segment — is unaffected. A
  normal seek discards it: the viewer has chosen a new place in the teaching.

  In the segments list an action segment shows a bullet instead of a timestamp,
  is described as "Open ..." rather than "Seek to ...", sorts before a position
  sharing its timestamp, and never lights up as the active chapter.

- **No auto-continue timer.** The other archetypes derive one from their reading
  time; an image slide has no text to measure, so it waits for the viewer unless
  `duration` is passed explicitly.

Slide priority gained a rank for image slides between the takeaways and the
closing slide, so a dedication sharing the closing timestamp is shown after the
final takeaways and before "Thanks for watching".

Artwork is stored as WebP: at 1920x1080 these are 200KB and 118KB, against
1.4MB and 1.0MB as PNG. JPEG was rejected despite being smaller than PNG, because
these slides are mostly text and JPEG rings around glyphs; the source was already
WebP, so copying it avoids a re-encode entirely.

### Chant recordings

Image slides can carry a recording of their text being chanted
(`{ audio: 'audio/refuge.mp3' }`), offered on a "Play chant" button immediately
left of Continue. Slides without `audio` show no button.

It never plays on its own, and `closeStoppingSlide()` stops it — otherwise the
chanting would continue over the resumed teaching. The `<audio>` element is
`preload="none"`, so the 1.2MB refuge recording is only fetched if the viewer
asks for it.

Two guards were needed, both because the slide layer closes on any click or key
that is not Continue:

- the button calls `stopPropagation()`, or pressing it would also close the slide;
- the window-level keyboard shortcuts ignore Space/Enter when focus is inside
  `.stopping-slide-actions`, or activating the button from the keyboard would
  both play the chant and close the slide.

Tests: `slide-utils.test.mjs` (22 checks) covers the descriptor contract,
including that no factory emits a rem-based font size and that `atStart` implies
`once`. `npm test` now runs both suites.

---

## Slide Layout Rework

This section records what changed in the slide rendering rework and, more
usefully, *why*, so the reasoning is not lost.

### The original defect

The design was authored in container query units (`cqw`), which was the right
idea. But the slide factories in `slide-utils/` also emitted inline font sizes
like `clamp(0.95rem, 2.6cqw, 1.55rem)`, and `openStoppingSlide()` applied them
as **inline styles** — which override the stylesheet unconditionally.

At the ~960px laptop width the design was tuned at, the `rem` bounds happen to
land almost exactly on the `cqw` values (24.8px vs 24.5px), so that one size
looked correct and every other size degraded. Measured body size as a share of
player width, against a design intent of 2.55%:

| Player width | Before | Symptom |
| :--- | :--- | :--- |
| 375px (mobile) | 4.05% | 1.6x oversized: bullets clipped, overlapping the Continue button |
| 960px (laptop) | 2.58% | correct — the single tuned size |
| 1920px (fullscreen) | 1.29% | pinned at the `rem` cap, half its intended size |

Two consequences followed:

1. The `.is-dense` rules were **dead code**. With 7 bullets the class was applied
   and the stylesheet asked for 17.8px, but the inline style still won at 24.8px.
   Even at the "good" 960px size the content overlapped the footer by 65px and was
   clipped 19px outside the stage.
2. Nothing ever measured height. `cqw` is width-only, density was guessed from
   bullet and character counts, and `.slide-bullets-box` used `min-height: fit-content`
   inside a `min-height: 0` flex parent, so overflow escaped instead of being constrained.

### What replaced it

- **`slide-layout.js` (new)** — the whole layout model: design tokens, the
  typography fitting search, and the uniform viewport scaler. See sections 1, 1b
  and 1c above.
- **Typography is owned solely by the model.** The factories no longer emit
  `titleSize` / `bulletSize` defaults (they are `null`). Setting either one
  explicitly on a slide is still honoured, as a deliberate escape hatch that opts
  that slide out of fitting.
- **`.is-dense` was removed entirely**, from both the stylesheet and
  `openStoppingSlide()`. Density is now measured, not guessed.
- **The slide is one composited surface.** The background artwork moved from
  `.stopping-slide-layer` onto `.slide-canvas`, so art and type scale in lockstep.
  This is also required for correctness: `transform` on the canvas creates a new
  **backdrop root**, and a `backdrop-filter` can only sample what is painted inside
  its own root. With the artwork left on the layer, the frosted card had nothing to
  sample and rendered as flat dark slate. The radial scrim moved with it, to
  `.slide-canvas::before`.
- **The footer became player UI.** It renders outside the scaled canvas so it stays
  legible and tappable on small players; its measured height is converted back into
  logical units and reserved out of the content area, which is what guarantees it
  can never cover slide text.
- **Fullscreen gained a fallback** so mobile works at all. See section 1d.
- Added `-webkit-backdrop-filter` alongside every `backdrop-filter` for iOS Safari.

### Bugs found and fixed while testing

- **Infinite loop in the fit search.** Float rounding let the bisection midpoint
  collide with a bound, so the loop never terminated. The search now runs over an
  integer grid.
- **Stale scale after a background resize.** The rescale was deferred to
  `requestAnimationFrame`, which is suspended while the page is hidden, so a player
  resized in a background tab came back at the wrong scale. The scale is now applied
  synchronously (it is only a rect read and a custom property write); only the rare
  re-fit stays deferred. A `visibilitychange` listener reconciles anything missed.
- **Silently dead fullscreen button.** Covered in section 1d.

### Verified

`npm test` (29 checks) and `npm run build` pass. Exercised in-browser across
2 / 4 / 7 / 14 bullets, a single overlong bullet, all three slide archetypes,
375px to 3840px, mobile portrait and landscape, pseudo fullscreen entry and exit,
resizing while a keypoint is displayed, and the real playback flow including
pause-on-keypoint, focus handling, Enter/button resume and rewind re-arming.

Not verified on hardware: native fullscreen could not be exercised in the
available automation environments (both refused the Fullscreen API), and no iOS
device or simulator was available. The desktop native path is unchanged from the
previously working implementation.

---

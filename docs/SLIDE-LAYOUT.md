# Slide Layout Model

How a keypoint slide decides its typography and how it is scaled to the player.
Implemented in [`slide-layout.js`](../slide-layout.js); the constants live in its
`TOKENS` block and are the only place slide typography numbers exist.

> **Invariant for contributors (human or AI):** never put a slide font size,
> spacing value or padding anywhere else — not in `style.css`, not in a slide
> factory, not as an inline style. Doing so silently overrides the fitting model.
> This is exactly the defect the model was built to remove; see
> [CHANGELOG.md](CHANGELOG.md).

---

### 1. The "Vector / PDF-Like" Scaling Philosophy

Slide rendering is split into **two independent responsibilities**. Keeping them
separate is what makes the system predictable:

```
lesson content
      ↓
[1] constrained typography fitting   → runs once per slide, viewport-independent
      ↓
logical presentation canvas (1600 × 900)
      ↓
[2] uniform viewport scaling         → runs on every resize, no reflow
      ↓
actual player viewport
```

**[1] Content fitting** lays the slide out on a fixed 1600 × 900 logical canvas
and measures it. Because the canvas never changes size, the measurement — and
therefore the chosen typography — is completely independent of the viewport: a
slide looks the same on a phone and on a 4K display, just smaller. It is also
deterministic, so nothing re-flows or jumps while the viewer resizes the window.

**[2] Viewport scaling** composites the finished canvas into whatever area the
player currently occupies with a single uniform transform, the way a PDF viewer
scales a page or Reveal.js scales a deck:

```javascript
scale = Math.min(stageWidth / 1600, stageHeight / 900);
```

Everything on the canvas — background art, typography, bullet spacing, the
translucent panel, margins, padding, shadows — is expressed in logical pixels on
that canvas, so every proportion is preserved exactly at any player size.

> **Why not container query units alone?** The previous implementation expressed
> the design in `cqw` (correct in principle), but the slide factories *also*
> emitted inline `clamp(0.95rem, 2.6cqw, 1.55rem)` font sizes, and an inline
> style overrides the stylesheet. The `rem` bounds happened to coincide with the
> `cqw` values at the ~960px laptop width the design was tuned at, so that one
> size looked right while every other size degraded: text pinned to the `rem`
> maximum in fullscreen (half its intended size) and to the `rem` minimum on
> mobile (1.6× oversized, clipping bullets and overlapping the Continue button).
> Typography sizes are now owned solely by the layout model.

---

### 1b. Constrained Typography (`slide-layout.js`)

Rather than a set of breakpoints, the model exposes a single **fit parameter**
searched between a preferred and a minimum typographic step:

```
preferred typography (fit = 1.00)
       ↓  measure rendered content against the usable content height
slightly reduce type, and spacing faster than type
       ↓
readability floor (fit = 0.70 → body 28.7 logical px)
       ↓  still doesn't fit?
report "exceeds readable content capacity" — never shrink further
```

- Font sizes scale linearly with the fit parameter; **spacing and line-height
  collapse faster**, so a crowded slide spends whitespace before it spends
  legibility. The heading/body ratio is constant at every step, so the visual
  hierarchy never changes.
- The search is a bisection over a 15-step integer grid, so it settles in four
  measurements and always returns the same result for the same content.
- **The floor is the one number to tune.** `FIT_MIN` in `slide-layout.js` puts
  body text at 28.7 logical px (3.1% of slide height, ≈28pt on a 16:9 deck). It
  reproduces the previously hand-tuned "dense" step, and corresponds to roughly
  15 lines of body text in the usable content region.

**When a slide is genuinely too long**, the model holds the floor, sets
`data-slide-overflow="true"` on the canvas, keeps every bullet present and
reachable by making the content region scrollable, and logs a development
warning. Lesson content is never truncated, and text is never shrunk into
illegibility.

All design constants live in the `TOKENS` block of `slide-layout.js`. No slide
typography number exists anywhere else in the codebase.

---

### 1c. The Continue Button

The Continue button is **player UI, not part of the scaled composition**: it
keeps a legible, tappable size on a small player instead of shrinking with the
slide. Its rendered height is measured, converted back into logical units, and
subtracted from the canvas's usable content height — which is what guarantees it
can never cover slide text at any player size.

---

### 1b-ii. Title Fitting and the Title-Safe Area

Slide titles vary far more in **length** than in line count — compare
`"Coming up"` with `"Coming Up, Introduction — Written by Gampopa"`. So the title
gets its own narrow fit, separate from the body fit:

```
title at the slide's typographic step
       ↓  measure: does it fit on ONE line inside the title-safe width?
shrink the title only (HEADING_FIT_MAX 1.00 → HEADING_FIT_MIN 0.62)
       ↓  still too long?
allow it to wrap
```

- The title fit **multiplies** the body fit rather than replacing it, so a heading
  is never larger than the step the slide as a whole is using. The CSS is
  `calc(var(--slide-heading-size) * var(--slide-heading-fit))`.
- It is measured at the *preferred* body step. The body fit that runs afterwards
  can only scale the heading down further, never up, so a title that fits at
  measurement time still fits at the end.
- The floor, `HEADING_FIT_MIN = 0.62`, is set so the title can never shrink below
  the body text and invert the hierarchy. Past that point the title wraps instead.
- Wrapping is the fallback, not the default, because a wrapped title eats vertical
  space that the bullets need.

**Title-safe area.** Slide artwork may carry a mark in a top corner —
`coming-up-bg.png` has the lineage logo at roughly x 0.90–0.97 of its width — and
a long centred title would otherwise run underneath it. `TOKENS.headingSafeInset`
(90 logical px) is kept clear at **each** side of the heading, so the heading
stays centred and its right edge cannot reach the logo. Measured from the
artwork: the logo's left edge is at ~1445 logical px and the content box ends at
1523, so 78px is the minimum; 90 leaves clearance.

If you replace the artwork with a version that has no corner mark (or one in a
different place), adjust that single token.

---

### 1c-ii. The Announcement Banner

The lower-third announcement is composited on a **logical 1600×900 canvas**, so it
behaves like a lower-third burnt into the video frame: identical proportions at
every player size.

Its scale, `--banner-scale`, is written on `.player-stage` alongside
`--slide-scale`. On a laptop or phone landscape the two are equal. On a smaller player
they differ on purpose: the stopping slides move to a smaller canvas (§1e) but the
banner stays on 1600×900, because it was already readable there and
enlarging it made it cover a third of the video.

**It sits above YouTube's subtitles.** The iframe draws subtitles along the bottom
of the frame, where our page cannot measure them. Measured with captions on at a
397px and a 200px player, they scale with the player: one line reaches ~7.5% of
the frame height from the bottom, two lines ~11.5%. The banner's bottom edge is
therefore at 120 of 900 (13.3%), clearing two lines at every player size. It was
at 48 (5.3%), on top of the first line.

> The banner previously mixed container units in the stylesheet with
> `clamp(0.95rem, 2.85cqw, 1.6rem)` inline sizes applied by the engine — the same
> defect that once broke the slides. On a phone the text pinned to the `0.95rem`
> floor and rendered roughly 50% oversized relative to the frame, wrapping and
> overflowing the banner. Its sizes are now logical pixels on the canvas, and the
> factory no longer emits `redSize` / `blackSize` defaults.

---

### 1e. Smaller Canvases for Small Players

Uniform scaling alone cannot serve a small player. On a phone held upright the
player is about 356px wide, so the 1600px canvas renders at scale 0.22, and a dense
slide at the readability floor came out at **6.4 screen px** (measured). A narrow
desktop window has the same problem to a lesser degree. The fit cannot help,
because it chooses sizes relative to the canvas, and the canvas is what shrinks.

So a small player lays out on a smaller canvas **with the same tokens**. The text
is then larger relative to the slide, and larger on screen.

**The rule is about the result, not the device.** `designFor()` picks the
**largest** canvas on which floor-size body text still renders at
`MIN_READABLE_BODY_PX`, and falls back to the smallest. It applies equally to
phones, tablets and a browser window someone has made narrow on a laptop.

`MIN_READABLE_BODY_PX` is **16px**, the web's default body text size. It was first
12px (a readable minimum), but on a 745px laptop player the densest slide then fit
at 13.4px without scrolling, and it was plainly easier to read larger with a short
scroll. Raise it for larger type (more scrolling); lower it for less scrolling.

| Canvas | Used when the player is | Floor body on screen | Side padding | Title-safe inset |
| :--- | :--- | :--- | :--- | :--- |
| `DESIGN` 1600×900 | 892px wide and up (a full-width laptop player is 960) | 16px and up | 77 | 90 |
| `MEDIUM_DESIGN` 1200×675 | 669–891px (smaller laptop windows, phone landscape) | 16–21px | 56 | 70 |
| `COMPACT_DESIGN` 900×506.25 | under 669px (small windows, phones) | up to 21px; 11.4px at a 356px phone | 36 | 60 |

Each smaller canvas carries its own `padX` and `headingSafeInset`, because the
full-canvas margins are proportionally too wide there. On the medium and compact
canvases the takeaways card and the coming-up column also widen: the card to 100%,
and the column to the title-safe width so it stays clear of the artwork's logo.

Three sizes rather than two keep each step moderate: each step down enlarges the
text by a third, rather than jumping straight from the full to the phone canvas.

**A slide too dense for its canvas scrolls instead of shrinking.** Only the bullet
list scrolls; the label and heading stay fixed so the viewer never loses the
slide's title. A fade at the bottom signals there is more, and matching bottom
padding lets the last line scroll fully clear of it. On a smaller canvas this is
the expected state for a dense slide, so it is not reported as an authoring
problem. The console warning still means "does not fit the full canvas".

Two details that were found by testing on a phone:

- **The fit must be measured with scrolling off.** While `data-slide-overflow` is
  set, the bullets scroll inside the content box, so the box never overflows and a
  re-fit would conclude the preferred size fits. `fitContent()` clears the flag
  before measuring.
- **Scroll anchoring is off** (`overflow-anchor: none`) on the content and the
  bullet list. The browser otherwise nudges a scroll box when the fit resizes the
  text inside it, and a slide could open part-way down. The bullet list's scroll
  position is also reset whenever a slide is laid out, because the element is
  reused from slide to slide.

**The canvas is chosen per size class, not continuously.** Resizing within a class
only rescales (invariant 4). Moving to a different canvas re-fits once, through the
same path as the footer-reserve re-fit in `refresh()`.

---

### 1d. Fullscreen & Mobile Playback

Fullscreen has two implementations behind one button, because the Fullscreen API
is not universally available for ordinary elements.

**Native fullscreen** (`requestFullscreen` / `webkitRequestFullscreen`) is used
wherever the browser supports it — desktop Chrome, Safari, Firefox, Edge, and
Android Chrome.

**Pseudo fullscreen** is the fallback. `#player-box` gets the
`.is-pseudo-fullscreen` class, which pins it over the viewport with
`position: fixed; inset: 0`, and `<body>` gets `.has-pseudo-fullscreen` to stop
the page scrolling underneath. It is entered when:

- the native API is **absent** — most importantly **iOS Safari on iPhone**, where
  fullscreen exists only on `<video>` (`webkitEnterFullscreen`) and a `<div>` has
  neither `requestFullscreen` nor `webkitRequestFullscreen`; or
- the native API is **refused** — the request can fail either by throwing
  synchronously (Chrome's permissions check, e.g. a hidden tab or an embedded
  context that disallows fullscreen) or by rejecting its promise. Both paths fall
  back, so the button is never silently dead.

**Why this matters for lessons.** Without the fallback, tapping fullscreen on an
iPhone did nothing, so the only way to go fullscreen was YouTube's own control
*inside the iframe*. A natively fullscreened iframe cannot be overlaid by our
DOM, so the slide layer, chapters drawer and corner menu all disappeared: the
lesson paused at a keypoint and simply showed a frozen video with no slide.
Pseudo fullscreen keeps everything inside our own DOM, so overlays keep working.

**Exiting.** Native fullscreen is dismissed by the browser (Escape, system UI).
Pseudo fullscreen covers the control bar and phones have no Escape key, so the
player renders its own exit button (`#pseudo-fs-exit-btn`) in the top-left of the
stage whenever pseudo fullscreen is active. Escape also exits it on desktop.

**Chapters in fullscreen.** The floating corner menu (`.top-corner-menu-btn`) is
normally gated to narrow or touch viewports. In pseudo fullscreen it is shown at
any width, because the control bar beneath the player is covered and it is then
the only route into the chapters drawer.

**Rescaling.** Pseudo fullscreen fires no `fullscreenchange` event, but the slide
layout model observes the player stage with a `ResizeObserver`, so the slide
rescales on entering and leaving either mode without any extra wiring.

> **CSS note:** the native fullscreen rules are written as one rule per selector
> rather than a selector list. A list containing a pseudo-class the browser does
> not recognise (such as `:-webkit-full-screen` in Firefox) invalidates the
> *entire* rule, which would silently drop fullscreen styling in that browser.

---

### 2. Slide Visualization Archetypes

The player provides distinct, specialized visualization templates tailored for pedagogical pacing:

| Archetype | Trigger Type | Visual Design & Styling | Pedagogical Purpose |
| :--- | :--- | :--- | :--- |
| **"Some Takeaways"** (`takeaways`) | Pausing (Stopping Slide) | Frosted glassmorphism box (`rgba(96, 145, 149, 0.50)` + `backdrop-filter: blur(2px)`) over sacred artwork with celadon accents and high-contrast white serif typography. | Consolidates key philosophical points and takeaways after a teaching section before moving forward. |
| **"Coming Up"** (`comingUp`) | Pausing (Stopping Slide) | Full-bleed artistic landscape backdrop (`coming-up-bg.png`) with clean, centered typography without a bounding card. | Previews the structure and topics of the upcoming discourse to orient the listener. |
| **"Final / Closing"** (`finalSlide`) | Pausing (Stopping Slide) | Minimalist closing design with large-scale centered title (1.15× the heading token) over background artwork. | Concludes the teaching with final words of thanks or dedication. |
| **Announcement Banner** (`announcement`) | Non-pausing (Overlay) | Horizontal lower-third ribbon bar with soft horizontal gradient fade, burgundy primary heading, and dark secondary label. | Highlights speaker names, book chapter transitions, or sutra citations without interrupting audio. |
| **Timed Panel** (`timedPanel`) | Non-pausing (Side Overlay) | Left-aligned dark gradient mask (`width: 62%`) displaying structured points while keeping video subject visible on the right. | Delivers supplemental lecture notes alongside active video playback. |

---

### 3. Content Density Adaptation

Density is no longer guessed from bullet or character counts and is no longer a
two-state CSS class. `slide-layout.js` measures the slide's actual rendered
height on the logical canvas and picks a typographic step for it, anywhere on the
continuum between the preferred and minimum steps.

| Content | Chosen fit | Body size (logical px) |
| :--- | :--- | :--- |
| 2 short bullets | 1.00 | 41.0 |
| 4 normal bullets | 1.00 | 41.0 |
| 7 long bullets | 0.74 | 30.3 |
| 1 unusually long bullet | 1.00 | 41.0 |
| 14 bullets | 0.70 (floor) | 28.7 — flagged as over capacity |

Short slides cannot grow beyond the preferred step, so they never get comically
large text; long slides cannot fall below the readability floor, so they never
become unreadably small.

---

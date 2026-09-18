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

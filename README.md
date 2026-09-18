# KKGR Player — Interactive Video Slide Player

An interactive, responsive video lecture player designed for Dharma teachings and structured educational presentations. It synchronizes YouTube playback with full-frame interactive stopping slides, timed side panels, lower-third announcement banners, an in-player chapters drawer, and responsive video chapters.

---

## 🎨 Slide Visualization & Scaling Architecture

A primary design requirement of KKGR Player is that slide overlays must behave **like vector slides or a PDF presentation**, maintaining absolute visual harmony and proportions regardless of the playback medium (desktop laptop window, ultra-wide 4K fullscreen, or mobile display).

```
┌──────────────────────────────────────────────────────────────────┐
│ .player-stage — the 16:9 player area (available space)           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ .slide-canvas — 1600 × 900 logical, transform: scale(s)     │  │
│  │                                                             │  │
│  │   Heading  (--slide-heading-size, 77px at fit 1.00)         │  │
│  │                                                             │  │
│  │   ┌─────────────────────────────────────────────────────┐   │  │
│  │   │ Frosted card (.slide-bullets-box)                   │   │  │
│  │   │  • Bullet  (--slide-body-size, 41px at fit 1.00)    │   │  │
│  │   │  • Bullet   gap/line-height also fit-driven          │   │  │
│  │   └─────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │   (footer height is reserved out of the content area)       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Slide Tip]                             [Continue Button ➔]     │
│  .stopping-slide-footer — player UI, outside the scaled canvas   │
└──────────────────────────────────────────────────────────────────┘
```

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

## 📁 Architecture & Codebase Structure

```
kkgr-player/
├── index.html              # Clean semantic markup (< 130 lines) hosting the 16:9 container
├── style.css               # Design system, CSS variables, logical slide canvas, drawer & fullscreen
├── slides-data.js          # Declarative lesson data (VIDEO_ID, SEGMENTS, SLIDES timeline)
├── player.js               # Playback engine: YouTube API sync, time loop, drawer & fullscreen
├── slide-layout.js         # Slide layout model: design tokens, typography fitting, uniform scaling
├── slide-layout.test.js    # Focused checks on the typography constraints (node slide-layout.test.js)
├── slide-utils/            # Functional slide generator helpers
│   ├── index.js            # Unified export hub for slide utilities
│   ├── announcement.js     # Lower-third banner generator with duration & reading-time calculation
│   ├── coming-up.js        # "Coming up" slide constructor
│   ├── takeaways.js        # "Some takeaways" slide constructor
│   └── final-slide.js      # Lesson closing slide constructor
├── slides/                 # Visual artwork and background assets
│   ├── coming-up-bg.png
│   ├── takeaways-bg.png
│   └── slide-1.png
├── package.json            # Vite configuration and build dependencies
└── README.md               # Technical architecture & visualization guide
```

---

## 🧩 Core Engine Subsystems (`player.js`)

1. **YouTube IFrame API Sync**:
   - Asynchronous API bootstrap with state management (`YT.PlayerState`).
   - Standardized player interface (`playerPlay`, `playerPause`, `playerSeekTo`, `playerGetCurrentTime`).

2. **High-Frequency Playback Loop (`checkPlaybackTime`)**:
   - 100ms interval polling player position against slide timelines.
   - Dynamic segment highlight tracking in the chapter list.

3. **Multi-Slide Priority Resolution**:
   - Resolves simultaneous timestamp collisions using a deterministic queue:
     1. Takeaways stopping slides (video pauses)
     2. Coming up stopping slides (video pauses)
     3. Final closing slides
     4. Lower-third announcements (deferred until stopping slides are completed and playback resumes)

4. **Bi-directional Rewind & Re-arming**:
   - Scrubbing backwards before a slide's timestamp automatically resets `slide.passed = false`, re-enabling interactive pausing on subsequent playback.
   - Scrubbing out of an active slide cleanly dismisses open overlays and clears the stopping queue.

5. **Interactive Slide Progression**:
   - Step-by-step bullet point reveal via `Space`, mouse click, or tap.
   - Continue / Resume playback via `Enter`, `Escape`, or clicking the animated `Continue lesson ➔` button.

6. **In-Player Chapters Drawer & Fullscreen Controller**:
   - Slide-in glassmorphism chapters panel accessible directly over the video in both windowed and fullscreen modes.
   - Fullscreen container expansion (`#player-box:fullscreen`) ensuring all overlays and interactive components remain functional in fullscreen mode.

---

## 📝 Declarative Slide Specification (`slides-data.js`)

Slides are defined declaratively using the modular factory utilities:

```javascript
import { announcement, comingUp, takeaways, finalSlide } from './slide-utils/index.js';

export const VIDEO_ID = "j8WneixXOV4";
export const SLIDE_BG = "slides/takeaways-bg.png";

export const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" },
  { at: "0:29", title: "Essence of the Jewel Ornament of Liberation", note: "Introduction written by Gampopa" },
  { at: "3:05", title: "Overview of Gampopa's Life & Work", note: "Historical context" },
  { at: "25:15", title: "Introduction — Written by Gampopa", note: "Homage and purpose" }
];

export const SLIDES = [
  // 1. Lower-third announcement banner
  announcement(
    "Essence of the Jewel Ornament of Liberation",
    "Introduction written by Gampopa",
    { at: "0:29", duration: 8 }
  ),

  // 2. "Coming up" preview stopping slide
  comingUp([
    "All phenomena fall into two: samsara and nirvana — both empty by nature.",
    "Empty means no independent entity: everything is illusory, changing.",
    "Samsara is a confused mental projection; its defining characteristic is suffering.",
    "Nirvana is all confused projections exhausted: freedom from suffering."
  ], {
    at: "00:03:05.000",
    title: "Coming up",
    buttonText: "Continue lesson"
  }),

  // 3. "Some takeaways" review stopping slide
  takeaways([
    "Gampopa bows to Manjushri so we may develop the wisdom that cuts ignorance.",
    "Homage is paid to the Three Jewels because in samsara there is no other refuge.",
    "Homage to the lamas who are the foundation of the buddhas and their followers.",
    "Gampopa wrote this book depending on the kindness of Milarepa and Atisha."
  ], {
    at: "00:25:15.300",
    title: "Some takeaways"
  }),

  // 4. Final closing slide
  finalSlide("Thank you for watching", {
    at: "00:53:32.933"
  })
];
```

---

## 🚀 Generalizing to Multiple Lessons / Courses

To expand the codebase into a full multi-lecture platform:

### Pattern A: Modular Lesson Files
1. Create a `lessons/` folder containing individual lesson definitions (e.g. `lessons/lesson-01.js`, `lessons/lesson-02.js`).
2. Implement a dynamic loader in `player.js`:
   ```javascript
   export function loadLesson(lessonModule) {
     initPlayer(lessonModule.VIDEO_ID, lessonModule.SEGMENTS, lessonModule.SLIDES);
   }
   ```
3. Switch lessons via URL search parameters (`?lesson=lesson-01`) or an interactive course curriculum sidebar.

### Pattern B: Headless JSON API / CMS Integration
1. Host lesson data as JSON configurations with video IDs, chapter arrays, and slide definitions.
2. Fetch and hydrate the player dynamically: `fetch('/api/lessons/' + id).then(r => r.json()).then(setupPlayer)`.

---

## 🛠️ Development Scripts

```bash
# Start local development server with Hot Module Replacement
npm run dev

# Compile production bundle
npm run build

# Preview production build locally
npm run preview

# Run the slide layout model checks (no test framework required)
npm test
```

# KKGR Player — Interactive Video Lesson Template

A reusable player for structured video teachings. It synchronises YouTube
playback with full-frame keypoint slides, lower-third announcement banners, timed
side panels and an in-player chapters drawer.

**This is a template, not a single-video page.** One engine plays any number of
lessons, and it is designed to be adopted into a larger website: lesson content
is pure data, the engine holds no content, and slide appearance is decided in one
place.

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev -- --open '/watch.html?lesson=jewel-ornament-02'
```

---

## Documentation

The docs are the source of truth and are written to guide development — human or
AI-assisted. Start with the one matching what you are changing.

| Document | What it covers |
| :--- | :--- |
| **[CLAUDE.md](CLAUDE.md)** | **Start here.** Which layer owns what, the invariants that must not be broken, conventions, and how to verify changes. |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | The layer boundaries, the lesson descriptor contract, and the runtime flow. |
| [docs/AUTHORING-LESSONS.md](docs/AUTHORING-LESSONS.md) | Adding a video: slide archetypes, timestamp formats, how much text fits, checklist. |
| [docs/SLIDE-LAYOUT.md](docs/SLIDE-LAYOUT.md) | The typography fitting model, uniform viewport scaling, and fullscreen/mobile behaviour. |
| [docs/EMBEDDING.md](docs/EMBEDDING.md) | Integrating the player into a website, and the mount API that is still outstanding. |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | What changed and *why* — the reasoning behind the current design. |

---

## Adding a video

One file and one line. No engine changes.

```js
// lessons/my-lesson.js
import { announcement, comingUp, takeaways, finalSlide } from '../slide-utils/index.js';

export const lesson = {
  id: 'my-lesson',
  title: 'Teacher Name',
  subtitle: 'Series or text being taught',
  videoId: 'yourYouTubeId',
  slideBg: 'slides/slide-1.png',
  segments: [{ at: '0:00', title: 'Start of the Video', note: 'Opening remarks' }],
  slides: [
    announcement('Chapter title', 'Subtitle line', { at: '0:29' }),
    takeaways([
      'First point to remember.',
      'Second point to remember.'
    ], { at: '00:25:15.300' }),
    finalSlide('Thank you for watching', { at: '00:53:32.933' })
  ]
};
export default lesson;
```

```js
// lessons/index.js
import { lesson as jewelOrnament01 } from './jewel-ornament-01.js';
import { lesson as myLesson } from './my-lesson.js';      // <- add this

export const LESSONS = {
  'jewel-ornament-01': jewelOrnament01,
  'my-lesson':         myLesson                           // <- and this
};
```

It appears on the landing page; the player URL is `watch.html?lesson=my-lesson`. Full guide: [docs/AUTHORING-LESSONS.md](docs/AUTHORING-LESSONS.md).

---

## Structure

```
kkgr-player/
├── index.html              # Landing page: lists every registered lesson
├── landing.js              #   renders that list from lessons/index.js
├── watch.html              # Player page template: the 16:9 stage and overlay markup
├── style.css               # Design system, slide canvas, drawer, fullscreen
│
├── lessons/                # CONTENT — pure data, one file per video
│   ├── index.js            #   registry + ?lesson= resolution
│   ├── jewel-ornament-01.js  # Introduction Part 1
│   └── jewel-ornament-02.js  # Introduction Part 2
│
├── slide-utils/            # AUTHORING — factories producing slide descriptors
│   ├── index.js            #   public API (re-exports only)
│   ├── reading-time.js     #   shared duration estimation & argument handling
│   ├── announcement.js     #   lower-third banner
│   ├── coming-up.js        #   "Coming up" stopping slide
│   ├── takeaways.js        #   "Some takeaways" stopping slide
│   ├── final-slide.js      #   closing slide
│   └── generic.js          #   stoppingSlide / timedPanel / segment
│
├── player.js               # ENGINE — YouTube sync, timeline, overlays, chapters
├── slide-layout.js         # PRESENTATION — typography fitting + uniform scaling
├── slide-layout.test.js    # Layout model checks (npm test)
│
├── slides/                 # Background artwork
├── public/audio/           # Chant recordings offered on image slides
├── docs/                   # Architecture, authoring, layout, embedding, changelog
└── CLAUDE.md               # Development guide and invariants
```

Each layer knows only about the one below it: a new video touches only `lessons/`,
a new visual treatment touches only `slide-layout.js` and `style.css`.

---

## How slides are sized

Slide typography is **not** a set of breakpoints. Each slide is laid out on a
fixed logical 1600×900 canvas and measured once, choosing the largest typography
that fits between a preferred size and a readability floor. That finished canvas
is then scaled into the player with a single uniform transform:

```js
scale = Math.min(stageWidth / 1600, stageHeight / 900);
```

So the slide behaves like a PDF page: identical proportions at every player size,
and no reflow while resizing. A slide with too much content to stay readable is
reported rather than shrunk or clipped.

Details and the tuning constants: [docs/SLIDE-LAYOUT.md](docs/SLIDE-LAYOUT.md).

> **The one rule:** slide font sizes live only in `slide-layout.js`. Setting one
> in CSS or inline silently overrides the model — that was the original bug this
> design replaced.

---

## Scripts

```bash
npm run dev       # dev server with HMR
npm run build     # production bundle into dist/
npm run preview   # preview the production build
npm test          # layout model checks (no test framework required)
```

The runtime has **no third-party dependencies**. Vite is a build-time dev
dependency; the YouTube IFrame API loads from Google at runtime.

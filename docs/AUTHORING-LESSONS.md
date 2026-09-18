# Authoring a Lesson

Adding a video to the template means adding **one file** and **one line**. No
engine code changes.

## 1. Create the lesson file

`lessons/my-lesson.js`:

```js
import { announcement, comingUp, takeaways, finalSlide } from '../slide-utils/index.js';

const VIDEO_ID = 'yourYouTubeId';
const SLIDE_BG = 'slides/slide-1.png';

const SEGMENTS = [
  { at: '0:00', title: 'Start of the Video', note: 'Opening remarks' }
];

const SLIDES = [
  announcement('Chapter title', 'Subtitle line', { at: '0:29' }),

  comingUp([
    'First thing the teaching will cover.',
    'Second thing.'
  ], { at: '00:03:05.000', title: 'Coming up' }),

  takeaways([
    'First point to remember.',
    'Second point to remember.'
  ], { at: '00:25:15.300', title: 'Some takeaways' }),

  finalSlide('Thank you for watching', { at: '00:53:32.933' })
];

export const lesson = {
  id: 'my-lesson',
  title: 'Teacher Name',
  subtitle: 'Series or text being taught',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES
};

export default lesson;
```

## 2. Register it

In `lessons/index.js`:

```js
import { lesson as jewelOrnament01 } from './jewel-ornament-01.js';
import { lesson as myLesson } from './my-lesson.js';      // <- add this

export const LESSONS = {
  'jewel-ornament-01': jewelOrnament01,
  'my-lesson':         myLesson                           // <- and this
};
```

## 3. Open it

`http://localhost:5173/?lesson=my-lesson`

Omitting `?lesson=` loads `DEFAULT_LESSON_ID`. An unknown id warns in the console
and falls back to the default rather than showing a broken page.

---

## Timestamps

Accepted formats, all parsed by `parseTimestamp()`:

| Format | Example | Meaning |
| :--- | :--- | :--- |
| `m:ss` | `3:05` | 3 min 5 s |
| `h:mm:ss` | `1:03:05` | 1 h 3 min 5 s |
| `hh:mm:ss.mmm` | `00:03:05.000` | fractional seconds |

Use the precise `hh:mm:ss.mmm` form for slides — a keypoint that fires a second
early cuts off the teacher mid-sentence.

Slides may be listed in any order; the engine sorts them. When two slides share a
timestamp, they are shown in priority order: takeaways → coming-up → final →
other stopping slides → announcements.

## Slide archetypes

| Factory | Pauses? | Use for |
| :--- | :--- | :--- |
| `announcement(red, black, opts)` | No | A lower-third banner naming a chapter or text. Also becomes a chapter marker automatically. |
| `comingUp(bullets, opts)` | Yes | Previewing what the next section covers. Full-bleed artwork, no card. |
| `takeaways(bullets, opts)` | Yes | Consolidating points after a section. Frosted translucent card. |
| `finalSlide(title, opts)` | Yes | Closing the lesson. One large centred line. |
| `timedPanel(at, until, …)` | No | Notes alongside continuing playback. |
| `stoppingSlide(at, title, …)` | Yes | Anything the named archetypes do not cover. |

Common options: `at`, `title`, `bullets`, `bg`, `buttonText`, `duration`,
`revealAll`.

`announcement()` accepts `{ segment: false }` to keep it out of the chapters list.

## How much text fits on a slide

Let the layout model decide the size — do not set `titleSize` or `bulletSize`.
It measures the rendered slide and picks the largest typography that fits between
a preferred size and a readability floor.

Practical guidance:

- **2–4 bullets** of roughly one to two lines each render at the preferred size.
- **5–8 bullets** are fitted down smoothly; still comfortable.
- Beyond roughly **15 lines** of body text, the slide exceeds the readability
  floor. It is not truncated — every bullet stays present and reachable — but the
  console warns:

  ```
  [kkgr-player] Keypoint slide exceeds readable content capacity: "..."
  ```

  Treat that warning as a content signal: split the slide in two.

Warnings appear on `localhost`/`127.0.0.1`, or on any host with `?slideDebug=1`.

See [SLIDE-LAYOUT.md](SLIDE-LAYOUT.md) for the model itself.

## Backgrounds

Put artwork in `slides/` (it is copied to the build via `public/`). Use 16:9 —
it is `cover`-fitted to the 1600×900 canvas, so other ratios crop. 1920×1080 is
a good source size; the bundled art is 1024×576, which is adequate but soft on a
4K display.

## Checklist before committing a lesson

- [ ] Timestamps verified against the actual video, not the transcript.
- [ ] No `titleSize` / `bulletSize` overrides.
- [ ] No "exceeds readable content capacity" warnings in the console.
- [ ] Opened at a narrow viewport as well as a wide one.
- [ ] `npm run build` passes.

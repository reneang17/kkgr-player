# Architecture

KKGR Player is a **template**: one engine that plays any number of video lessons,
intended to be adopted into a larger website. The whole design follows from that,
so the most important thing to understand is the layer boundary.

## The layers

```
┌──────────────────────────────────────────────────────────────┐
│  lessons/<id>.js        CONTENT — pure data, one per video    │
│  lessons/index.js       registry: id -> descriptor            │
└──────────────────────────────┬───────────────────────────────┘
                               │  lesson descriptor
┌──────────────────────────────▼───────────────────────────────┐
│  slide-utils/           AUTHORING — factories that turn a     │
│                         few arguments into slide descriptors  │
└──────────────────────────────┬───────────────────────────────┘
                               │  slide descriptors
┌──────────────────────────────▼───────────────────────────────┐
│  player.js              ENGINE — YouTube sync, timeline loop, │
│                         overlays, chapters, fullscreen        │
└──────────────────────────────┬───────────────────────────────┘
                               │  "render this slide"
┌──────────────────────────────▼───────────────────────────────┐
│  slide-layout.js        PRESENTATION — typography fitting and │
│  style.css              uniform scaling of the slide canvas   │
└──────────────────────────────────────────────────────────────┘
```

Each layer only knows about the one below it. That is what makes the template
reusable: a new video touches only the top layer, and a new visual treatment
touches only the bottom.

## What each file owns

| File | Owns | Must NOT contain |
| :--- | :--- | :--- |
| `lessons/<id>.js` | One video's id, chapters and slide timeline | DOM, styling, player calls |
| `lessons/index.js` | Which lessons exist, their order; `?lesson=` resolution; lesson URLs | Lesson content |
| `landing.js` | The lesson list on `index.html` | Playback; it never imports the engine |
| `slide-utils/*.js` | Slide descriptor shapes and defaults | DOM, typography sizes |
| `player.js` | Playback, timeline, overlays, chapters, fullscreen | Lesson content, typography sizes |
| `slide-layout.js` | Design tokens, typography fitting, viewport scaling | Lesson content, playback logic |
| `style.css` | Appearance | Slide font sizes (they come from `slide-layout.js`) |

## The lesson descriptor

The single contract between content and engine:

```js
{
  id:       'jewel-ornament-01',   // must match the registry key
  name:     'Introduction Part 1', // place in the series: landing card, header, tab title
  title:    'Khenchen Rinpoche',   // page <h1> and document title
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId:  'j8WneixXOV4',         // YouTube id
  slideBg:  'slides/slide-1.png',  // fallback background for generic slides
  segments: [ /* chapter markers */ ],
  slides:   [ /* slide descriptors, any order; the engine sorts them */ ],
  handout:  { file, label, filename }   // optional PDF offered in the control bar
}
```

It is plain, serialisable data. Nothing in it references the DOM or the player,
so the same object could equally arrive from a CMS or a JSON API — see
[EMBEDDING.md](EMBEDDING.md).

## How a lesson reaches the engine

1. `player.js` calls `loadLesson()` from `lessons/index.js`.
2. `resolveLessonId()` reads `?lesson=` from the URL, falling back to
   `DEFAULT_LESSON_ID` (and warning) if it is missing or unknown.
3. The registry returns that lesson's descriptor. Lookup is synchronous;
   lessons/index.js documents why, and when to move to dynamic import().
4. A `window.KKGR_LESSON` global, if a host page has set one, takes precedence
   over the registry entirely.

## Runtime flow

1. The YouTube IFrame API loads and `player.js` polls playback position every 100ms.
2. When playback crosses a slide's timestamp, the engine resolves collisions by
   priority (takeaways → coming-up → image slides such as the dedication → final
   → other stopping slides → announcements → timed panels), pauses if the slide
   is a stopping slide, and opens it.
3. `slideLayout.layout(slide)` fits the content on the logical 1600×900 canvas and
   scales that canvas into the player.
4. Continue / Enter / Escape / click closes the slide and resumes playback.
5. Seeking backwards re-arms slides (`passed = false`) so they fire again —
   except slides marked `once`, which belong to the start of the sitting rather
   than to a point on the timeline.
6. Slides marked `openFromSegment` are not driven by the timeline at all. They
   are listed in the segments panel as actions rather than positions, and open
   only when the viewer chooses them (the refuge slide).
7. Opening such a slide never moves the playhead, and continuing from it returns
   the viewer to whatever it interrupted: the beginning of the teaching if they
   had not started, the keypoint slide they were reading, or their position in
   the video.

## Invariants

These are the rules that keep the layers honest. Breaking one has caused a real
bug before; see [CHANGELOG.md](CHANGELOG.md).

1. **Typography lives in one place.** Only `slide-layout.js` decides slide font
   sizes, spacing and line-height. A size set in CSS or inline overrides the
   fitting model and breaks every viewport except the one it was tuned at.
2. **Lesson files are pure data.** No DOM, no imports from `player.js`.
3. **The engine holds no content.** No video ids, titles or bullet text in
   `player.js`.
4. **Viewport response is scaling, not reflow.** Resizing changes only
   `--slide-scale`; it must never re-run the typography fit, or the slide will
   jump while the viewer resizes.
5. **Never silently truncate lesson content.** A slide that cannot fit above the
   readability floor is reported, not shrunk further or clipped.
6. **Overlays must stay in our own DOM.** Anything that hands rendering to the
   YouTube iframe (such as native iframe fullscreen) makes slides impossible to
   show. This is why pseudo-fullscreen exists.

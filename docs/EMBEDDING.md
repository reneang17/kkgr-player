# Embedding the Player in a Website

This template is meant to be adopted into a larger site. This page records what
is already in place for that, and what is deliberately still outstanding — so
nobody has to rediscover it.

## What is ready today

**Content is fully separated from the engine.** Lessons are plain data modules
behind a registry; the engine imports no content. Adding videos never touches
engine code.

**Lessons are registered in one place.** `lessons/index.js` maps id to descriptor
and resolves `?lesson=`. Lookup is currently synchronous via static imports; that
file documents the tradeoff and when to switch to code-split dynamic imports.

**Page chrome follows the lesson.** `title` and `subtitle` drive the `<h1>`, the
subtitle line and `document.title`, so one page template serves every video.

**No global namespace dependency.** Everything is ES modules. The `window`
assignments that remain are back-compatibility shims, marked as such and safe to
delete once nothing relies on them.

**Vite builds a static bundle.** `npm run build` emits `dist/` — plain HTML, CSS,
JS and assets, deployable anywhere.

## Three ways to integrate

### 1. Deploy the built page as-is

Build and host `dist/`. Link to lessons with `?lesson=<id>`. Simplest option;
appropriate when the player is its own page on the site.

### 2. Inject the lesson from the host page

If the surrounding site already knows which lesson to show (from its own router
or CMS), set a global before the player's module runs:

```html
<script>
  window.KKGR_LESSON = {
    id: 'from-cms',
    title: 'Teacher Name',
    subtitle: 'Series name',
    videoId: 'yourYouTubeId',
    slideBg: 'slides/slide-1.png',
    segments: [ /* ... */ ],
    slides:   [ /* ... */ ]
  };
</script>
<script type="module" src="/player.js"></script>
```

`player.js` prefers `window.KKGR_LESSON` over the registry, so the registry
becomes optional. The slide factories are also exposed on `window` (see the shim
in `slide-utils/index.js`), so a CMS-generated inline script can build slides
without bundling.

### 3. Fetch lessons as JSON

The lesson descriptor is serialisable, so it can come from an API. The factories
exist to give authors defaults and a pleasant call signature; a server can emit
the same descriptor objects directly. A JSON-fed integration would replace
`lessons/index.js` with a `fetch`, leaving every other layer untouched.

## Not done yet: the mount API

**The engine still runs as a script, not as a component.** `player.js` executes
its setup at module top level and looks elements up by hard-coded `id`
(`player-box`, `stopping-slide`, `slide-canvas`, …). So today the host page must
contain the markup from `index.html` with those ids, and only one player can
exist per page.

For a component-style integration the engine needs:

```js
export function createLessonPlayer({ root, lesson }) { /* ... */ return { destroy() {} }; }
```

which means:

1. Wrapping the top-level setup in that function.
2. Replacing `document.getElementById(...)` with `root.querySelector(...)`.
3. Rendering the markup from a template instead of requiring it in the page.
4. Returning a `destroy()` that removes listeners, the `ResizeObserver` and the
   playback interval.

This is mechanical but touches most of `player.js`, so it was deliberately not
bundled with the content refactor. Do it as its own change, with the current
behaviour as the reference.

Until then, integration styles 1 and 2 above both work.

## Assets

Runtime assets live in two places on purpose: `public/<dir>/` for the dev server
and the Vite build, and `<dir>/` at the repo root for the deployed site, which
serves the repository rather than `dist/`. Keep both in step.

Background art and audio are referenced by relative path
(`slides/takeaways-bg.png`, `audio/refuge.mp3`), resolved against the document. Serving the player from a sub-path works as long
as the `slides/` directory sits beside the page. Hosting assets elsewhere means
either setting Vite's `base`, or using absolute URLs in each lesson's `bg` fields
— the `bg` option exists per slide precisely so this stays configurable.

## Third-party dependencies

The runtime has **none**. Vite is a build-time dev dependency; the YouTube IFrame
API is loaded from Google at runtime. The layout model, fullscreen handling and
overlay system are all first-party, which keeps the bundle small and the
integration surface predictable.

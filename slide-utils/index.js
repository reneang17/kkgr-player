/**
 * slide-utils/index.js
 * Public API of the slide authoring layer.
 *
 * Lesson files import from here:
 *
 *   import { announcement, comingUp, takeaways, finalSlide } from '../slide-utils/index.js';
 *
 * Each factory returns a plain, serialisable descriptor object — no DOM, no
 * player references. That keeps lesson content pure data, so it can equally
 * well come from a CMS or an API later without touching the engine.
 *
 * This file only re-exports; every implementation lives in its own module, so
 * there is exactly one definition of each factory.
 */

export { DEFAULT_WPM, countWords, calculateReadingDuration, normalizeSlideArgs } from './reading-time.js';
export { announcement, makeAnnouncement } from './announcement.js';
export { comingUp, makeComingUp } from './coming-up.js';
export { takeaways, someTakeaways, makeTakeaways } from './takeaways.js';
export { finalSlide, makeFinalSlide, closingSlide, thanksSlide } from './final-slide.js';
export { stoppingSlide, timedPanel, segment } from './generic.js';

import { announcement } from './announcement.js';
import { comingUp } from './coming-up.js';
import { takeaways } from './takeaways.js';
import { finalSlide } from './final-slide.js';
import { stoppingSlide, timedPanel, segment } from './generic.js';

/**
 * Back-compatibility shim.
 *
 * Lesson files used to be plain scripts that relied on these factories being
 * present on `window`. New lesson files should import them instead; this shim
 * keeps any older or externally authored lesson working, and is harmless in a
 * bundle. Remove it once no lesson depends on the globals.
 */
if (typeof window !== 'undefined') {
  Object.assign(window, {
    announcement,
    makeAnnouncement: announcement,
    comingUp,
    makeComingUp: comingUp,
    takeaways,
    someTakeaways: takeaways,
    makeTakeaways: takeaways,
    finalSlide,
    makeFinalSlide: finalSlide,
    closingSlide: finalSlide,
    thanksSlide: finalSlide,
    stoppingSlide,
    timedPanel,
    segment
  });
}

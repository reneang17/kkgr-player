/**
 * lessons/credits.js
 * Acknowledgements for third-party works shown in the teachings.
 *
 * PURE DATA, like the lesson files. A lesson lists the credits that apply to it
 * in its `credits` array, and the player prints them under the segments list.
 * They live here rather than in each lesson because a work used by every
 * teaching (the dedication photograph) should be spelled out exactly once.
 *
 * These works are NOT covered by the project's own licence; each remains under
 * its owner's terms.
 *
 * A credit reads "Credit to <author> for <work>, shared via <via>" for a work
 * from a photo library, or "<work>. Courtesy of <courtesy>" for one lent by an
 * archive. `sourceUrl` links whichever of `via` / `courtesy` is given.
 */

const VIA_UNSPLASH = {
  via: 'Unsplash',
  sourceUrl: 'https://unsplash.com/license'
};

/** The photograph on the dedication slide (slides/dedication.webp). Every
 *  lesson that closes with the dedication should list it. */
export const WATER_DROP_ON_THE_LAKE = {
  work: 'Water drop on the lake',
  author: 'Leon Rohrwild',
  ...VIA_UNSPLASH
};

/** Used in the Buddha Nature teaching's video only. */
export const DREAMY_NIGHT = {
  work: 'DREAMY NIGHT',
  author: 'Aron Visuals',
  ...VIA_UNSPLASH
};

/** Image of Gampopa and Phagmodrupa used in The Spiritual Master teaching.
 *  The courtesy line links to the HAR item page so the source can be traced. */
export const GAMPOPA_AND_PAGMODRUPA = {
  work: 'Gampopa & Pagmodrubpa',
  courtesy: 'Himalayan Art Resources',
  sourceUrl: 'https://www.himalayanart.org/items/19826'
};

/** For lessons whose slides quote the root text verbatim. Those passages are
 *  marked `*…*` in the bullets and render in italics. */
export const JEWEL_ORNAMENT_QUOTES = {
  note: 'Text in italics on the slides is quoted from *The Jewel Ornament of Liberation* by Gampopa.'
};

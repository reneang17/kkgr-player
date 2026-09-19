/**
 * slide-utils/image-slide.js
 * Full-frame image stopping slides — the artwork IS the content.
 *
 * Unlike the bullet archetypes, these carry no text of their own: the supplied
 * image already contains everything the viewer reads. The engine therefore
 * renders no heading, no label and no bullet list, and the typography fitting
 * model has nothing to fit.
 *
 * Because the image carries lesson content, it is fitted with `contain` rather
 * than `cover` by default: cropping it would silently cut words off the slide,
 * which invariant 5 forbids (see CLAUDE.md). Any area the image does not cover
 * is filled with the player matte, exactly like a letterboxed video frame.
 */

/**
 * A full-frame image stopping slide. Pauses the video and waits for the viewer.
 *
 * @param {string} src - image path, e.g. 'slides/refuge.png' (16:9 recommended)
 * @param {Object} [options]
 *   @param {string}  [options.at]         - timestamp, as for any other slide
 *   @param {boolean} [options.openFromSegment] - do not fire on the timeline; list
 *                                           the slide as a segment the viewer can
 *                                           choose, and open it when they do
 *   @param {string}  [options.segmentTitle] - label for that segment entry
 *   @param {string}  [options.segmentNote]  - secondary line for that entry
 *   @param {'contain'|'cover'} [options.imageFit='contain']
 *   @param {string}  [options.title]      - accessible name; never rendered
 *   @param {string}  [options.buttonText]
 *   @param {string}  [options.audio]      - optional recording of the text being
 *                                           chanted, offered on its own button so
 *                                           the viewer can hear how it is sung
 *   @param {string}  [options.audioLabel] - label for that button
 *   @param {number}  [options.duration]   - seconds before auto-continue.
 *                                           Omitted by default: there is no text
 *                                           to derive a reading time from, so the
 *                                           slide waits for the viewer.
 * @returns {Object} stopping slide descriptor
 */
export function imageSlide(src, options = {}) {
  const openFromSegment = options.openFromSegment === true;

  return {
    kind: options.kind || 'image',
    at: options.at || '0:00',
    // A segment-opened slide is never triggered by the timeline: it is offered in
    // the segments list and shown only if the viewer asks for it.
    openFromSegment,
    segmentTitle: options.segmentTitle || options.title || '',
    segmentNote: options.segmentNote || '',
    title: options.title || '',
    bullets: [],
    bg: src,
    imageFit: options.imageFit || 'contain',
    duration: typeof options.duration === 'number' ? options.duration : null,
    buttonText: options.buttonText || 'Continue lesson',
    audio: options.audio || null,
    audioLabel: options.audioLabel || 'Play chant',
    pause: true,
    revealAll: true,
    align: 'center'
  };
}

/**
 * Refuge slide, offered before the teaching begins.
 *
 * It is NOT shown automatically. It appears as the first entry in the segments
 * list, above "Start of the Video", and opens only if the viewer chooses it;
 * continuing from it then starts the video. A viewer who simply presses play
 * goes straight into the teaching without ever seeing it — taking refuge is an
 * invitation, not a toll gate.
 *
 * @param {string} src
 * @param {Object} [options] - any imageSlide option; `openFromSegment` is implied
 * @returns {Object} stopping slide descriptor
 */
export function refuge(src, options = {}) {
  return imageSlide(src, {
    kind: 'refuge',
    title: 'Refuge',
    buttonText: 'Begin lesson',
    openFromSegment: true,
    segmentTitle: 'Refuge',
    segmentNote: 'Take refuge before the teaching begins',
    ...options
  });
}

/**
 * Dedication slide, shown near the end of the teaching. Place it at the same
 * timestamp as the closing slide: slide priority puts the dedication after the
 * final takeaways and before "Thanks for watching".
 *
 * @param {string} src
 * @param {Object} [options] - `at` is required in practice
 * @returns {Object} stopping slide descriptor
 */
export function dedication(src, options = {}) {
  return imageSlide(src, {
    kind: 'dedication',
    title: 'Dedication',
    buttonText: 'Continue lesson',
    ...options
  });
}

export const makeImageSlide = imageSlide;

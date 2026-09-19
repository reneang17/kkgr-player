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
 *   @param {boolean} [options.atStart]    - show once when playback first starts,
 *                                           instead of at a timestamp
 *   @param {boolean} [options.once]       - never re-arm on rewind
 *                                           (defaults to true for atStart slides)
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
  const atStart = options.atStart === true;

  return {
    kind: options.kind || 'image',
    at: options.at || '0:00',
    atStart,
    // A slide shown before playback begins must not re-fire when the viewer
    // continues, otherwise resuming re-triggers it and the lesson never starts.
    once: options.once !== undefined ? options.once : atStart,
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
 * Refuge slide, shown once when the viewer first starts the video — before any
 * of the teaching plays. Clicking play opens it and pauses; the lesson begins
 * when the viewer continues.
 *
 * @param {string} src
 * @param {Object} [options] - any imageSlide option; `atStart` is implied
 * @returns {Object} stopping slide descriptor
 */
export function refuge(src, options = {}) {
  return imageSlide(src, {
    kind: 'refuge',
    title: 'Refuge',
    buttonText: 'Begin lesson',
    atStart: true,
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

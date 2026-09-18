/**
 * slide-utils/generic.js
 * Lower-level building blocks used when none of the named archetypes fit:
 * a plain stopping slide, a timed side panel, and a chapter marker.
 */

import { DEFAULT_WPM, calculateReadingDuration } from './reading-time.js';

/**
 * A generic full-frame stopping slide. Prefer comingUp() / takeaways() /
 * finalSlide() — this exists for archetypes the template does not yet name.
 *
 * @param {string} at - timestamp
 * @param {string} title
 * @param {Array<string>} [bullets]
 * @param {Object} [options] - merged into the descriptor; `kind` and `bg` are common
 * @returns {Object} stopping slide descriptor
 */
export function stoppingSlide(at, title, bullets = [], options = {}) {
  const wpm = typeof options.wpm === 'number' ? options.wpm : DEFAULT_WPM;

  return {
    at,
    kind: options.kind || 'overview',
    title,
    bullets,
    duration: typeof options.duration === 'number'
      ? options.duration
      : calculateReadingDuration(title, bullets, wpm, 8),
    wpm,
    bg: options.bg || 'slides/slide-1.png',
    ...options
  };
}

/**
 * A side panel shown over the left of the frame while the video keeps playing.
 *
 * @param {string} at
 * @param {string} until
 * @param {string} title
 * @param {Array<string>} [bullets]
 * @param {Object} [options]
 * @returns {Object} timed panel descriptor
 */
export function timedPanel(at, until, title, bullets = [], options = {}) {
  const wpm = typeof options.wpm === 'number' ? options.wpm : DEFAULT_WPM;

  return {
    at,
    until,
    kind: options.kind || 'takehome',
    title,
    bullets,
    duration: typeof options.duration === 'number'
      ? options.duration
      : calculateReadingDuration(title, bullets, wpm, 8),
    wpm,
    ...options
  };
}

/**
 * A chapter marker for the segments list and chapters drawer.
 * Announcements become segments automatically, so use this only for chapters
 * that have no announcement of their own.
 *
 * @param {string} at
 * @param {string} title
 * @param {string} [note]
 * @returns {Object} segment descriptor
 */
export function segment(at, title, note = '') {
  return { at, title, note };
}

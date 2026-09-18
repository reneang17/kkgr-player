/**
 * slide-utils/reading-time.js
 * Shared reading-time estimation used by every slide factory.
 *
 * A stopping slide stays up until the viewer continues, but non-pausing overlays
 * (announcements, timed panels) need a duration. Rather than hand-tuning a number
 * per slide, the factories estimate how long the text takes to read.
 */

/** Words per minute assumed for on-screen reading. */
export const DEFAULT_WPM = 130;

export function countWords(str) {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimates a comfortable on-screen duration for a title plus its bullets.
 *
 * @param {string} title
 * @param {Array<string>|string} bullets
 * @param {number} [wpm=DEFAULT_WPM]
 * @param {number} [minSeconds=8] - floor, so very short slides still register
 * @returns {number} seconds
 */
export function calculateReadingDuration(title, bullets, wpm = DEFAULT_WPM, minSeconds = 8) {
  let words = countWords(title);
  if (Array.isArray(bullets)) {
    bullets.forEach((b) => { words += countWords(b); });
  } else if (typeof bullets === 'string') {
    words += countWords(bullets);
  }
  const seconds = Math.ceil((words / wpm) * 60);
  return Math.max(minSeconds, seconds);
}

/**
 * Normalises the several call shapes the bullet-slide factories accept:
 *   factory(bullets, config)
 *   factory(title, bullets, config)
 *   factory({ title, bullets, ... })
 *
 * @param {Array<string>|string|Object} bullets
 * @param {Object|Array<string>} options
 * @param {Object} extraOptions
 * @param {string} defaultTitle
 * @returns {{title: string, bullets: Array<string>, config: Object}}
 */
export function normalizeSlideArgs(bullets, options, extraOptions, defaultTitle) {
  let title = defaultTitle;
  let bulletList = [];
  let config = {};

  if (typeof bullets === 'string') {
    title = bullets;
    bulletList = Array.isArray(options) ? options : [];
    config = extraOptions || {};
  } else if (Array.isArray(bullets)) {
    bulletList = bullets;
    config = options || {};
    if (config.title) title = config.title;
  } else if (typeof bullets === 'object' && bullets !== null) {
    config = bullets;
    title = config.title || defaultTitle;
    bulletList = config.bullets || [];
  }

  return { title, bullets: bulletList, config };
}

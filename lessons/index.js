/**
 * lessons/index.js
 * Lesson registry — the single place that knows which lessons exist.
 *
 * To add a video:
 *   1. Create lessons/<your-lesson-id>.js exporting a `lesson` descriptor.
 *   2. Import it below and add one line to LESSONS.
 * Nothing in the engine changes. See docs/AUTHORING-LESSONS.md.
 *
 * ---------------------------------------------------------------------------
 * Why static imports rather than dynamic import()
 *
 * Dynamic import would code-split each lesson so a site only downloads the one
 * being watched. It also makes lookup asynchronous, which would force top-level
 * await in player.js — and that is not available in the build target (es2020),
 * nor in Safari before 15.
 *
 * A lesson is a few kilobytes of text, so bundling them all costs very little at
 * this scale. Revisit when either becomes true:
 *   - the catalogue grows to dozens of lessons, or
 *   - player.js gains the async mount API described in docs/EMBEDDING.md,
 *     which makes an asynchronous lookup natural.
 * At that point swap the entries below for `() => import('./<id>.js')` and make
 * loadLesson() async.
 * ---------------------------------------------------------------------------
 */

import { lesson as jewelOrnament01 } from './jewel-ornament-01.js';
import { lesson as jewelOrnament02 } from './jewel-ornament-02.js';

/**
 * id -> lesson descriptor. The id is what appears in the `?lesson=` query
 * parameter, and must match the descriptor's own `id`.
 *
 * Insertion order is the viewing order: the landing page lists lessons in the
 * order they appear here, so add each new teaching after the one it follows.
 * @type {Record<string, Object>}
 */
export const LESSONS = {
  'jewel-ornament-01': jewelOrnament01,
  'jewel-ornament-02': jewelOrnament02
};

/** Used when no `?lesson=` is given. */
export const DEFAULT_LESSON_ID = 'jewel-ornament-01';

/**
 * The player page, relative to the site root. Kept here so the landing page and
 * any host site build lesson links the same way instead of each spelling the URL.
 */
export const PLAYER_PAGE = 'watch.html';

/**
 * @param {string} id - a registered lesson id
 * @returns {string} relative URL that opens that lesson in the player
 */
export function lessonUrl(id) {
  return `${PLAYER_PAGE}?lesson=${encodeURIComponent(id)}`;
}

/** @returns {string[]} every registered lesson id */
export function listLessonIds() {
  return Object.keys(LESSONS);
}

/**
 * Reads the requested lesson id from the page URL.
 * Falls back to DEFAULT_LESSON_ID when absent or unknown.
 *
 * @param {string} [search=window.location.search]
 * @returns {string}
 */
export function resolveLessonId(search) {
  const query = typeof search === 'string'
    ? search
    : (typeof window !== 'undefined' ? window.location.search : '');
  const requested = new URLSearchParams(query || '').get('lesson');

  if (requested && Object.prototype.hasOwnProperty.call(LESSONS, requested)) {
    return requested;
  }
  if (requested) {
    console.warn(
      `[kkgr-player] Unknown lesson "${requested}". ` +
      `Known lessons: ${listLessonIds().join(', ')}. Falling back to "${DEFAULT_LESSON_ID}".`
    );
  }
  return DEFAULT_LESSON_ID;
}

/**
 * Looks up one lesson by id.
 *
 * @param {string} [id] - defaults to the id resolved from the URL
 * @returns {Object} the lesson descriptor
 */
export function loadLesson(id) {
  const lessonId = id || resolveLessonId();
  const lesson = LESSONS[lessonId];
  if (!lesson) {
    throw new Error(
      `[kkgr-player] No lesson registered under "${lessonId}". ` +
      `Known lessons: ${listLessonIds().join(', ')}.`
    );
  }
  return lesson;
}

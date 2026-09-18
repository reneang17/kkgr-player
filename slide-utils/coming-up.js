/**
 * slide-utils/coming-up.js
 * Utility for creating "Coming up" keypoints stopping slides.
 */

(function (global) {
  'use strict';

  const DEFAULT_WPM = 130;

  function countWords(str) {
    if (!str || typeof str !== 'string') return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  function calculateReadingDuration(title, bullets, wpm = DEFAULT_WPM, minSeconds = 8) {
    let words = countWords(title);
    if (Array.isArray(bullets)) {
      bullets.forEach(b => { words += countWords(b); });
    } else if (typeof bullets === 'string') {
      words += countWords(bullets);
    }
    const seconds = Math.ceil((words / wpm) * 60);
    return Math.max(minSeconds, seconds);
  }

  /**
   * Creates a "Coming up" keypoints stopping slide configuration.
   * Pauses the video and presents bullets in Crimson Pro over the blue background
   * with duration determined by word count at 130 WPM (or until user clicks "Continue lesson").
   *
   * @param {Array<string>|string|Object} bullets - Array of bullet points, or title if passing (title, bullets), or config object
   * @param {Object|Array<string>} [options] - Configuration options or bullets array
   * @param {Object} [extraOptions] - Options when called as comingUp(title, bullets, options)
   * @returns {Object} Coming up slide configuration object
   */
  function comingUp(bullets, options = {}, extraOptions = {}) {
    let title = "Coming up";
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
      title = config.title || "Coming up";
      bulletList = config.bullets || [];
    }

    const atTime = config.at || "00:03:05.000";
    const wpm = typeof config.wpm === 'number' ? config.wpm : DEFAULT_WPM;
    const duration = typeof config.duration === 'number'
      ? config.duration
      : calculateReadingDuration(title, bulletList, wpm, 8);

    return {
      kind: "coming-up",
      at: atTime,
      title: title,
      bullets: bulletList,
      duration: duration,
      wpm: wpm,
      bg: config.bg || "slides/coming-up-bg.png",
      font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
      buttonText: config.buttonText || "Continue lesson",
      titleSize: config.titleSize || null,   // null = let the layout model fit it
      bulletSize: config.bulletSize || null, // null = let the layout model fit it
      revealAll: config.revealAll !== undefined ? config.revealAll : true,
      pause: true,
      align: config.align || "center"
    };
  }

  const makeComingUp = comingUp;

  // Expose globally
  global.comingUp = comingUp;
  global.makeComingUp = makeComingUp;

  // CommonJS / ES module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { comingUp, makeComingUp };
  }
})(typeof window !== 'undefined' ? window : globalThis);

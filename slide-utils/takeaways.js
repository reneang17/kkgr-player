/**
 * slide-utils/takeaways.js
 * Utility for creating "Some takeaways" keypoints stopping slides with a translucent box.
 */

(function (global) {
  'use strict';

  const DEFAULT_WPM = 180;

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
   * Creates a "Some takeaways" keypoints stopping slide configuration.
   * Pauses the video and displays bullet points inside a translucent (#609195 at 50%) container
   * over the landscape background for duration determined by reading speed (180 wpm) or until "Continue lesson" is clicked.
   *
   * @param {Array<string>|string|Object} bullets - Array of bullet points, or title if passing (title, bullets), or config object
   * @param {Object|Array<string>} [options] - Configuration options or bullets array
   * @param {Object} [extraOptions] - Options when called as takeaways(title, bullets, options)
   * @returns {Object} Takeaways slide configuration object
   */
  function takeaways(bullets, options = {}, extraOptions = {}) {
    let title = "Some takeaways";
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
      title = config.title || "Some takeaways";
      bulletList = config.bullets || [];
    }

    const atTime = config.at || "00:18:02.333";
    const wpm = typeof config.wpm === 'number' ? config.wpm : DEFAULT_WPM;
    const duration = typeof config.duration === 'number'
      ? config.duration
      : calculateReadingDuration(title, bulletList, wpm, 8);

    return {
      kind: "takeaways",
      at: atTime,
      title: title,
      bullets: bulletList,
      duration: duration,
      wpm: wpm,
      bg: config.bg || "slides/takeaways-bg.png",
      font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
      boxBg: config.boxBg || "rgba(96, 145, 149, 0.50)",
      boxPadding: config.boxPadding || null,
      boxMaxWidth: config.boxMaxWidth || null,
      buttonText: config.buttonText || "Continue lesson",
      titleSize: config.titleSize || "clamp(1.5rem, 5.2cqw, 3.1rem)",
      bulletSize: config.bulletSize || "clamp(0.95rem, 2.6cqw, 1.55rem)",
      density: config.density || null,
      revealAll: config.revealAll !== undefined ? config.revealAll : true,
      pause: true,
      align: "center"
    };
  }

  const someTakeaways = takeaways;
  const makeTakeaways = takeaways;

  // Expose globally
  global.takeaways = takeaways;
  global.someTakeaways = someTakeaways;
  global.makeTakeaways = makeTakeaways;

  // CommonJS / ES module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { takeaways, someTakeaways, makeTakeaways };
  }
})(typeof window !== 'undefined' ? window : globalThis);

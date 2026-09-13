/**
 * slide-utils/coming-up.js
 * Utility for creating "Coming up" keypoints stopping slides.
 */

(function (global) {
  'use strict';

  /**
   * Creates a "Coming up" keypoints stopping slide configuration.
   * Pauses the video and presents bullets in Crimson Pro over the blue background
   * for 24 seconds (configurable) or until the user clicks "Continue lesson".
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

    const atTime = config.at || "00:03:05.433";
    const duration = typeof config.duration === 'number' ? config.duration : 24;

    return {
      kind: "coming-up",
      at: atTime,
      title: title,
      bullets: bulletList,
      duration: duration,
      bg: config.bg || "slides/coming-up-bg.png",
      font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
      buttonText: config.buttonText || "Continue lesson",
      titleSize: config.titleSize || "clamp(1.4rem, 4.8cqw, 2.75rem)",
      bulletSize: config.bulletSize || "clamp(0.95rem, 2.6cqw, 1.55rem)",
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

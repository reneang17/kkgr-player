/**
 * slide-utils/final-slide.js
 * Utility for creating final/closing stopping slides (e.g. "Thanks for watching!").
 */

(function (global) {
  'use strict';

  /**
   * Creates a final closing stopping slide configuration.
   * Pauses the video and displays a centered closing title over the Coming Up background.
   *
   * @param {string|Object} [titleOrConfig="Thanks for watching!"] - Slide title or config object
   * @param {Object} [options={}] - Configuration options
   * @returns {Object} Final slide configuration object
   */
  function finalSlide(titleOrConfig = "Thanks for watching!", options = {}) {
    let title = "Thanks for watching!";
    let config = {};

    if (typeof titleOrConfig === 'string') {
      title = titleOrConfig;
      config = options || {};
    } else if (typeof titleOrConfig === 'object' && titleOrConfig !== null) {
      config = titleOrConfig;
      title = config.title || "Thanks for watching!";
    }

    const atTime = config.at || "00:53:32.933";
    const duration = typeof config.duration === 'number' ? config.duration : 12;

    return {
      kind: "final",
      at: atTime,
      title: title,
      bullets: config.bullets || [],
      duration: duration,
      bg: config.bg || "slides/coming-up-bg.png",
      font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
      buttonText: config.buttonText || "Finish lesson",
      titleSize: config.titleSize || null,   // null = let the layout model fit it
      align: "center",
      pause: true,
      revealAll: true,
      ...config
    };
  }

  const makeFinalSlide = finalSlide;
  const closingSlide = finalSlide;
  const thanksSlide = finalSlide;

  // Expose globally
  global.finalSlide = finalSlide;
  global.makeFinalSlide = makeFinalSlide;
  global.closingSlide = closingSlide;
  global.thanksSlide = thanksSlide;

  // CommonJS / ES module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { finalSlide, makeFinalSlide, closingSlide, thanksSlide };
  }
})(typeof window !== 'undefined' ? window : globalThis);

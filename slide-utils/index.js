/**
 * slide-utils/index.js
 * Central hub for slide factory utilities (announcements, stopping slides, timed panels, segments).
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
   * Creates a lower-third Announcement banner configuration.
   */
  function announcement(redText, blackText, options = {}) {
    const atTime = options.at || "0:29";
    const wpm = typeof options.wpm === 'number' ? options.wpm : DEFAULT_WPM;
    const duration = typeof options.duration === 'number'
      ? options.duration
      : calculateReadingDuration(redText, blackText, wpm, 6);

    return {
      kind: "announcement",
      at: atTime,
      until: options.until || null,
      duration: duration,
      wpm: wpm,
      title: redText,
      primaryText: redText,
      secondaryText: blackText,
      pause: options.pause || false,
      redSize: options.redSize || "clamp(0.95rem, 2.85cqw, 1.6rem)",
      blackSize: options.blackSize || "clamp(0.75rem, 2.05cqw, 1.15rem)",
      redColor: options.redColor || "#881434",
      blackColor: options.blackColor || "#1a1a1a",
      font: options.font || "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
    };
  }

  /**
   * Creates a full-frame Stopping Slide configuration.
   * Pauses the video and reveals bullet points interactively.
   */
  function stoppingSlide(at, title, bullets = [], options = {}) {
    const wpm = typeof options.wpm === 'number' ? options.wpm : DEFAULT_WPM;
    const duration = typeof options.duration === 'number'
      ? options.duration
      : calculateReadingDuration(title, bullets, wpm, 8);

    return {
      at,
      kind: options.kind || "overview",
      title,
      bullets,
      duration,
      wpm,
      bg: options.bg || "slides/slide-1.png",
      ...options
    };
  }

  /**
   * Creates a Timed Side Panel configuration.
   * Shows a left-side panel while video continues playing.
   */
  function timedPanel(at, until, title, bullets = [], options = {}) {
    const wpm = typeof options.wpm === 'number' ? options.wpm : DEFAULT_WPM;
    const duration = typeof options.duration === 'number'
      ? options.duration
      : calculateReadingDuration(title, bullets, wpm, 8);

    return {
      at,
      until,
      kind: options.kind || "takehome",
      title,
      bullets,
      duration,
      wpm,
      ...options
    };
  }

  /**
   * Creates a Chapter / Video Segment marker configuration.
   */
  function segment(at, title, note = "") {
    return {
      at,
      title,
      note
    };
  }

  /**
   * Creates a "Coming up" keypoints stopping slide configuration.
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
      titleSize: config.titleSize || "clamp(1.4rem, 4.8cqw, 2.75rem)",
      bulletSize: config.bulletSize || "clamp(0.95rem, 2.6cqw, 1.55rem)",
      density: config.density || null,
      revealAll: config.revealAll !== undefined ? config.revealAll : true,
      pause: true,
      align: config.align || "center"
    };
  }

  /**
   * Creates a "Some takeaways" keypoints stopping slide configuration.
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

  /**
   * Creates a final closing stopping slide configuration.
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

    const atTime = config.at || "00:53:47.033";
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
      titleSize: config.titleSize || "clamp(2rem, 6.5cqw, 4.2rem)",
      align: "center",
      pause: true,
      revealAll: true,
      ...config
    };
  }

  // Aliases
  const makeAnnouncement = announcement;
  const makeComingUp = comingUp;
  const someTakeaways = takeaways;
  const makeTakeaways = takeaways;
  const makeFinalSlide = finalSlide;
  const closingSlide = finalSlide;
  const thanksSlide = finalSlide;

  // Expose globally
  global.announcement = announcement;
  global.makeAnnouncement = makeAnnouncement;
  global.comingUp = comingUp;
  global.makeComingUp = makeComingUp;
  global.takeaways = takeaways;
  global.someTakeaways = someTakeaways;
  global.makeTakeaways = makeTakeaways;
  global.finalSlide = finalSlide;
  global.makeFinalSlide = makeFinalSlide;
  global.closingSlide = closingSlide;
  global.thanksSlide = thanksSlide;
  global.stoppingSlide = stoppingSlide;
  global.timedPanel = timedPanel;
  global.segment = segment;

  // CommonJS / ES module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      announcement,
      makeAnnouncement,
      comingUp,
      makeComingUp,
      takeaways,
      someTakeaways,
      makeTakeaways,
      finalSlide,
      makeFinalSlide,
      closingSlide,
      thanksSlide,
      stoppingSlide,
      timedPanel,
      segment
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);

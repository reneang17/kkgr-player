/**
 * slide-utils/index.js
 * Central hub for slide factory utilities (announcements, stopping slides, timed panels, segments).
 */

(function (global) {
  'use strict';

  /**
   * Creates a lower-third Announcement banner configuration.
   */
  function announcement(redText, blackText, options = {}) {
    const atTime = options.at || "0:29";
    const duration = typeof options.duration === 'number' ? options.duration : 8;

    return {
      kind: "announcement",
      at: atTime,
      until: options.until || null,
      duration: duration,
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
    return {
      at,
      kind: options.kind || "overview",
      title,
      bullets,
      bg: options.bg || "slides/slide-1.png",
      ...options
    };
  }

  /**
   * Creates a Timed Side Panel configuration.
   * Shows a left-side panel while video continues playing.
   */
  function timedPanel(at, until, title, bullets = [], options = {}) {
    return {
      at,
      until,
      kind: options.kind || "takehome",
      title,
      bullets,
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

    const atTime = config.at || "00:03:17.433";
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

  // Aliases
  const makeAnnouncement = announcement;
  const makeComingUp = comingUp;

  // Expose globally
  global.announcement = announcement;
  global.makeAnnouncement = makeAnnouncement;
  global.comingUp = comingUp;
  global.makeComingUp = makeComingUp;
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
      stoppingSlide,
      timedPanel,
      segment
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);

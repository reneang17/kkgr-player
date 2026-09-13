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

  // Aliases
  const makeAnnouncement = announcement;

  // Expose globally
  global.announcement = announcement;
  global.makeAnnouncement = makeAnnouncement;
  global.stoppingSlide = stoppingSlide;
  global.timedPanel = timedPanel;
  global.segment = segment;

  // CommonJS / ES module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      announcement,
      makeAnnouncement,
      stoppingSlide,
      timedPanel,
      segment
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);

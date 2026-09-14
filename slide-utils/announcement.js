/**
 * slide-utils/announcement.js
 * Utility for creating lower-third video announcement overlays.
 */

(function (global) {
  'use strict';

  const DEFAULT_WPM = 180;

  function countWords(str) {
    if (!str || typeof str !== 'string') return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  function calculateReadingDuration(primary, secondary, wpm = DEFAULT_WPM, minSeconds = 6) {
    let words = countWords(primary) + countWords(secondary);
    const seconds = Math.ceil((words / wpm) * 60);
    return Math.max(minSeconds, seconds);
  }

  /**
   * Creates a lower-third Announcement banner configuration.
   * Displays a semi-transparent lower-third bar with two-line text in Gill Sans.
   *
   * @param {string} redText - Main heading in red (e.g. "Essence of the Jewel Ornament of Liberation")
   * @param {string} blackText - Subtitle in black (e.g. "Introduction written by Gampopa")
   * @param {Object} [options] - Optional configurations:
   *   @param {string} [options.at="0:29"] - Start timestamp ("m:ss" or "h:mm:ss")
   *   @param {string} [options.until] - End timestamp (optional)
   *   @param {number} [options.duration] - Duration in seconds (defaults to 180 wpm calculation)
   *   @param {string} [options.redSize] - Font size for red text
   *   @param {string} [options.blackSize] - Font size for black text
   *   @param {string} [options.redColor="#881434"] - Color for red text
   *   @param {string} [options.blackColor="#1a1a1a"] - Color for black text
   *   @param {string} [options.font] - Font family (default: Gill Sans with fallbacks)
   *   @param {boolean} [options.pause=false] - Whether to pause video when displayed
   * @returns {Object} Announcement slide configuration object
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

  const makeAnnouncement = announcement;

  // Expose globally
  global.announcement = announcement;
  global.makeAnnouncement = makeAnnouncement;

  // CommonJS / ES module support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { announcement, makeAnnouncement };
  }
})(typeof window !== 'undefined' ? window : globalThis);

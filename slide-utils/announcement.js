/**
 * slide-utils/announcement.js
 * Lower-third banner overlay. Does NOT pause the video.
 */

import { DEFAULT_WPM, calculateReadingDuration } from './reading-time.js';

/**
 * Creates a lower-third announcement banner.
 *
 * @param {string} redText   - Primary heading (burgundy)
 * @param {string} blackText - Secondary label; pass "" to omit
 * @param {Object} [options]
 * @param {string} [options.at="0:29"]  - Start timestamp ("m:ss" or "h:mm:ss[.ms]")
 * @param {string} [options.until]      - Explicit end timestamp
 * @param {number} [options.duration]   - Seconds on screen; defaults to a reading-time estimate
 * @param {number} [options.wpm=130]
 * @param {boolean} [options.pause=false]
 * @param {boolean} [options.segment]   - false to keep it out of the chapters list
 * @returns {Object} announcement slide descriptor
 */
export function announcement(redText, blackText, options = {}) {
  const wpm = typeof options.wpm === 'number' ? options.wpm : DEFAULT_WPM;
  const duration = typeof options.duration === 'number'
    ? options.duration
    : calculateReadingDuration(redText, blackText, wpm, 6);

  return {
    kind: 'announcement',
    at: options.at || '0:29',
    until: options.until || null,
    duration,
    wpm,
    title: redText,
    primaryText: redText,
    secondaryText: blackText,
    pause: options.pause || false,
    redSize: options.redSize || 'clamp(0.95rem, 2.85cqw, 1.6rem)',
    blackSize: options.blackSize || 'clamp(0.75rem, 2.05cqw, 1.15rem)',
    redColor: options.redColor || '#881434',
    blackColor: options.blackColor || '#1a1a1a',
    font: options.font || "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
  };
}

export const makeAnnouncement = announcement;

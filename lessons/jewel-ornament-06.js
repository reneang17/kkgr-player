/**
 * lessons/jewel-ornament-06.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation,
 * Introduction to Part 4: The Method.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { finalSlide, refuge, dedication } from '../slide-utils/index.js';
import { WATER_DROP_ON_THE_LAKE } from './credits.js';

const VIDEO_ID = "n6jUpXZsEH8";
const SLIDE_BG = "slides/slide-1.png";   // optional 1920x1080 background image for stopping slides

// 1. VIDEO SEGMENTS (Chapters / Lecture parts shown in the "Segments" list)
const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" },
  // The closing slides sit just before the video's last frame, as in the
  // earlier lessons, so they trigger before playback ends.
  { at: "00:58:17.333", title: "End of the Video", note: "Conclusion & dedication" }
];

// 2. SLIDES & OVERLAYS
const SLIDES = [
  // Refuge, offered as the first entry in the segments list, above "Start of the
  // Video". Shown only if the viewer chooses it; pressing play goes straight
  // into the teaching.
  refuge("slides/refuge.webp", { audio: "audio/refuge.mp3" }),

  // Final closing stopping slide at 00:58:17.333, just before the video ends.
  finalSlide("Thank you everybody", {
    at: "00:58:17.333"
  }),

  // Dedication at 00:58:17.333, closing the session (the video ends here).
  // Slide priority shows it after the thanks.
  dedication("slides/dedication.webp", {
    at: "00:58:17.333",
    audio: "audio/dedication.mp3"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-06',
  name: 'Intro to Part 4: The Method',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES,

  // Third-party works shown in this teaching, listed under the segments.
  credits: [WATER_DROP_ON_THE_LAKE]
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

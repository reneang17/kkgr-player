/**
 * lessons/jewel-ornament-06.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation,
 * Introduction to Part 4: The Method.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, finalSlide, refuge, dedication } from '../slide-utils/index.js';
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

  // "Coming up" keypoints stopping slide at 00:01:04.833. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  comingUp([
    "Please first relax physically and mentally. Then, just please feel we are so fortunate to get this precious opportunity to touch the wisdom of the Buddha.",
    "The wisdom of the Buddha means special insight and compassion — that is the principal method of how to relax mentally, inner peace.",
    "Now, we just reflect that everybody desires peace and happiness, and everybody desires to be free from suffering; this is the reality nature.",
    "On the basis of this, we cultivate our altruistic thought to free ourselves and all sentient beings from the confusion, and to heal our mind and the minds of all sentient beings.",
    "Today I will touch on the subject of the Buddha’s teaching. Just appreciate and rejoice."
  ], {
    at: "00:01:04.833",
    title: "Coming up: Relax, reflect and rejoice",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:01:04.833. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "Relaxing, reflecting and rejoicing",
    "Cultivate the thought to free yourself and others",
    { at: "00:01:04.833" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:04:49.533
  takeaways([
    "With this, please take a deep breath: inhale fully, and exhale all our tension, physically and mentally.",
    "Inhale all the Buddha’s wisdom and compassion into us, and we meditate; it heals our body and mind. Exhale all our confusion.",
    "Once more, please inhale fully all the wisdom and compassion of the Buddha, and exhale all our confusion and suffering.",
    "Then the mind just relaxes like the nature of space — an unconfined state of the mind, total freedom, not occupied by confusion, the cause of suffering."
  ], {
    at: "00:04:49.533",
    title: "Takeaways: Using breath fully",
    buttonText: "Continue lesson"
  }),

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

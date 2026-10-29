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

  // "Coming up" keypoints stopping slide at 00:01:03.700. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  comingUp([
    "Please first relax physically and mentally. Then, just please feel we are so fortunate to get this precious opportunity to touch the wisdom of the Buddha.",
    "The wisdom of the Buddha means special insight and compassion — that is the principal method of how to relax mentally, inner peace.",
    "Now, we just reflect that everybody desires peace and happiness, and everybody desires to be free from suffering; this is the reality nature.",
    "On the basis of this, we cultivate our altruistic thought to free ourselves and all sentient beings from the confusion, and to heal our mind and the minds of all sentient beings.",
    "Today I will touch on the subject of the Buddha’s teaching. Just appreciate and rejoice."
  ], {
    at: "00:01:03.700",
    title: "Coming up: Relax, reflect and rejoice",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:01:03.700. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "Relaxing, reflecting and rejoicing",
    "Cultivate the thought to free yourself and others",
    { at: "00:01:03.700" }
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

  // "Coming up" keypoints stopping slide at 00:04:49.533. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "These next few months we are studying the Jewel Ornament of Liberation, a book compiled by Dharma Lord Gampopa, an enlightened master.",
    "This book that Gampopa wrote has served so greatly in benefiting sentient beings through many centuries; beginners and highly realized ones, great scholars, they all appreciate this special book.",
    "Everyone uses this book as a guideline; they follow the path step by step, so that everyone can be free from the vicious cycle of samsara.",
    "This book has six topics: the primary cause; the working basis; the spiritual master; the method, the instruction of the spiritual master; the result, Buddhahood; and the activities of the Buddha."
  ], {
    at: "00:04:49.533",
    title: "Coming up: A special book in six topics",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:04:49.533. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Reviewing what we have touched on so far",
    "The seed, the working basis and the spiritual master",
    { at: "00:04:49.533" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:11:00.967
  takeaways([
    "So far we have touched on the primary cause: the innate goodness, a seed, the potential seed for enlightenment, to see the effulgent nature of the mind.",
    "As you see in samsara, everywhere, all over the world, people and animals are suffering so much — those who are rich, those who are poor, those with a high status and those without, young or old. Everyone is going through a vicious cycle in their life due to the lack of the wisdom to see the effulgent nature of the mind.",
    "Our mind is occupied by this ignorance, bewilderment; we are in the jungle of the confusion. So this book first starts with how much potential, the seed, we have to achieve total peace and happiness. Dharmakaya is pervaded to all the sentient beings. So first we appreciate this.",
    "To reveal the total nature of the effulgence, the enlightenment, we need a working basis, the precious human life — physically the leisures and endowments, and mentally trusting, longing, and clear faith. Thus, well equipped, the working basis has all the ability to purify all our obscurations.",
    "But that much is not enough: we need the spiritual master who has all these excellent qualities for enlightenment to show to others — the ability, the skill, the altruistic mind, the bodhicitta."
  ], {
    at: "00:11:00.967",
    title: "Takeaways: What we have touched on so far",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:11:00.967. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Now, from today, we touch on the instruction, the method — how we can study and practice these precious teachings.",
    "We should make sense for ourselves why do we need to study and practice the Dharma, not just as a religion, but as a cause, as a condition, for how we can be free from the vicious cycle of this confusion, the suffering.",
    "Everybody in the world — politically, economically, technologically — keeps their life so busy because they want to achieve some peace and happiness, to be free from suffering, to secure their life for the better.",
    "Now, the Dharma teaching that the Buddha taught is not just to secure us physically, but mentally. It is a very sophisticated technology that the Buddha has developed, with which sentient beings are well equipped.",
    "But in the modern world there is no clear instruction for this. Even in this modern 21st century, science and technology are highly appreciated, but all are designed for the outer phenomena, not the inner phenomena; here we are touching the inner phenomena."
  ], {
    at: "00:11:00.967",
    title: "Coming up: A very sophisticated technology",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:11:00.967. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "The method, instructions of the spiritual master",
    "Why I need to study and practice the Dharma",
    { at: "00:11:00.967" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:15:38.600
  takeaways([
    "Now I read this introduction to part four, which is the method, the instructions of the spiritual master; it is short but very condensed, and it makes such a very important point.",
    "It is very important we read this, then I will try to explain whatever I can, and then you yourself should, in your mind, see that. We should have such a convinced wisdom, the reason why we need to follow these teachings — not as a religious training, but as a universal requirement on how to be free from suffering, on how to achieve total peace and happiness.",
    "This content is very important for modern education. All these ancient wisdoms should be supported by modern education; these Dharma teachings are totally agreeable with modern education — it’s not an old system."
  ], {
    at: "00:15:38.600",
    title: "Takeaways: A universal requirement to be free from suffering",
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

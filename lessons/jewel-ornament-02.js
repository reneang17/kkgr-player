/**
 * lessons/jewel-ornament-02.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation, Introduction Part 2.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 *
 * Work in progress: so far only the refuge and the start of the teaching.
 * Keypoint slides, announcements and the dedication are added as the recording
 * is worked through.
 */

import { announcement, comingUp, takeaways, refuge } from '../slide-utils/index.js';

const VIDEO_ID = "pSF8WODjf94";
const SLIDE_BG = "slides/slide-1.png";   // optional 1920x1080 background image for stopping slides

// 1. VIDEO SEGMENTS (Chapters / Lecture parts shown in the "Segments" list)
const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" }
];

// 2. SLIDES & OVERLAYS
const SLIDES = [
  // Refuge, offered as the first entry in the segments list, above "Start of the
  // Video". Shown only if the viewer chooses it; pressing play goes straight
  // into the teaching.
  refuge("slides/refuge.webp", { audio: "audio/refuge.mp3" }),

  // "Coming up" keypoints stopping slide at 00:00:28.233. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  comingUp([
    "If you think that perhaps this confusion will disappear by itself, understand that samsara is known to be endless — there is no way for this confusion to disappear by itself. We have to make it happen; without our effort, without study and practice of Dharma, we cannot see the confusion disappear by itself.",
    "The focus of Dharma teaching is to free from samsara, to achieve complete enlightenment — not just for this life's enjoyment and comfort. This life, whether comfortable or not, will go away, but what matters is to cross the boundary of samsara. That is the purpose of Dharma.",
    "Please understand that samsara is confusion. Samsara is not something that exists outside but within the mind. As long as there is confusion we are in samsara. As long as we have grasping, grasping to the self, grasping to our whole being, so much attachment, aversion and affliction, we are in samsara."
  ], {
    at: "00:00:28.233",
    title: "Understanding more about confusion, Coming up",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:00:28.233
  announcement(
    "If You Think Confusion Will Disappear by Itself",
    "Understanding more about confusion",
    { at: "00:00:28.233" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:06:47.300
  takeaways([
    "Please understand how much suffering there is in samsara. See how much suffering of suffering there is in the world. For example, how much suffering we went through in the pandemic. And it is not just one country or a few people — rich or poor, famous or not famous, young or old — we all go through this. And now there is a war: how many people are suffering unbearably.",
    "It is the twenty-first century — how much have technologies and science developed, yet suffering continues.",
    "With dharma teachings now we have the opportunity to study, practice, and purify our mind — to develop such understanding, loving-kindness, compassion, bodhicitta.",
    "Through that, we understand everything is interdependent, interconnected — it is just a manifestation, a manifestation of causes and conditions.",
    "So we can see that nothing stands independently; that demonstrates that everything is naturally emptiness. Everything is like a rainbow, a mirage."
  ], {
    at: "00:06:47.300",
    title: "Understanding how much suffering is there, Takeaways",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:06:47.300. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "Sometimes we think life is meaningless — but when you study and practice this, your life is full of meaning: a great joy that comes from nowhere, yet it is there, and that joy is fearlessness.",
    "Great bodhisattvas go through such great hardship, sometimes even going to the hell realm; because of great compassion and great wisdom they have no fear — fearlessness not out of arrogance, but out of great wisdom and compassion.",
    "I myself am not a great practitioner but I see the precious nature of the Dharma and I like to share it, to give people the opportunity to study and practice these teachings and get some benefit in the world."
  ], {
    at: "00:06:47.300",
    title: "Coming up, A life in the dharma",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:06:47.300
  announcement(
    "A Life Full of Meaning",
    "Developing loving kindness, compassion and bodhicitta",
    { at: "00:06:47.300" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:11:20.467
  takeaways([
    "When you get this message, take a deep breath and appreciate and rejoice yourself. We have this precious human life; so precious that we cannot get it from any other place. When we have it, we have to take full advantage — not a little bit here and there, but fully. We can do that.",
    "From beginningless time to the endless, we have to endure samsara with all its suffering — so without flinching, just progress in our practice of the Dharma, with joy, with appreciation. The feeling of appreciation is very important: appreciate yourself, feel joy in Dharma practice.",
    "When a negative thought comes, immediately remember to practice Dharma and purify that — then you feel: Dharma is the real medicine to heal the mind.",
    "Having a good lunch will not heal the mind; having a good place to live does not heal the mind — but the mind can be healed by bodhicitta, by the Dharma."
  ], {
    at: "00:11:20.467",
    title: "Appreciate yourself & with joy progress your practice, Takeaways",
    buttonText: "Continue lesson"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-02',
  name: 'Introduction Part 2',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

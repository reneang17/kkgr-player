/**
 * lessons/jewel-ornament-01.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation, Introduction Part 1.
 *
 * This file is PURE DATA. It contains no DOM access, no player calls and no
 * styling: only the video id, the chapter markers and the slide timeline. Every
 * lesson is a file like this one, and adding a video means adding a file here
 * and registering it in lessons/index.js — nothing in the engine changes.
 *
 * See docs/AUTHORING-LESSONS.md for the full authoring guide.
 */

import { announcement, comingUp, takeaways, finalSlide, refuge, dedication } from '../slide-utils/index.js';

const VIDEO_ID = "qg0FA7Ppf0U";
const SLIDE_BG = "slides/slide-1.png";   // optional 1920x1080 background image for stopping slides

// 1. VIDEO SEGMENTS (Chapters / Lecture parts shown in the "Segments" list)
const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" },
  { at: "00:53:32.933", title: "End of the Video", note: "Final takeaways & conclusion" }
];

// 2. SLIDES & OVERLAYS (Interactive stopping slides, timed side panels, announcements)
const SLIDES = [
  // Refuge, offered as the first entry in the segments list, above "Start of the
  // Video". Shown only if the viewer chooses it; pressing play goes straight
  // into the teaching.
  refuge("slides/refuge.webp", { audio: "audio/refuge.mp3" }),

  // Announcement banner at 00:29
  announcement(
    "Essence of the Jewel Ornament of Liberation",
    "Introduction written by Gampopa",
    { at: "0:29" }
  ),

  // "Coming up" keypoints stopping slide at 00:03:05.000
  comingUp([
    "Gampopa's book lays out the whole path to buddahood.",
    "Study and understand — then practice; without practice we can't digest the teachings.",
    "The noble Dharma is not outside us, not hidden — it is within the mind.",
    "The world's wars, famines, climate problems all manifest from our own confusion."
  ], {
    at: "00:03:05.000",
    title: "Coming up: Overview",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:03:05.000
  announcement(
    "Overview",
    "Gampopa's Life & Work",
    { at: "00:03:05.000" }
  ),

  // Announcement banner at 00:09:17.333
  announcement(
    "The Meaning of the Title",
    "The Noble Teachings Like a Wish-fulfilling Gem",
    { at: "00:09:17.333" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:17:48.233
  takeaways([
    "Resolving the problem within the mind — that is what Dharma practice means.",
    "Calm abiding and special insight give us the opportunity to uproot mental confusion.",
    "One who studies, understands and practices is rich, not in wealth, but in wisdom and contentment."
  ], {
    at: "00:17:48.233",
    title: "Takeaways: Overview",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:17:48.233
  comingUp([
    "Homage to the Buddha, who purified all confusion and found unafflicted peace.",
    "Homage to the Dharma, the teaching by which he reached that peace.",
    "Homage to the Sangha, those great practitioners.",
    "Gampopa wrote this book out of his teachers' kindness, for our benefit."
  ], {
    at: "00:17:48.233",
    title: "Coming up: Paying homage",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:17:48.233
  announcement(
    "Paying Homage",
    "To the Three Jewels, and to the lamas who are their foundation.",
    { at: "00:17:48.233" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:25:15.300
  takeaways([
    "Gampopa bows to Manjushri so we may develop the wisdom that cuts ignorance.",
    "Homage is paid to the Three Jewels because in samsara there is no other refuge.",
    "Homage to the lamas who are the foundation of the buddhas and their followers.",
    "Gampopa wrote this book depending on the kindness of Milarepa and Atisha, for our benefit."
  ], {
    at: "00:25:15.300",
    title: "Takeaways: Paying homage",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:25:15.300
  comingUp([
    "All phenomena fall into two: samsara and nirvana — both empty by nature.",
    "Empty means no independent entity: everything is illusory, changing, never staying by itself.",
    "Samsara is a confused mental formation/projection; its defining characteristic is suffering.",
    "For example, we think, \"myself, something independent, exists.\" But when we investigate we cannot find it. Not having realized that, we grasp at a self as real and permanent, we cherish it so much and we suffer because of that.",
    "Nirvana is all confused projections exhausted and dissipated: freedom from all suffering."
  ], {
    at: "00:25:15.300",
    title: "Coming up: Introduction — written by Gampopa",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:25:15.300
  announcement(
    "Introduction — Written by Gampopa",
    "It deals with a very important point: why do we practice Dharma?",
    { at: "00:25:15.300" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:36:14.900
  takeaways([
    "It is very important that we reflect on this first: confusion is what we have to purify.",
    "When we say exhausting our confusion, it means exhausting all our mental afflictions: ignorance, attachment, aversion, pride, jealousy, self-grasping.",
    "Then, after exhaustion, the leftover habits also need to be dissipated, because we are so habituated. Even though we may realize emptiness, there is still a habit of grasping. That needs to be purified too.",
    "The defining characteristic of exhaustion and dissipation of confusion is freedom from all sufferings: suffering no longer exists, there is no cause of suffering.",
    "Our interest is to be free from suffering and to achieve peace and happiness. This is the why we practice."
  ], {
    at: "00:36:14.900",
    title: "Takeaways: Introduction — written by Gampopa",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:36:14.900
  comingUp([
    "Who is it that is confused in samsara? All sentient beings of the three realms — desire, form, and formless — are confused.",
    "On what basis does confusion arise? Confusion arises on the basis of emptiness — not that emptiness is the cause, but that we are confused about emptiness.",
    "For example, we grasp at this body of ours as one whole, complete, independent thing, so attached to it that we do everything just to feed this ego-attachment."
  ], {
    at: "00:36:14.900",
    title: "Coming up: Some clarifications about confusion",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:36:14.900
  announcement(
    "Some Clarifications about Confusion",
    "The basis & cause of confusion.",
    { at: "00:36:14.900" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:42:01.900
  takeaways([
    "What causes confusion to arise? The cause of confusion is great ignorance. Because of ignorance, I hold on to self-grasping, believing that a self exists within me; I cherish it so much and I suffer because of that.",
    "We need to realize there is no independent self — for example that my body is just interdependent, arising from many causes and conditions. When we realize that, we see it as just a manifestation: not so much attachment, and no aversion when negative things happen.",
    "Our study and practice is so important to purify our ignorance."
  ], {
    at: "00:42:01.900",
    title: "Takeaways: Some clarifications about confusion",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:42:01.900
  comingUp([
    "How does this confusion operate? It operates through the activities and experiences of the six realms of migrators.",
    "Because of ignorance we have confusion; through that confusion we create karma, different layers of causes. Because of the different causes and conditions we have created, there arise the six realms in samsara.",
    "For example, sometimes the mind is so heavily negative that the result is the hell realm — not necessarily a hell realm somewhere else; within our own life we sometimes experience something like hell-realm suffering.",
    "Even in the human realm we can have all six of these experiences: hell-realm suffering, hungry-ghost suffering, animal suffering, human birth-and-death suffering, and the suffering of the demigods and gods."
  ], {
    at: "00:42:01.900",
    title: "Coming up: How does confusion operate?",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:42:01.900
  announcement(
    "How Does Confusion Operate?",
    "The complete picture of samsara",
    { at: "00:42:01.900" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:47:22.900
  takeaways([
    "What exemplifies this confusion? Confusion is like sleep and dream. When our mind falls asleep it becomes totally dark and forgets everything — that darkness is like ignorance. Then from that comes the dream.",
    "In the dream we have many different experiences. Likewise, ignorance is a darkness of understanding regarding causality: through that ignorance we create different types of karma, and then, like a dream, we go through different types of suffering in the six realms.",
    "When did this confusion originate? This confusion originated in beginningless samsara — there is no beginning and no end; it is a complete cycle. Like space, like the universe, it has no beginning."
  ], {
    at: "00:47:22.900",
    title: "Takeaways: How does confusion operate?",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:47:22.900
  comingUp([
    "Gampopa says \"What is the error of the confusion? All the experiences in samsara are suffering\". We may say life in samsara is sometimes very joyful — good weather, a good place to live, enjoying with family. Of course we cannot deny that. But it is not permanent.",
    "For example, I am getting old. Everyone I know is getting older, many are getting sick, many are dying. They write to me, and I see very precisely what this means: I understand the pain.",
    "The joy, peace and happiness we have in samsara is called the suffering of change — even joy, happiness, peace, a luxurious life can change; they do not stay as they are.",
    "We are not making samsara something bad. Samsara is beautiful. But we have to understand its reality nature."
  ], {
    at: "00:47:22.900",
    title: "Coming up: The error of confusion",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:47:22.900
  announcement(
    "The Error of Confusion",
    "Brief contemplation",
    { at: "00:47:22.900" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:53:32.933
  takeaways([
    "When does this confusion become transformed into primordial wisdom? When one attains unsurpassable enlightenment — that means buddhahood.",
    "Within Buddhahood, the Dharmakaya. When one actualizes the Dharmakaya, then all these confusions... there is nothing but wisdom.",
    "The nature of confusion is emptiness. When you realize the nature of confusion as emptiness, then primordial wisdom is percieved or achieved.",
    "For this we need to study and practice the Dharma."
  ], {
    at: "00:53:32.933",
    title: "Takeaways: The error of confusion",
    buttonText: "Continue lesson"
  }),

  // Dedication at 00:53:32.933. Shares the timestamp with the closing slide;
  // slide priority shows it after the final takeaways and before the thanks.
  dedication("slides/dedication.webp", {
    at: "00:53:32.933",
    audio: "audio/dedication.mp3"
  }),

  // Final closing stopping slide at 00:53:32.933
  finalSlide("Thank you everybody", {
    at: "00:53:32.933"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-01',
  name: 'Introduction Part 1',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES,

  // Printable copy of the slide bullet points, offered from the control bar.
  handout: {
    file: 'handouts/jewel-ornament-01-points-to-remember.pdf',
    label: 'Some takeaways',
    filename: 'Jewel Ornament of Liberation - Introduction Part 1 - Some takeaways.pdf'
  }
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

/**
 * lessons/jewel-ornament-02.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation, Introduction Part 2.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, refuge, dedication } from '../slide-utils/index.js';

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
    title: "Coming up: Understanding more about confusion",
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
    "Please understand how much suffering there is in samsara. See how much suffering of suffering there is in the world. It is not just a few people — rich or poor, famous or not famous, young or old — we all go through this. Now, for example there is war: how many people are suffering unbearably.",
    "It is the twenty-first century — how much have technologies and science developed, yet suffering continues.",
    "With dharma teachings now we have the opportunity to study, practice, and purify our mind — to develop such understanding, loving-kindness, compassion, bodhicitta.",
    "Through that, we understand everything is interdependent, interconnected — it is just a manifestation, a manifestation of causes and conditions. So we can see that nothing stands independently; that demonstrates that everything is naturally emptiness. Everything is like a rainbow, a mirage."
  ], {
    at: "00:06:47.300",
    title: "Takeaways: Understanding how much suffering is there",
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
    title: "Coming up: A life in the Dharma",
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
    title: "Takeaways: Appreciate yourself & with joy progress your practice",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:11:20.467. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "There is no self-liberation: our confusion, our self-grasping, will not disappear by itself. Look at our own minds — even after many years of Dharma practice, self-grasping is still so fresh, if not more.",
    "Right now our mind is in confinement, as if in a small room — the cocoon of self-grasping. Through the wisdom of emptiness and the wisdom of bodhicitta, we can expand our mind, break through that boundary, and realize the unconfined mind like space — the vastness of bodhicitta, the space of mahamudra."
  ], {
    at: "00:11:20.467",
    title: "Coming up: From today onward",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:11:20.467. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "From today onwards make as much effort as possible",
    "Otherwise our self-grasping will not disappear by itself",
    { at: "00:11:20.467" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:16:36.633. Shares the
  // timestamp with the coming-up and announcement below; slide priority shows
  // this first.
  takeaways([
    "From today onward, make as much effort as possible — there is no suggestion to start next year, or when you get older: as soon as you understand, that's the day you have to start to study and practice Dharma.",
    "Buddhahood is the fully awakened mind — unsurpassable, nothing above it — and it is within our own mind, not outside: it means revealing our total mind itself.",
    "Right now our minds are confined within the cocoon of confusion — we just go around and around, repeating the same thing, even Dharma practitioners. So we have to have wisdom: how to practice Dharma, how to open the heart."
  ], {
    at: "00:16:36.633",
    title: "Takeaways: From today onwards",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:16:36.633. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "Gampopa gives six: the primary cause, the working basis, the contributory cause, the method, the result, and the activities.",
    "Gampopa says all discriminating beings should understand these six, which means all wise ones. We should have discriminative wisdom: what makes samsara? What makes enlightenment? What makes nirvana?",
    "We should first understand these six topics and bring this picture into our heart."
  ], {
    at: "00:16:36.633",
    title: "Coming up: Causes and conditions of enlightenment",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:16:36.633
  announcement(
    "Causes and Conditions of enlightenment",
    "The six topics of the path, starting with Buddha-nature.",
    { at: "00:16:36.633" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:26:48.067
  takeaways([
    "The primary cause is the essence of the Well-Gone One: gone from samsara into the state of complete perfection. All confusion and mental afflictions are purified, and all suffering is reduced.",
    "Well gone, perfectly gone, beautifully gone: the person becomes better and better. For example, when you develop love, compassion, and bodhicitta, that person is so beautiful; everybody admires that person, they appreciate that person.",
    "Once you achieve buddhahood, you never return to samsara.",
    "We all have this essence, the Buddha-nature. It is the primary cause for enlightenment and the reason we can become Buddha.",
    "Everybody, even animals, wants peace and happiness and nobody likes suffering, because that nature is total peace. This is true no matter how many adventitious afflictions are present.",
    "So we should reflect: \"I have the primary cause for enlightenment. If I make effort, it is definitely possible!\""
  ], {
    at: "00:26:48.067",
    title: "Takeaways: The primary cause is the Buddha-nature within us",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:26:48.067. Shares the timestamp
  // with the takeaways above; slide priority shows the takeaways first.
  comingUp([
    "As a working basis, the precious human life is excellent.",
    "Some animals are so kind, so peaceful, so intelligent — but if you ask them to develop bodhicitta or to meditate on emptiness, they have no idea.",
    "Not every human life is a precious human life. Those who have this opportunity can then understand how to develop bodhicitta, how to practice emptiness, and how to be free from samsara.",
    "The precious human life is the best opportunity. We should never take it for granted; rather, appreciate it, rejoice, and make it useful.",
    "The contributory cause is the spiritual master: a teacher who has studied and practiced the Dharma, especially bodhicitta, emptiness, and mahāmudrā, who first shows us this is samsara and then guides us how to be free from it, step by step.",
    "We need a genuine spiritual master — not necessarily one with a high title, but one who has studied and practiced the Dharma teachings, follows the path, and sincerely helps others — especially one who has bodhicitta.",
    "So this is what we need: a spiritual master who can help us how to be free from samsara."
  ], {
    at: "00:26:48.067",
    title: "Coming up: Precious human life and the spiritual master",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:26:48.067. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Working Basis and Spiritual Master",
    "Then the spiritual master gives the method leading to the result and the activities.",
    { at: "00:26:48.067" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:36:17.533
  takeaways([
    "The method is the spiritual master's instruction — on impermanence, the nature of samsara, suffering and causality, then on loving kindness, compassion, refuge, and bodhicitta, step by step. These help us purify all our mental afflictions.",
    "Our single focus is to purify our mental afflictions. We should not just count mantras; what matters is how to purify our mental obscurations and develop more love, compassion, and responsibility. It is very important that we individually take full responsibility.",
    "The result of the method is the body of perfect buddhahood. Here, \"body\" means the complete Dharmakāya. Dharmakāya is buddhahood — not just the Nirmāṇakāya and Sambhogakāya.",
    "The activities of Buddhas are benefiting sentient beings without conceptual thought, which means effortlessly. We ordinary beings have to make great effort and sacrifice so many things, and still encounter obstacles, difficulties, impediments; but once you become a buddha, benefiting many sentient beings is effortless."
  ], {
    at: "00:36:17.533",
    title: "Takeaways: The method, the result, and the activities",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:36:17.533. Shares the timestamp with the
  // takeaways above; slide priority shows the takeaways first.
  announcement(
    "Transmission of the Jewel Ornament of Liberation",
    "This Wisdom Is for Everyone",
    { at: "00:36:17.533" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:40:33.133
  takeaways([
    "I received the Jewel Ornament of Liberation from the great teacher Khunu Rinpoche and was so blessed to meet such a precious teacher. He lived a very simple life, but when he taught, you could see the excellent quality of his scholarship and of his enlightenment.",
    "I have shared the full text in the monasteries, in many places in India, Nepal, and Tibet, and I feel very good about sharing this.",
    "This time we don't have enough time to go through the whole text, but the essence of these teachings I will try to explain as much as I can — how to put it into practice, and help ourselves and help other people in the world.",
    "We need real wisdom of the Buddha — not as a Buddhist, but as a human being. As anybody wants peace and happiness, as anybody wants to be free from suffering, this is the only way.",
    "Through the war, the pandemic, different diseases, mental and physical — how much suffering there is! It's our own accumulation. There's no one to blame outside of us, and we have to practice the Dharma.",
    "Please appreciate, rejoice, and try to implement the practice on a daily basis, which means purifying our mind. It is in our own hand; no one controls us. We have the opportunity ourselves."
  ], {
    at: "00:40:33.133",
    title: "Takeaways: This wisdom is for everyone",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:40:33.133, red line only (empty black text hides
  // the second line). Shares the timestamp with the takeaways above; slide
  // priority shows the takeaways first.
  announcement(
    "Please take a deep breath",
    "",
    { at: "00:40:33.133" }
  ),

  // Dedication at 00:42:01.700, closing the teaching.
  dedication("slides/dedication.webp", {
    at: "00:42:01.700",
    audio: "audio/dedication.mp3"
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
  slides: SLIDES,

  // Printable copy of the slide bullet points, offered from the control bar.
  handout: {
    file: 'handouts/jewel-ornament-02-points-to-remember.pdf',
    label: 'Some takeaways',
    filename: 'Jewel Ornament of Liberation - Introduction Part 2 - Some takeaways.pdf'
  }
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

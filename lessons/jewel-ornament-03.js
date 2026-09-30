/**
 * lessons/jewel-ornament-03.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation, Buddha-nature.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, refuge } from '../slide-utils/index.js';

const VIDEO_ID = "uM8RbGPaOxA";
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

  // "Coming up" keypoints stopping slide at 00:00:29.300. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  comingUp([
    "Please appreciate today's opportunity to reflect on the Buddha's wisdom on how to handle suffering.",
    "Every sentient being desires to be free from suffering and to have all peace and happiness; but many don't know how to really handle the cause of suffering, and because of that they create more suffering.",
    "So aspire, \"Today I will reflect on the precious Dharma teachings to achieve complete enlightenment for the benefit of all sentient beings.\"",
    "The fully awakened Buddha revealed the total reality-nature, achieved total peace and happiness, and taught the Dharma to all, so that everybody has a chance to reflect and gain wisdom.",
    "In the world, we support each other as a community, so the peace or happiness that we receive comes from all sentient beings. Reflect on this and cultivate such an enlightened mind for every sentient being, based on loving-kindness and compassion."
  ], {
    at: "00:00:29.300",
    title: "Coming up: Motivation & the nature of mind",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:00:29.300. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "Motivation and the Nature of Mind",
    "Essence of the Jewel Ornament of Liberation, Ch. 1: Buddha-nature",
    { at: "00:00:29.300" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:09:57.633
  takeaways([
    "Our mind is not matter; it is consciousness — it neither exists nor non-exists. If it did not exist, how could we feel, \"I want peace and happiness\"? If it were matter, we should see it or touch it, but we don't.",
    "Like space, the mind has no limit. So we can develop bodhicitta to infinite sentient beings, as the Buddha did; bodhisattvas following that path did too, bringing great benefit for many centuries.",
    "This practice is not a belief system; it is the way to wake up and reveal our innate nature — uncontrived luminosity, pure, precious — which is within us but obscured by adventitious confusion, the mental afflictions.",
    "So we need to reveal this and see it directly. Then we can see these obscurations: their nature does not exist. We are not making these obscurations non-existent, but their nature itself does not exist."
  ], {
    at: "00:09:57.633",
    title: "Takeaways: Motivation & the nature of mind",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:09:57.633. Shares the timestamp
  // with the takeaways above; slide priority shows the takeaways first.
  comingUp([
    "Today we touch on the primary cause, the Buddha nature: every sentient being is pervaded by Buddha nature.",
    "As the Uttaratantra of Maitreya says: \"Because the perfect form of Buddha radiates, because there are no distinctions within suchness, and because all are in a family, all sentient beings are always of the essence of enlightenment.\"",
    "Every sentient being has the seed of enlightenment. We call it a seed because we have not awakened yet. Actually, it itself is Buddha, Buddha-dharmakaya.",
    "Since we have not perceived it and experienced it directly, we call it seed.",
    "The seed of enlightenment is pervaded to every sentient being. So that is inseparable of the luminosity and emptiness. From the luminosity side it is called effulgence — pristine, clear, pure — but that very pristine, clear, pure itself is inseparable from emptiness. That is why it says \"Because the perfect form of the Buddha radiates\"."
  ], {
    at: "00:09:57.633",
    title: "Coming up: Because the perfect form of Buddha radiates",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:09:57.633. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Because the perfect form of Buddha radiates",
    "First reason showing that all sentient beings are always of the essence of enlightenment.",
    { at: "00:09:57.633" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:13:14.467
  takeaways([
    "The Unsurpassed Tantra's first reason why sentient beings have Buddha nature is \"Because the perfect form of the Buddha radiates.\"",
    "Here, the form of the Buddha is Dharmakaya.",
    "Then about Dharmakaya and to explain this first reason, Gampopa says: \"All sentient beings are pervaded by the emptiness of Dharmakaya\" means that the ultimate Buddhahood is Dharmakaya, Dharmakaya is all-pervading emptiness, and emptiness pervades all sentient beings.",
    "And Gampopa closes this first reason by stating that therefore, all sentient beings are of the Buddha nature."
  ], {
    at: "00:13:14.467",
    title: "Takeaways: Because the perfect form of Buddha radiates",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:13:14.467. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "To achieve Buddhahood, we don't seek outside of us; we have to look inside our mind. Our mind has the nature of the Buddha.",
    "Even now, though we are not fully awakened, we can get a glimpse of this — as we did in the short meditation, relaxing physically and mentally, making the mind calm and peaceful.",
    "Then some mental affliction, like aversion or attachment, manifests in the mind. Usually our attention is taken by it; we go along with it and go through a lot of confusion and suffering.",
    "But here, when any thought manifests, just directly see it. Where is it coming from — outside or within? Where is it located? You don't find either. It's just a thought. What color and shape does it have?",
    "Then, finding that, you can see it is just an illusory nature, a manifestation of our habit."
  ], {
    at: "00:13:14.467",
    title: "Coming up: Directly glimpse that nature",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:13:14.467. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Looking inside our mind to get a glimpse of that nature",
    "Our mind has the nature of the Buddha",
    { at: "00:13:14.467" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:18:57.600
  takeaways([
    "We are so habituated — that is called inveterate propensity — that these thoughts of aversion, attachment, \"I,\" self, manifest effortlessly.",
    "But when you look at it directly, with wisdom, with special insight, you cannot find that it exists anywhere. The thought is there, yet you cannot find its location and we cannot find the thought itself exist. So it neither exists nor non-exists.",
    "So that finding, when you meditate on this and relax on this, you can see your mind is so calm, so peaceful. That is called effulgence, the clear light. At the same time, the nature itself is emptiness. So that is the Dharmakaya.",
    "So that's the Buddha's wisdom, that Dharmakaya within us; it pervades all sentient beings, no matter whether you realize it or not.",
    "Many people don't like to look at it; they think it's boring, there's nothing to see; they are so attracted by outer activities. As meditators, we look at it and meditate in that nature."
  ], {
    at: "00:18:57.600",
    title: "Takeaways: The Dharmakaya that pervades all sentient beings",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:18:57.600. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "The suchness of the Buddha is identical to the suchness of sentient beings. None is better or worse, bigger or smaller, higher or lower. So, because of that, all sentient beings are of the Buddha-nature.",
    "Look at your mind. All the different thoughts manifest. And when you use your special insight, with the support of calm abiding you cannot find that thought, because it does not exist as we thought — as something to grasp.",
    "For example, sometimes we are so excited: \"Why am I so excited? A very good friend of mine... So I'm so excited.\" Look at that excitement: without your friend, there's no excitement; without the mind, there's no excitement.",
    "That very excitement itself is of very illusory nature — just a display of causes and conditions, but in its own nature, itself does not exist. That is what is called suchness.",
    "Between the suchness of the Buddha and the suchness of sentient beings, there is not a single difference. When you see this directly, all your grasping and fixations dissipate, and then that makes your mind calm and peaceful: there is nothing to attach to and hate."
  ], {
    at: "00:18:57.600",
    title: "Coming up: Because there are no distinctions within suchness",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:18:57.600. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Because there are no distinctions within suchness",
    "Second reason showing that all sentient beings are always of the essence of enlightenment.",
    { at: "00:18:57.600" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:28:06.833
  takeaways([
    "When you could practice this, slowly your mind adjusts to this practice and becomes clearer and clearer. From that clarity, the qualities of the mind manifest: the understanding of causality, of bodhicitta, how you can develop loving-kindness and compassion.",
    "These qualities come out because our adventitious obscurations, the defilements, subside; slowly, slowly they go away and have no place to abide within us... So that mind neither exists nor non-exists; the effulgence of the clarity of the mind becomes clearer and clearer. So that itself is the Buddha's mind, and we have that within us.",
    "The Buddha's mind is no better than our mind — neither higher nor lower, neither better nor worse. For example, the emptiness of my right hand is not worse than the emptiness of my left hand, no difference in their emptiness. The emptiness of my happiness and the emptiness of my suffering: no difference.",
    "When we realize that, we don't attach to our happiness; we don't hate our suffering. When we comprehend that, that very nature itself is joy, because the Buddha nature itself is peace and joy. That is how we achieve undefiled, unafflicted peace.",
    "We don't have to look for it; it is within us, but we need the skill to reveal it: study and practice have to go side by side. Without practice, study is just knowledge; without study, you have no tool to practice."
  ], {
    at: "00:28:06.833",
    title: "Takeaways: The Buddha's Suchness and Ours Are No Different",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:28:06.833. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "The Unsurpassed Tantra's third reason is \"Because all are in a family.\" Here family means we have the opportunity, a way to actualize this suchness, the ability to see the Dharmakaya that we have within us. So all sentient beings are within the family.",
    "Five families are mentioned: disconnected, indefinite, hearer, solitary realizer, and Mahayana. Disconnected means that, for the time being, some individuals' adventitious obscurations are so thick that they have no feeling of concern about anything, right or wrong.",
    "It is like the moon in such a dark cloud: for the time being you cannot see the moon, but it doesn't mean it is always that way. Slowly, through causes and conditions, the cloud will disappear. But the moon is there, and that moon can appear.",
    "Likewise, life after life, slowly the disconnected connect to the teaching of wisdom and can fully awaken. That is why the Buddhas and great bodhisattvas are reborn again and again, as long as samsara exists they never give up. Every being has the opportunity; it may take time, but eventually anything is possible.",
    "Cultivate bodhicitta that way, sometimes it takes time. But slowly, slowly we can make it."
  ], {
    at: "00:28:06.833",
    title: "Coming up: Because we are all in a family",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:28:06.833. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Because all are in a family",
    "Third reason showing that all sentient beings are always of the essence of enlightenment",
    { at: "00:28:06.833" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:36:06.200
  takeaways([
    "Even in our own practice, sometimes we feel, \"There's no progress. I have chanted so many mantras, I have meditated so many years, but still my very thick, obscured mind — it's difficult.\" But if we continue without losing courage, interest, or devotion to the Dharma, to the Buddha, definitely we can progress step-by-step.",
    "Especially we have to develop bodhicitta. It's not easy even to help one person. You repeat again and again, and they don't get it. But from your side, never give up; always go forward: meditate, helping others, helping yourself.",
    "That's called family. Even though they are divided into five families, at the end all are in one family, Buddhahood: in Sanskrit, Ekayana, the one vehicle.",
    "With these teachings on Buddha nature we should inspire ourselves: \"I have the Buddha nature. If I study and practice Dharma, I can make it. I'm so fortunate that now I have met the Dharma teachings in my life.\"",
    "Then we also respect all sentient beings: \"Everyone is like me; they want peace and happiness and to be free from suffering. Everyone has the Buddha-nature and the potential to become Buddha.\" Then there is a reason to cultivate loving-kindness, compassion, and bodhicitta toward all of them, and through this practice we get all the opportunity to purify our own defilements."
  ], {
    at: "00:36:06.200",
    title: "Takeaways: Just go forward — We all are in one Family",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:36:06.200. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "In the Mahayana family there are six topics: classification, definition, synonyms, reason it is superior to other families, causal characteristics, and marks.",
    "Classification means division. There are two divisions of the Mahayana family, the naturally abiding family and the perfectly workable family. These two are very important for us to understand.",
    "Naturally abiding family means every sentient being has the Buddha nature; it is the natural mode of abiding, the basic disposition. Even though they are not prepared yet, in their mind the Buddha nature is naturally abiding, the nature of effulgence is there.",
    "Perfectly workable family means those who are interested in the Dharma, study and practice, especially bodhicitta: practicing loving-kindness and compassion to all sentient beings, and cultivating repeatedly, \"I want to attain Buddhahood for the benefit of all sentient beings.\" Life after life, we have been studying and practicing this."
  ], {
    at: "00:36:06.200",
    title: "Coming up: The mahayana family",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:36:06.200. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "The mahayana family",
    "Classification, definition, synonyms, superior to other families, causal characteristics, and marks",
    { at: "00:36:06.200" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:43:17.867
  takeaways([
    "The synonyms of family: it is called potential, because whoever has the Buddha nature has the potential to become Buddha; it is called seed; and it is called sphere-element. Sphere means all-pervasive: the potential is there; it is infinite.",
    "The shravakas and pratyekabuddhas purify just the obscuration of the afflictions. They cut through self-grasping, realize selflessness, and attain the arhat state.",
    "The bodhisattvas become Buddha when the two obscurations — the obscuration of the mental afflictions and the subtle knowledge obscuration — are both thoroughly purified. That is why the mahayana family is called fully awakened, that is why it is called superior. But arhats also can attain Buddhahood.",
    "Those of the disconnected family take a long time to become Buddha. In the indefinite family, those who connect to the Mahayana, it won't take too long, but those who connect to the shravakas and pratyekabuddhas take a longer time. Shravakas and pratyekabuddhas take a long time, but much sooner than the disconnected family. Those who belong to the Mahayana, it won't take too long to become Buddha."
  ], {
    at: "00:43:17.867",
    title: "Some Takeaways: Same potential, different paths",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:43:17.867. Shares the timestamp
  // with the takeaways above and the announcement below; slide priority shows
  // takeaways first, then this.
  comingUp([
    "By the above three reasons — the Dharmakaya pervades every sentient being, the suchness of the Buddha and of sentient beings is no different, and everyone has a family — know that all have the Buddha nature.",
    "Furthermore, consider these examples: silver abiding in its ore, oil abiding in a mustard seed, and butter abiding in milk. From silver ore we can produce silver; from the seed, oil; from milk, butter. Likewise, sentient beings can become Buddha.",
    "For example, the gold within the raw material and the gold already refined from it: there's no difference, the same nature.",
    "Like the butter in the milk and the butter which is produced: there's no difference. The only difference is that the butter in the milk you cannot see as butter or use as butter; the butter which is produced, we can see and use as butter."
  ], {
    at: "00:43:17.867",
    title: "Coming up: Examples and conclusion on Buddha-nature",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:43:17.867. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Examples and conclusion on Buddha-nature",
    "Sentient beings can become Buddhas.",
    { at: "00:43:17.867" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:48:20.500
  takeaways([
    "So we sentient beings in samsara, even though we have every potential of the Buddha, cannot say, \"I'm a Buddha,\" and cannot do as the Buddha does, helping sentient beings, because the enlightened qualities are obscured by temporary obscurations.",
    "The Buddha nature, the primary cause, pervades all sentient beings. Just relax, reflect on this, and meditate: even I can do it now; it's not far away.",
    "Sometimes we feel the Buddha is somewhere out there, and \"I am so insignificant; I am nothing.\" But if you touch these teachings and reflect on them, you can see: \"I have the Buddha nature. I can see it. I can experience it.\"",
    "If we don't know how to practice these teachings, it is still so far. In that case, we keep analyzing more and more — no end, because there's no end of thinking. That's why we have to know how to sit, reflect on this, meditate, and digest the teachings; then you can say, \"Oh yes, I can make it.\""
  ], {
    at: "00:48:20.500",
    title: "Some Takeaways: Concluding remarks",
    buttonText: "Continue lesson"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-03',
  name: 'Buddha-nature',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

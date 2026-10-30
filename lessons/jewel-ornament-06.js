/**
 * lessons/jewel-ornament-06.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation,
 * Introduction to Part 4: The Method.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, finalSlide, refuge, dedication } from '../slide-utils/index.js';
import { WATER_DROP_ON_THE_LAKE, JEWEL_ORNAMENT_QUOTES } from './credits.js';

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

  // "Coming up" keypoints stopping slide at 00:15:38.600. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  // Text between *asterisks* is quoted from the root text and shows in italics.
  comingUp([
    "*Since we have the primary cause, Buddha-nature, we have come from a continuous stream since beginningless samsara. At some time, we must have gained a precious human life and also met with a spiritual master.* Not so often, but just imagine: just like in this life, there are so many people who have encountered some spiritual masters, an opportunity to study and meditate.",
    "What went wrong? *What faults have prevented us from attaining Buddhahood in the past?* What obstacles did we face? What impediments did we encounter? Why are we still in samsara?",
    "This is a very important question to reflect on ourselves. It is the way to have conviction; this will help us to follow the path without flinching, without going back, going only forward.",
    "Otherwise, sometimes we think, “Buddha’s teachings are beautiful, wonderful, but I was not born with that. It’s okay, I’m happy. My life is all right.” There are so many like that, but we have to look at the complete picture of our life.",
    "Why have we not been freed from samsara? So the answer is here: *We have been overpowered by the four obstacles* — four different impediments, four different obstacles we encountered.",
    "Gampopa asked such an important question for us, because we don’t know which questions we should ask — so that we wake up: “I can see there’s a Buddha nature within me; now I have a precious human life. Still, I cannot practice so well. Why?”"
  ], {
    at: "00:15:38.600",
    title: "Coming up: What went wrong?",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:15:38.600. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Why are we still in samsara?",
    "We were overpowered by four obstacles",
    { at: "00:15:38.600" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:26:21.200
  takeaways([
    "*What are the four obstacles or impediments to the attainment of Buddhahood?* First, *being attached to this life’s activities* — not only business, not only politics; even sometimes we use Dharma practice just for this life’s benefit.",
    "Second, *being attached to the pleasure of samsara* means in the god realm, in the human realm. We try to make this life as perfect as possible; then, if we believe in the next life, we hope for a human rebirth in a good place. Some humans live like in the god realm, with such a joyous, good life: “This is enough for me. I feel good about this. I don’t need Dharma practice; I don’t need to meditate. I’m just well off.”",
    "Third, *being attached to peace* means sometimes we feel samsara is a state of suffering — occasionally good, but always with some problems, difficulties: “I cannot be totally free from that kind of suffering in samsara. I must be free from samsara, but for myself; I cannot do this for others. I need myself to be free from this vicious cycle of suffering.” So I am attached to my own peace, liberation.",
    "Fourth, *not understanding the method by which enlightenment is achieved*. For example: “Yes, I want to achieve complete enlightenment, but I don’t know how. Can you tell me?”",
    "We encounter these four, but not necessarily all four — any one of those. Some may not be so attached to this life’s activities, nor to the pleasure of samsara; they want to help others and are not so attached to their own peace, but they don’t know how to attain Buddhahood.",
    "So first we should get these four very important points. Just open our heart; don’t take it as a personal “I like” or “don’t like,” but look whether it makes sense or not."
  ], {
    at: "00:26:21.200",
    title: "Takeaways: The four obstacles to Buddhahood",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:26:21.200. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "*How can these four obstacles be dispelled? They are dispelled — gotten rid of — by practicing the instruction heard from the spiritual master.* That’s how the spiritual master is so important, and how important it is for the spiritual master to have all these qualities.",
    "It’s not the title. Sometimes we are so much involved with the title — “What title do you have? What title does he/she have?” — and not looking at the qualities. It’s very important to have the qualities, the ability to help others.",
    "*How many instructions of the spiritual master are there? In summary: meditation on impermanence* — first, to release attachment to this life.",
    "Second, *meditation on the faults of samsara and cause and result*. The faults of samsara means the suffering of samsara, the unsatisfactory nature of samsara; no matter how much we enjoy in samsara, never satisfied. And the cause of that, and the result.",
    "Third, *meditation on loving-kindness and compassion*. Everyone has some kind of love and compassion, whether emotionally, out of attachment, or else. But here it means love and compassion to all sentient beings.",
    "Fourth, *various elements of the cultivation of bodhicitta*: through different methods we cultivate bodhicitta. Bodhicitta practice is how to attain Buddhahood. *These four comprise the instruction of the spiritual master.*"
  ], {
    at: "00:26:21.200",
    title: "Coming up: The four instructions",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:26:21.200. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "How can these four obstacles be dispelled?",
    "By practicing the instruction heard from the spiritual master",
    { at: "00:26:21.200" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:34:52.667
  takeaways([
    "*To restate,* to make more clear how to get out of these four obstacles they are instructions on the meditation practice regarding such four.",
    "It’s not enough to just say, for example, “I understand impermanence”; it’s not enough just to say, “I know samsara is a state of suffering.” But here meditation practice means to bring it into our heart, then see that nature, convince ourselves, and follow the path. That is what is meant by meditation practice.",
    "These are the direct methods to counteract, to dispel the obstacles. When we are totally convinced about the impermanence of all phenomena — when we see that in the heart and just say, “Yes, I can see it” — then it helps to release attachment to this life.",
    "When we see the suffering of samsara, one after another, it helps to release the attachment to the pleasure of samsara.",
    "When you see all sentient beings as our mother, our sister, our brother, who are suffering, then it helps to release the attachment to only individual self-liberation.",
    "Then, when you know the bodhicitta practice, then you open the door towards complete Buddhahood.",
    "Look at these four obstacles carefully; investigate. Every country has a constitution, but this is the constitution of the Buddha’s teaching to achieve Buddhahood — the complete constitution, no more, no less.",
    "When we have this constitution understood in our heart, the practitioner feels so happy: “Yes! Now I know. I was practicing Dharma for many years, but didn’t know really what for, or how.” Or, “I like to meditate; really, I want to. I feel the suffering of samsara is so much, but I didn’t know. But now I know what this means.” And the joy you receive cannot be replaced by anything, and when you are working for enlightenment, all the hardships are nothing."
  ], {
    at: "00:34:52.667",
    title: "Takeaways: The constitution of the Buddha’s teaching",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:34:52.667. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "That’s why the life story of Milarepa is always so beautiful: he went through that life but he went through it so joyfully.",
    "From outside he looked so poor, so weak. Some hunters went up the mountain and saw Milarepa with nothing to eat, nothing to wear, in a cave, and they said, “What a poor man you are! You didn’t know how to live your life.”",
    "Milarepa answered, “I know what I’m doing, you don’t. This is because of the wisdom of Marpa, from whom I received the teachings.” He knew he would definitely be free from the vicious cycle of samsara.",
    "And he was so excited to go through purifying all these inveterate, deeply rooted habits. One needs such courage. Dharma practice is not for weak people. People ask why are monks and nuns ordained? We need such a courageous mind, a courageous body, strength physically and mentally, and go forward.",
    "This is for such wise people, weak people cannot handle this. So we should have such great joy; that’s why this is so precious. These points are so important first, to capture the root, the rudiments of Dharma practice."
  ], {
    at: "00:34:52.667",
    title: "Coming up: Joyful courage",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:34:52.667. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Contemplating impermanence",
    "It remedies attachment to this life’s activities",
    { at: "00:34:52.667" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:40:45.367
  takeaways([
    "*Thus, contemplating the subject of impermanence remedies attachment to this life’s activities.*",
    "Not only those who are not Buddhist, but even Buddhist business people, Buddhist politicians, are so corrupted for this life, because they are so attached to this life’s achievement. They have not received the Buddha’s message; they misunderstood it.",
    "We should have a clear picture of what this means. It doesn’t mean we don’t care for this life. Of course we have to eat, have a place to live, wear clothes; we need to sustain this life. But how much do you need? We have one stomach, one mouth. If you eat too much it’s a problem.",
    "Some people are totally focused on this life: “Can you say some prayers so that my business is very successful, so that I’m promoted to a higher status, get a good title?” All the focus is only for this life. We even forget the next life, let alone enlightenment.",
    "Meditate on this; reflect on this. This impermanence helps us to remove our obstacle of focusing only on this life."
  ], {
    at: "00:40:45.367",
    title: "Takeaways: Contemplating impermanence",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:40:45.367. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Then, *reflecting on the faults of samsara*. The faults of samsara means the suffering of samsara. In the human realm, we are not always bad: sometimes it’s a beautiful day, our health is good, and we have very good food to enjoy — “Life is beautiful, life is perfect.” But it’s not always that way.",
    "Sometimes things go in the wrong direction and we suffer: “What should I do? Can you say some prayers? My life is not going well.” So we have to reflect on both sides, good and bad — but it is always changing.",
    "*…and on karma, cause and its result, remedies attachment to the pleasure of samsara.* So don’t be too attached to samsara: whether you are born in the god realm or in the human realm, still there’s suffering.",
    "Of course, in the hell realm, as hungry ghosts or animals, the suffering is so profound, so deep. Still, in the human realm, you can see the suffering of the very rich people, of the leaders of the powerful countries — how much suffering they have!",
    "Sometimes you feel, “Why do you want to be the leader of a country?” Still, people are attached to that, without knowing. So if you see these teachings, then you say, “Oh, there are some alternatives.”"
  ], {
    at: "00:40:45.367",
    title: "Coming up: Life is always changing",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:40:45.367. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "The last three remedies",
    "Reflecting on samsara, compassion and bodhicitta",
    { at: "00:40:45.367" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:43:11.500
  takeaways([
    "Third, *meditating on loving-kindness and compassion remedies* — purifies, is the antidote for — *attachment to the pleasure of individual peace*. This peace is not samsaric peace; this peace is the liberation, like a partial nirvana.",
    "And the fourth, *cultivating the supreme bodhicitta*. Everybody has a mind, but the mind which desires to attain Buddhahood, the mind which cultivates bodhicitta, is the supreme mind.",
    "The mind which desires to help all sentient beings is such a sublime mind, such a precious mind. *That is the antidote for not understanding the method by which to achieve enlightenment.*"
  ], {
    at: "00:43:11.500",
    title: "Takeaways: The supreme mind",
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
  credits: [WATER_DROP_ON_THE_LAKE, JEWEL_ORNAMENT_QUOTES]
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

/**
 * lessons/jewel-ornament-04.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation, Chapter 2:
 * Precious Human Life.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, finalSlide, refuge, dedication } from '../slide-utils/index.js';

const VIDEO_ID = "R9hBJIBO0V8";
const SLIDE_BG = "slides/slide-1.png";   // optional 1920x1080 background image for stopping slides

// 1. VIDEO SEGMENTS (Chapters / Lecture parts shown in the "Segments" list)
const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" },
  { at: "00:33:34.900", title: "End of the Video", note: "Conclusion & dedication" }
];

// 2. SLIDES & OVERLAYS
const SLIDES = [
  // Refuge, offered as the first entry in the segments list, above "Start of the
  // Video". Shown only if the viewer chooses it; pressing play goes straight
  // into the teaching.
  refuge("slides/refuge.webp", { audio: "audio/refuge.mp3" }),

  // "Coming up" keypoints stopping slide at 00:00:59.533
  comingUp([
    "The working basis is the precious human life. See, everything depends on causes and conditions. It's not just one thing or two things; many causes and conditions have to come together.",
    "All sentient beings have Buddha nature. But, do all beings in the five realms (hell, hungry ghost, animal, demigod, and god) have the opportunity to achieve enlightenment? Gampopa says, \"No.\" This means not directly.",
    "Also Gampopa is not saying there are no bodhisattvas among the hell beings, hungry ghosts, animals, demigods, or gods. Of course there are. But, naturally, the ordinary beings there, in that life, don't have that opportunity."
  ], {
    at: "00:00:59.533",
    title: "Coming up: Not everyone has this opportunity",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:00:59.533. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "0. Precious human Life",
    "The excellent working basis to work towards enlightenment.",
    { at: "00:00:59.533" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:04:30.833
  takeaways([
    "Then, within the human realm, not every human being has that opportunity, but those who have the precious human life: a life which has the two qualities of leisure and endowments, and a mind which holds the three faiths (interests, trusts). Such one has the good basis to work towards enlightenment.",
    "In summary: leisure and endowments, trust, longing, and clarity faiths; two of the body, three of the mind. These five comprise the excellent working basis."
  ], {
    at: "00:04:30.833",
    title: "Takeaways: The excellent working basis: Precious human life",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:04:32.733. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  comingUp([
    "What makes leisure? First, its opposite: the eight unfavorable conditions. (1) Those born in the hell realm, which is not necessarily some other place: in the human realm and in the animal realm there are individuals so tortured, constantly tortured.",
    "(2) In the human and in the animal realm there are individuals who are always hungry, looking for something to drink, eat. (3) And there are some who are so stupid. These first three unfavorable conditions are the hell realm, the hungry ghosts or hungry spirits, and the animal realm.",
    "(4) Even human beings: barbarians in the border places, meaning where there's no wisdom, right or wrong."
  ], {
    at: "00:04:32.733",
    title: "Coming up: Unfavorable conditions",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:04:32.733. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "I. Leisure",
    "It is being free from these eight unfavorable conditions",
    { at: "00:04:32.733" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:07:21.367
  takeaways([
    "(5) Long-life gods: there are some who live a long life, but with no clarity of the mind, no understanding of what samsara is, what enlightenment is.",
    "(6) Holding wrong views: this means basically not understanding causality: what's virtue, what's non-virtue, what's the cause of peace and happiness, what's the cause of suffering.",
    "(7) Absence of the Buddha: where no Buddha has appeared, there are no teachings to study and practice how to be free from samsara.",
    "(8) And the last, the mute: those who cannot communicate.",
    "These are the eight unfavorable conditions. When these eight are reversed, free from these eight, then it's called leisure: it means one has time, opportunity to study and practice."
  ], {
    at: "00:07:21.367",
    title: "Takeaways: Free from these eight: leisure",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:07:21.367. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "The ten endowments are divided into two: five from one's own side and five from others' side.",
    "From one's own side, the five qualities that one needs to have oneself: (1) one has to be a human being, (2) born where there are Dharma teachings, and (3) having all the senses — you can read, hear, smell, think.",
    "(4) Not reverting to evil deeds, meaning one has not done the heinous actions which prevent attaining Buddhahood in one lifetime; and (5) having devotion for the teachings, meaning one is interested in taking refuge, taking the precepts, and so forth.",
    "The conditions or circumstances we need from outside are: (6) a Buddha has appeared in this world; (7) the Buddha taught the Dharma teachings; (8) the Dharma teaching the Buddha taught continues today; (9) there are followers of the Dharma, the teachers, the Sangha communities; and (10) there is love and kind support from others. When we practice, we need a lot of support."
  ], {
    at: "00:07:21.367",
    title: "Coming up: The ten endowments",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:07:21.367. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "II. Endowment",
    "Appreciate, rejoice, uplift yourself!",
    { at: "00:07:21.367" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:11:09.200
  takeaways([
    "When these two come together, this makes a body with the eight leisures and ten endowments, eighteen in all. That makes it a precious human life, such a great opportunity and condition to study and practice Dharma.",
    "Just imagine: if one is missing from these eighteen, then we cannot practice Dharma. So, how rare it is!",
    "Those who have this, appreciate, rejoice: \"There are so many people in the world; many don't have this opportunity, and I have this. So I am so fortunate.\"",
    "Appreciate, rejoice, uplift yourself: not out of arrogance, but out of modesty, out of wisdom, out of love and compassion."
  ], {
    at: "00:11:09.200",
    title: "Takeaways: How rare it is",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:11:09.200. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "It is precious for two reasons: it is difficult to obtain, and it brings great benefit.",
    "You can read why it is difficult to achieve, but just one important point is: how can beings in the hell, hungry ghost, and animal realms be reborn human? To have this precious life the foundation is the five precepts (as mentioned in the Madhyamakāvatāra), which is why ethics is so important; much accumulation of merit is needed.",
    "Having practiced the five precepts makes the perfect condition to be born as a human, as a precious human life.",
    "You can read the benefits in the book, but briefly: with a precious human life, a person of modest capacity can at least be reborn human again; a person of middling capacity can become free from samsara and achieve arhatship; and a person of great capacity can become a bodhisattva and even a Buddha.",
    "As Acharya Chandragomin said: \"How great are the beneficial effects of a precious human life! By obtaining this precious human life, one can become free from the ocean of rebirth,\" free from samsara. Beyond samsara its sufferings do not exist. Not only that, one can \"sow the seed of supreme enlightenment,\" which means we can cultivate bodhicitta."
  ], {
    at: "00:11:09.200",
    title: "Coming up: It is difficult to obtain and of great benefit",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:11:09.200. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "II. A - II. B It is difficult to obtain and of great benefit",
    "Contemplating precious human life is very important",
    { at: "00:11:09.200" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:18:37.800
  takeaways([
    "At the bodhisattva vow, one joyfully, happily performs the vow, saying: \"I cultivated aspiration and embraced action bodhicitta. I'm so grateful, so happy.\" It is because of this precious human life we have. So how precious this is!",
    "Cultivating bodhicitta is the direct cause and consummate method to achieve Buddhahood. Because of bodhicitta we practice the six paramitas: generosity, ethics, patience, perseverance, concentration, and insight. All the six paramitas we can practice because of this precious human life.",
    "Some people think contemplating on the precious human life is not important but it is very important, to inspire ourselves to practice and not waste the opportunity.",
    "Just as you need such a good car to arrive at a very beautiful destination, the car needs to have all the required conditions. Like this, the precious human life is like a car to drive to destination of enlightenment. Reflect on this, meditate",
    "In Dharma practice, always you practice joyfully. Samsara is not the place to stay overtime. Say: \"I have been in samsara so long; now I have this precious human life to be free and achieve enlightenment.\""
  ], {
    at: "00:18:37.800",
    title: "Some Takeaways: The vehicle to enlightenment",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:18:37.800. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Next, the working basis is the mind: the mind needs interest to be free from samsara and to attain Buddhahood. Without interest, even with the opportunity, when we try to sit: \"I want to go outside; there's a beautiful movie to see!\" Sitting seems boring, because we have not seen the direct suffering of samsara.",
    "Gampopa speaks of three faiths or interests: trusting faith, longing faith, and clear faith.",
    "Trusting faith is the understanding of causality: that suffering has a cause, and that the cause can be avoided. When the Buddha taught the four noble truths, he said, “You should know suffering,” meaning that it is reality everyone should understand. Then he taught the truth of the cause, where the suffering is coming from. The truth of the cause is that suffering does not come without cause, nor from a wrong or incomplete cause, but from the direct, right cause. So the Buddha said, “Avoid these causes of suffering.” Understanding this is trusting faith.",
    "Sometimes people think karma, emptiness, and rebirth are just Buddhist beliefs, culture, or something the Buddha created. In reality, causality is not a Buddhist belief; it is the reality of all phenomena. Through causes and conditions you can see how things are manifesting. This is very clear, obvious; we cannot ignore it; we have to be very smart."
  ], {
    at: "00:18:37.800",
    title: "Coming up: Trusting faith",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:18:37.800. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "III. Trusting faith",
    "It is to understand the causality of suffering and the cessation of suffering.",
    { at: "00:18:37.800" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:26:54.633
  takeaways([
    "In the 21st century, people are so smart and educated, yet we are completely besotted with our mental confusion.",
    "For example: \"I'm besotted with someone; it's taking my freedom.\" So our freedom is taken by our mental afflictions. Look at this: even though we know it, we sacrifice, and then we have to pay the price. The suffering is there because we create its cause of suffering.",
    "Seeing the complete nature of samsara, the Buddha taught this wisdom. His wisdom is beyond measurement; his compassion is undefiled compassion, beyond measurement.",
    "The Buddha taught the teachings with compassion to all sentient beings because for everyone, anywhere, everywhere, rich or poor, educated or not, human or non-human, all our concern is suffering and how to be free from it. On that basis, we make efforts and work hard, yet sometimes create more chaos, more suffering. So the Buddha taught: understand suffering and avoid the causes of suffering. Understanding this is trusting faith.",
    "Then he taught that to achieve nirvana, the cessation of suffering, we follow the path: generally the thirty-seven branches of enlightenment, especially the eightfold path. First understand, then follow; that is Dharma practice."
  ], {
    at: "00:26:54.633",
    title: "Some Takeaways: Causality is the reality",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:26:54.633. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Longing faith means: \"Now I really desire to be free from samsara. I really desire to achieve nirvana.\"",
    "Longing! \"I'm longing to arrive at a special place.\" Like when we make a plan to go on a picnic to a very special place: then we are so longing to get there; we have such a strong desire to arrive at that special place. So here we are longing to be free from samsara, longing to arrive at enlightenment. It's all our mental journey. That kind of faith we need.",
    "Clear faith means looking at the Buddha, who purified all the obscurations, fully awakened from the delusion, and developed all the excellent qualities."
  ], {
    at: "00:26:54.633",
    title: "Coming up: Longing faith and clear faith",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:26:54.633. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "IV. - V. Longing faith and clear faith",
    "With it, our study and practice will be very productive.",
    { at: "00:26:54.633" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:30:23.467
  takeaways([
    "As I mentioned, when you look at the mind, when negative thoughts invade your mind, where do they abide? When you look carefully, these negative thoughts, these illusions, have no place; they just dissolve into emptiness. That's taking care of the obscurations. When we are taking care of the obscurations, then the clarity, the effulgence of the mind, manifests slowly, slowly, clear.",
    "Then you see: \"Yes, it makes sense; everything is impermanent, everything is illusory in nature.\" There is great joy, happiness, which just manifests by itself, without attachment.",
    "Looking at this: the Buddha achieved such excellent qualities, a very clear mind. The Dharma teaching is the wisdom the Buddha has: \"I must study, I must practice the Dharma teaching for my own benefit and for others' benefit.\" And the Sangha, the great bodhisattvas who study and practice these, are so precious. So Buddha, Dharma, Sangha are so precious: this is clear faith.",
    "We need this clear faith; with it, our study and practice will be very productive."
  ], {
    at: "00:30:23.467",
    title: "Some Takeaways: Clarifying clear faith",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:30:23.467. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Two qualities of the body, leisure and endowments, and three qualities of the mind, trusting, longing, and clear faith, make the complete, perfect condition to study and practice Dharma. That’s what is called precious human life. Reflect on this; it is so precious.",
    "Acknowledge, “I have this condition. Even though I’m getting old, I can make it; I can practice Dharma. Now I have a better chance, more opportunity to study and practice Dharma.”",
    "Reflect: “Now I have enough experience of samsara. We did it all; we went to so many places, on picnics, to the movies, all such things; nothing special is there. Now the Dharma teaching makes all the sense. I have a precious human life. I am so fortunate. I have perfect conditions and perfect Dharma teachings; what better can we get than this? I cannot, I dare not waste this opportunity.”"
  ], {
    at: "00:30:23.467",
    title: "Coming up: The complete, perfect condition",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:30:23.467. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Concluding remarks",
    "So that is the precious human life to reflect on.",
    { at: "00:30:23.467" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:33:34.900. Shares the
  // timestamp with the closing slides below; slide priority shows it first.
  takeaways([
    "“My mental afflictions have been playing with me for a long time, dragging me here, there, everywhere. Enough. Now it’s time to settle down. I will practice Dharma, and I will make such a condition that these mental afflictions disappear to nowhere. They have no place to go but to disappear.” Just meditate, because these mental afflictions are nothing but a mirage, illusory nature.",
    "These mental afflictions obscure our mind when we don’t have wisdom and take all our attention; but as soon as we use this wisdom, where do they exist? Then they have no life; they are just illusions; that is what illusion is about. A mirage, they are like a dream. So that is the precious human life to reflect on."
  ], {
    at: "00:33:34.900",
    title: "Some Takeaways: Like a mirage, like a dream",
    buttonText: "Continue lesson"
  }),

  // Final closing stopping slide at 00:33:34.900, just before the video ends.
  finalSlide("Thank you everybody", {
    at: "00:33:34.900"
  }),

  // Dedication at 00:33:34.900, closing the session (the video ends here).
  // Slide priority shows it after the thanks.
  dedication("slides/dedication.webp", {
    at: "00:33:34.900",
    audio: "audio/dedication.mp3"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-04',
  name: 'Precious Human Life',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES,

  // Printable copy of the slide bullet points, offered from the control bar.
  handout: {
    file: 'handouts/jewel-ornament-04-points-to-remember.pdf',
    label: 'Some takeaways',
    filename: 'Jewel Ornament of Liberation - Precious Human Life - Some takeaways.pdf'
  }
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

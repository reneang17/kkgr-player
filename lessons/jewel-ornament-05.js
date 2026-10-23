/**
 * lessons/jewel-ornament-05.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation, Chapter 5:
 * The Spiritual Master.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, finalSlide, refuge, dedication } from '../slide-utils/index.js';
import { WATER_DROP_ON_THE_LAKE, GAMPOPA_AND_PAGMODRUPA, JEWEL_ORNAMENT_QUOTES } from './credits.js';

const VIDEO_ID = "YmPvqxGrinw";
const SLIDE_BG = "slides/slide-1.png";   // optional 1920x1080 background image for stopping slides

// 1. VIDEO SEGMENTS (Chapters / Lecture parts shown in the "Segments" list)
const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" },
  // The video runs 46:27; the closing slides sit just before its last frame,
  // as in the earlier lessons, so they trigger before playback ends.
  { at: "00:46:26.933", title: "End of the Video", note: "Conclusion & dedication" }
];

// 2. SLIDES & OVERLAYS
const SLIDES = [
  // Refuge, offered as the first entry in the segments list, above "Start of the
  // Video". Shown only if the viewer chooses it; pressing play goes straight
  // into the teaching.
  refuge("slides/refuge.webp", { audio: "audio/refuge.mp3" }),

  // "Coming up" keypoints stopping slide at 00:01:01.600. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  // Text between *asterisks* is quoted from the root text and shows in italics.
  comingUp([
    "“Yes, I have leisures, I have endowments, I have perfect conditions physically and mentally also. I trust this causality; I understand suffering and the cause of suffering; I want to be free from suffering, samsara; I am longing to achieve nirvana; and I have truly great faith in the Buddha, Dharma and Sangha.” It is all there. So, “Can I do this without a spiritual master?” Then, it is a little difficult.",
    "Gampopa explains that even with an excellent working basis, *if we are not encouraged by a spiritual master, it will be difficult to follow the path of enlightenment.* The spiritual master infuses you, encourages you, inspires you to study and practice the Dharma, and says, “Don’t be attached to samsara; get out of samsara,” and so forth.",
    "It is difficult *because of the power of non-virtuous propensities of previous lives and the force of habitual tendencies*; we are so habituated with our habits. Just for example, smoking. We are not born with smoking, but somehow, when we are young, with our friends, we become interested in smoking. Then slowly, slowly, slowly we get used to it, and after some years we are so habituated, it is very difficult to give up.",
    "With smoking, even your friends and relatives tell you, “It’s not good for you, not good for your health, not good for your money,” and you know it is not good. It’s worse than missing a lunch, because without it you cannot live. At the time when you smoke, if there is no smoke, you become restless, so irritated, because the habit is so habituated."
  ], {
    at: "00:01:01.600",
    title: "Coming up: Why we need a spiritual master",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:01:01.600. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "0. Ch. 3 The precious teacher",
    "Uprooting habitual tendencies with a wise, courageous teacher.",
    { at: "00:01:01.600" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:10:59.733
  takeaways([
    "Like in the case of smoking, our samsaric habits are so habituated, difficult to give up; sometimes you know it but can’t help it, and then we feel miserable. So when conditions happen, we need a spiritual master to help us, to teach us how to uproot these habits.",
    "We need a good teacher, who has wisdom, who has compassion, who has the ability to tell you. Some don’t tell you — they know your way is wrong, but they cannot tell you, feeling, “Maybe that person will be offended; if that person is angry, upset, then I don’t like it.”",
    "So the spiritual master has to have no attachment to himself or herself, first of all, and then the skill to tell you, and the wisdom and compassion to uproot our bad habits.",
    "Some great masters of the past had such bravery, mental courage, to tell the students: “What you are doing is not right; it’s wrong.” At first the disciple is so upset, not happy about it, but slowly, slowly the disciple recognizes that, and later feels so grateful: “Because you told me this, now I’m much better off. If you had not taught me this, it would not have happened this way.”",
    "That’s why the spiritual master is so important: to cut through our negative habits.",
    "The translation “spiritual master” is a little better than “spiritual friend.” When you say “spiritual friend,” psychologically you say, “Oh, she/he’s my friend,” so there’s no kind of urgency. When you find a spiritual master — “Oh, there’s something!” — he or she bears some quality, ability, so there’s some kind of weight there.",
    "*Therefore it is necessary to attend a spiritual master.* These five comprise attending the spiritual master: the reason why we need one; the classifications or divisions; the characteristics or definitions of each division; the method; and the benefits."
  ], {
    at: "00:10:59.733",
    title: "Takeaways: The qualities of a spiritual master",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:10:59.733. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "There are three reasons explaining why we have to attend spiritual masters. First, scripture — the Buddha’s word or the words of the great masters like Nāgārjuna and Asaṅga, who told us we need to attend spiritual masters; then logic, reason; and simile, or example.",
    "From the Condensed Perfection of Wisdom Sūtra: “A noble disciple who has respect for the lama should always attend the wise lama” — wise spiritual master.",
    "Title is not important. Some bear a very high title but don’t have good qualities; they get titles from different sources, and they go around — it’s confusing. But some who don’t have any title are so rich in their Buddhist philosophy, scholarship; they are so rich in meditation practice.",
    "For example, Khunu Lama had no title; he was just a simple practitioner, so not many people paid attention to him. When my friend and I went to receive teachings, there were only five or ten disciples. When you requested teachings, he said, “Oh, I don’t know. I studied some, but I forgot this, that…” But if you insisted, “Please, we really want teachings from you,” once he accepted, then you knew his scholarship, his realization — unimaginable.",
    "With or without a title doesn’t matter; the important thing is quality. That’s why it says “wise lama,” because one receives good qualities from him or her. Our qualities depend on the teacher: with a good teacher, your quality, your ability of experiencing the teachings grows."
  ], {
    at: "00:10:59.733",
    title: "Coming up: Qualities, not titles",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:10:59.733. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "I.A Scriptural reason to attend a wise spiritual master",
    "Quality, not title: our qualities depend on the teacher.",
    { at: "00:10:59.733" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:18:25.600
  takeaways([
    "“A bodhisattva mahāsattva who wishes to achieve unsurpassed, complete, perfect enlightenment, Buddhahood, should meet, attend, and pay respect to spiritual masters.” This is the Buddha talking: even bodhisattvas still should look for a good master.",
    "First you should meet, then attend — follow him or her — and then pay respect, meaning that you receive teachings. All your ability of experiencing meditation depends on that teacher.",
    "That makes sense. For example, even nowadays, whether big universities are good or not depends on the lecturers. With very good lecturers, the students from that university become so bright. If the lecturer has no quality, the student cannot get any benefit.",
    "In the Dharma teaching this is still more important. In the university you just get a good degree, qualities just for this life. Here, in the Dharma teaching, to cross the boundary of samsara is more difficult: that person has to know the nature of samsara and how to cross samsara and achieve nirvana — a very serious point to understand."
  ], {
    at: "00:18:25.600",
    title: "Takeaways: Meet, attend and respect the master",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:18:25.600. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "The logical reasons is: *One who wishes to achieve the omniscient state should attend a spiritual master because of not knowing how to accumulate merit or how to purify obscurations.* At the beginning, we don’t know how to purify our mental obscurations; we don’t know how to accumulate merit to digest these powerful, profound teachings.",
    "*The positive illustration of this is the Buddhas of the three times* — past, present and future: they became Buddhas because of the perfect teachers they met. On the other side, the solitary realizers don’t have that kind of perfect teacher, so they become solitary realizers, not Buddhas."
  ], {
    at: "00:18:25.600",
    title: "Coming up: How the Buddhas became Buddhas",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:18:25.600. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "I.B-C Logic & simile reasons, the means depends on the spiritual master",
    "To gather merit and wisdom, and to purify our obscurations.",
    { at: "00:18:25.600" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:22:29.333
  takeaways([
    "Gampopa explains: *In order to achieve the complete, perfect Buddhahood, all the accumulations, including merit and primordial wisdom, must be gathered. The means to do that depends on the spiritual master.*",
    "Not only that: *All the obscurations, including the afflicting emotions and the subtle obscurations to enlightenment, must be purified. The method to abandon these obscurations depends on the spiritual master.*",
    "So there are two reasons. The first reason is to gather all the collections of merit and wisdom. We don’t know how at the beginning; it depends on the spiritual master. So we need an authentic spiritual master.",
    "Second, we need to purify all the gross and subtle obscurations, and we individually don’t know how, we are overpowered by our mental afflictions, and we are enslaved by them — totally, completely besotted with our mental afflictions, and then have no chance. So to free ourselves from this, we need such a spiritual master, a great teacher, to skillfully purify all the obscurations and revealing our nature.",
    "The similes, or examples, are easy... So you can read them."
  ], {
    at: "00:22:29.333",
    title: "Takeaways: Gathering merit and purifying obscurations",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:22:29.333. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Now the division, or the classification: there are four spiritual masters — the ordinary spiritual master; the bodhisattva spiritual master, who has attained certain bhūmis; the Nirmāṇakāya spiritual master; and the Sambhogakāya spiritual master.",
    "For example, Buddha Śākyamuni was the Nirmāṇakāya during his time, and taught all those teachings to all the different levels. Then, a Buddha Sambhogakāya, in a Buddha field, a pure land, teaches through the great bodhisattvas. And bodhisattvas from the first bhūmi to the tenth bhūmi have different qualities and abilities, and different teachings to give to disciples. You can read more about them.",
    "To the ordinary spiritual master we will pay a little bit of attention, because right now we don’t see Buddhas, and there are great bodhisattvas out there, but we don’t know who, or what different levels they have achieved. But we see the ordinary spiritual masters on a day-to-day basis in our life.",
    "Gampopa made the ordinary spiritual masters into three divisions: those who possess eight qualities, those who possess four qualities, and those who possess two qualities."
  ], {
    at: "00:22:29.333",
    title: "Coming up: Four kinds of spiritual master",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:22:29.333. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "II.–III.C Division & first type of ordinary spiritual master",
    "The ordinary teachers we see on a daily basis.",
    { at: "00:22:29.333" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:28:05.666
  takeaways([
    "From the Bodhisattva Bhūmi, by Asaṅga: *One should understand that a bodhisattva who has eight qualities is a perfect spiritual master.*",
    "What are those eight? 1) *One who possesses the moral ethics of bodhisattvas* — moral ethics is very important. 2) One who *is learned in the bodhisattva teachings*: a great scholar who studied the teachings from the Buddha and great masters. 3) One who *possesses realization*: at least bodhicitta fully kind of cultivated, and also a sense of emptiness. 4) *Possesses compassion and loving kindness*: to share the Dharma with others sincerely to free them from suffering — not concerned for one’s own life, but concerned for others.",
    "5) *Possesses fearlessness*: because of bodhicitta and realization of emptiness, there’s no fear to give teachings, or to point out faults — no fear or doubt. 6) *Possesses patience*, this courage. 7) *Possesses an indefatigable mind*: repeating the teachings and explanations one after another, all the way. 8) *Expert in verbal expression*: has the skill of how to express these teachings. A bodhisattva who has these eight qualities is a perfect teacher."
  ], {
    at: "00:28:05.666",
    title: "Takeaways: Ordinary spiritual masters with eight qualities",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:28:05.666. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "From the Ornament of the Mahāyāna Sūtras, by Maitreya: *Possessing great scholarship, dispelling doubt, whatever he says is acceptable, and distinguishing the two realities — this is a perfect bodhisattva spiritual master.*",
    "1) *Possessing great scholarship refers to being able to give more extensive teachings because of vast wisdom*: that master has studied various teachings from the Buddha and from masters like Nāgārjuna and Asaṅga, so has great wisdom to explain these teachings.",
    "2) *The spiritual master can dispel doubt because he has profound discriminating awareness.* Doubt here means confusing— not sure, right or wrong. So *dispel doubt* means that the teacher can help us to purify this confusion and lead us to the right path, because the spiritual master has good discriminating awareness, wisdom, and also good experience in the practice — those two.",
    "3) *His words are acceptable because his action is pure virtue.* Sometimes there are some who are very expressive, but their moral ethics are not so pure; they don’t behave well, so you cannot accept their words. If a spiritual master explains the teachings precisely and maintains the discipline well then people can trust. So it means that has such pure moral ethics and from there Dharma teachings are given.",
    "4) *He or she explains the primary characteristics of afflicting emotions and of their purification*: that spiritual master has the ability to explain what is the cause of samsara and what is the cause of nirvana, and how to free from samsara and how to follow nirvana.",
    "If the spiritual master has these four, he or she, is the perfect teacher, a wonderful teacher."
  ], {
    at: "00:28:05.666",
    title: "Coming up: Second type, spiritual master with four qualities",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:28:05.666. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "III.C Second and third type of ordinary spiritual master",
    "Four qualities and two qualities of a perfect spiritual master.",
    { at: "00:28:05.666" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:35:32.066
  takeaways([
    "The third type has two qualities. *Engaging in the conduct of the bodhisattva,* 1) *a spiritual master is always expert in the Mahāyāna teachings* — must have vast knowledge of study, reading a lot of Mahāyāna teachings; 2) *and will not abandon the bodhisattva vow* — the moral ethics, including the Vinaya and the bodhisattva vows, are kept purely. These two are very important qualities that spiritual masters are required to have.",
    "It even says: *the bodhisattva will not abandon the vow even at the risk of his own life*. So even risking the life for the vow. For example: “If you don’t kill this person, I will kill you.” — “Yes, you kill me.” Or: “If you don’t steal this, you will be persecuted.” — “Okay, you can persecute me. I cannot steal.” That’s just an example; it may not happen. So we practitioners have that kind of moral ethics, a pure life.",
    "When we study and practice the Dharma teachings in general, especially the Mahāyāna teachings, we are establishing ourselves as better human beings: more peaceful, more compassionate, more courage, wisdom, ready to serve all societies — because in samsara all beings are confused; they don’t have a good teacher.",
    "So the Dharma teaching is the only one that teaches you the direct cause of peace and happiness — for today, for tomorrow, for this life, for the next life, in samsara, and for enlightenment."
  ], {
    at: "00:35:32.066",
    title: "Takeaways: Third type, spiritual master with two qualities",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:35:32.066. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "When this kind of spiritual master is found, this is the method of how to attend the spiritual master: 1) *attending him or her through respect and service*; 2) *attending him through devotion and reverence*; and 3) *attending him through practice and persistence in the teachings*.",
    "The first two are important but easy to understand. The third one, attending him or her through practice and persistence — this is very important. First you receive all the teachings, whatever is required; then practice. Persistent means practice repeatedly, again and again.",
    "For example, in Vajrasattva practice or purification, we have counted 100,000, but we are not enlightened; it has not purified all obscurations. So I have to continue — persistent.",
    "Sometimes we say, “Oh, I have done 100,000 prostrations, 100,000 Vajrasattva practice,” somehow like proving you have done such a great thing. But in reality, when you look at the mind — a long way to go."
  ], {
    at: "00:35:32.066",
    title: "Coming up: Attending through practice and persistence",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:35:32.066. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "IV. The method of attending the spiritual master",
    "Respect and service, devotion and reverence, practice and persistence.",
    { at: "00:35:32.066" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:39:41.933
  takeaways([
    "So persistence is required. That means purifying, as I always mention, our mental afflictions — the self-grasping, our attachment, aversion, greed, these things. That’s very difficult, not easy, but all the Dharma teachings are designed for that.",
    "Sometimes there’s a misunderstanding: “If you don’t attach, then how can you care for others?” Without attachment, you care better. When you have attachment, you are kind of stuck there, and then it is difficult to help and support others. Instead, you want to do so much because you are attached, and it hurts others.",
    "Without attachment, when helping others, you know what is required, what is necessary, out of compassion, out of love and kindness; then you can help. It’s much better, without hurting yourself, without hurting others.",
    "So release the attachment. Attachment means “my own benefit — my own benefit I attach to.” Purify that, and then help others."
  ], {
    at: "00:39:41.933",
    title: "Takeaways: Purifying attachment, caring better",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:39:41.933. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "The beneficial effects of attending a spiritual master are mentioned in the life story of Śrīsambhava: *Noble family! A bodhisattva who is well guarded by spiritual masters will not fall into the lower realms.* “Noble family” means a bodhisattva, who has bodhicitta.",
    "*Well guarded by spiritual masters* — the spiritual master is next to you and tells you what to do, what not to do, and you follow that accordingly. So one will not fall into the lower realms, because the spiritual master tells you, “Don’t commit non-virtue; develop all the virtuous activities.”",
    "*A bodhisattva who is escorted by spiritual masters will not fall into the hands of an evil person. A bodhisattva who is well guarded by spiritual masters will not turn away from the Mahāyāna path.* You always follow in the Mahāyāna family; you are always inspired to practice bodhicitta, all the time."
  ], {
    at: "00:39:41.933",
    title: "Coming up: Well guarded by spiritual masters",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:39:41.933. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "V. The benefits of attending the spiritual master",
    "Well guarded by spiritual masters, one goes beyond samsara.",
    { at: "00:39:41.933" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:43:05.266
  takeaways([
    "*A bodhisattva who is well guarded by spiritual masters will go beyond the ordinary person’s level* — that means one will be free from samsara.",
    "Meditate, reflect: first, pure moral ethics as a foundation; on that, the mind is well established in śamatha; and above śamatha, special insight — seeing directly the whole nature of your own being. You see it directly, and go beyond samsara.",
    "The spiritual master inspires you to do this practice; you follow the path, and you get this benefit. So that’s why the spiritual master is very important, and important to have all the necessary qualities.",
    "Then the Mother of the Victorious Ones, the Perfection of Wisdom, says: *A bodhisattva mahāsattva who is well guarded by spiritual masters will quickly achieve unsurpassable, complete enlightenment.*"
  ], {
    at: "00:43:05.266",
    title: "Takeaways: Going beyond samsara",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:43:05.266. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "So today we have done three chapters: Buddha nature; the working basis, the precious human life; and then the spiritual master.",
    "I’m so happy with how I’m teaching: without going line by line, get the essence, put it together, and then you just follow the practice. I’m so happy to do this.",
    "As I mentioned, I share this from my very small knowledge here to help others — all of you. So please practice this. We have a big responsibility to help many people in this country and all over the world. Thank you so much."
  ], {
    at: "00:43:05.266",
    title: "Coming up: Get the essence, follow the practice",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:43:05.266. Shares the timestamp with the
  // takeaways and coming-up above; slide priority shows those first.
  announcement(
    "Closing and dedication",
    "Get the essence, put it together, and follow the practice.",
    { at: "00:43:05.266" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:45:49.600
  takeaways([
    "Now, please take a deep breath. Please inhale and exhale. Just relax your body and mind. Once more, inhale fully and exhale. Make your mind spacious, like space, and inhale and exhale.",
    "As I mentioned, this is just reminding, refreshing our Dharma knowledge. Please appreciate and rejoice.",
    "Then we will say some dedication prayers for the freedom from samsara of all sentient beings, and meanwhile for peace and happiness in the world."
  ], {
    at: "00:45:49.600",
    title: "Takeaways: Breathe, rejoice and dedicate",
    buttonText: "Continue lesson"
  }),

  // Final closing stopping slide at 00:46:26.933, just before the video ends.
  finalSlide("Thank you everybody", {
    at: "00:46:26.933"
  }),

  // Dedication at 00:46:26.933, closing the session (the video ends here).
  // Slide priority shows it after the thanks.
  dedication("slides/dedication.webp", {
    at: "00:46:26.933",
    audio: "audio/dedication.mp3"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-05',
  name: 'The Spiritual Master',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES,

  // Third-party works shown in this teaching, listed under the segments.
  credits: [WATER_DROP_ON_THE_LAKE, GAMPOPA_AND_PAGMODRUPA, JEWEL_ORNAMENT_QUOTES],

  // Printable copy of the slide bullet points, offered from the control bar.
  handout: {
    file: 'handouts/jewel-ornament-05-points-to-remember.pdf',
    label: 'Some takeaways',
    filename: 'Jewel Ornament of Liberation - The Spiritual Master - Some takeaways.pdf'
  }
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

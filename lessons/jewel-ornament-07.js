/**
 * lessons/jewel-ornament-07.js
 * Lesson content: Khenchen Rinpoche — Jewel Ornament of Liberation,
 * Chapter 4: Impermanence.
 *
 * PURE DATA, like every lesson file: video id, chapter markers, slide timeline.
 * See docs/AUTHORING-LESSONS.md.
 */

import { announcement, comingUp, takeaways, finalSlide, refuge, dedication } from '../slide-utils/index.js';
import { WATER_DROP_ON_THE_LAKE, JEWEL_ORNAMENT_QUOTES } from './credits.js';

const VIDEO_ID = "KLFTDfj8qVg";
const SLIDE_BG = "slides/slide-1.png";   // optional 1920x1080 background image for stopping slides

// 1. VIDEO SEGMENTS (Chapters / Lecture parts shown in the "Segments" list)
const SEGMENTS = [
  { at: "0:00", title: "Start of the Video", note: "Opening remarks" },
  // The teaching runs to the video's last frame (59:34.6), so the closing slides
  // sit there. The playback loop keeps polling after the video ends, when the
  // reported time is the full duration, so they still fire.
  { at: "00:59:34.600", title: "End of the Video", note: "Conclusion & dedication" }
];

// 2. SLIDES & OVERLAYS
const SLIDES = [
  // Refuge, offered as the first entry in the segments list, above "Start of the
  // Video". Shown only if the viewer chooses it; pressing play goes straight
  // into the teaching.
  refuge("slides/refuge.webp", { audio: "audio/refuge.mp3" }),

  // "Coming up" keypoints stopping slide at 00:01:39.967. Shares the timestamp
  // with the announcement below; slide priority shows this first.
  // Text between *asterisks* is quoted from the root text and shows in italics.
  comingUp([
    "I will read a few lines and explain, and then you can read more details. *Of these, the first instruction is the meditation on impermanence as the antidote/remedy to attachment to this life.*",
    "*“All composite phenomena…”* A composite phenomena are produced through many causes and conditions, which then produces it. Just like a writing pen: the pen is composed of, or a product of, many causes and conditions. So Buddha said all those are impermanent.",
    "*“O monks, all composite phenomena are impermanent.”* Monks and nuns need a lot of reminders of impermanence. Wearing Dharma robes without contemplating impermanence is not so good. So then, mental afflictions come; attachment comes, and the fighting.",
    "So, to hundreds of thousands of monks and nuns the Buddha said: *“O monks and nuns, all composite phenomena are impermanent.”* Then all the bubbling of the mind just slow down. All the attachment around there is lessened, and the mind becomes more peaceful, physically more peaceful. We just reflect and meditate on this.",
    "Just meditate on it. For example, when there’s deep suffering, meditate on impermanence. Take a deep breath: everything is impermanent. When you are taking all your attention to the suffering, this helps to release the suffering, “Oh, the suffering is not permanent, it will change.” Meditate.",
    "When strong anger arises, meditate on impermanence. The person to whom you have the anger is impermanent. So, “Why are you so vicious about your anger to that person?” It helps to release that power.",
    "It’s very easy to do but it’s very important to do off and on. Just sit, just take a deep breath and meditate. When you are next to a tree, the wind blows, the tree moves making noise; meditate, “Oh, this is impermanent, it’s changing, everything has this nature.” While I talk about impermanence, please meditate on this."
  ], {
    at: "00:01:39.967",
    title: "Coming up: All composite phenomena are impermanent",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:01:39.967. Shares the timestamp with the
  // coming-up above; slide priority shows that first.
  announcement(
    "0. All composite phenomena are impermanent",
    "Meditation on Impermanence as great healing",
    { at: "00:01:39.967" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:10:26.733
  takeaways([
    "Meditating on impermanence is great healing. It’s not a negative thing. Whether we contemplate on impermanence or not, we are impermanent anyway.",
    "Those who don’t believe in impermanence are impermanent anyway. No choice. Sometimes some people say, “Impermanence is such a negative thought, let us have a more positive… don’t think about impermanence.” But it is impermanent anyway.",
    "Now in the world, wives and husbands, when they disagree so much, they divorce — one, two, three times. And there are some who have very good relationships, so peaceful, so grateful — they spend their whole life together. But at the end of their life there’s so much suffering: “I lost my husband/wife. We were so good together, we loved each other so much. I miss him/her so much.” And the pain is so much, in the mind, in the heart.",
    "Now I’m getting old, and so are many of my friends. Sometimes they are writing “Can you say prayers so that in their next life they can meet my husband, my wife again.” What should I say, really? Attachment is that pain, so much.",
    "Impermanence is not about being careless. As I mentioned, you care for each other, you help each other, you support each other — but look at impermanence, practice. When you have impermanence, you are prepared, and also you can live more peacefully.",
    "So, “You are impermanent, I’m impermanent, let’s live peacefully, without fighting.” Then you can get so much benefit, and remind each other of Dharma practice: “It’s not just only this life — let’s practice for enlightenment, for buddhahood, for the benefit of all sentient beings.” Like that, impermanence has such powerful instructions."
  ], {
    at: "00:10:26.733",
    title: "Takeaways: Impermanence is great healing",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:10:26.733. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Now, there are four points which are very important. In what way are they impermanent? *“The end of accumulation is dispersion or exhaustion.”* This is the first point.",
    "You accumulate wealth, but at the end it exhausts — disperses, or reduces. There are some very rich people who at the end of their life have nothing: exhausted, consumed. If you read the history of the past you’ll see.",
    "Nowadays you see in some countries, when they become the leader of the country, with greed they accumulate so much. They have so much, but the people don’t have. So now people are protesting — it’s a cause of suffering — so they have to run away. Then, what’s the benefit to accumulate all this? Look at this."
  ], {
    at: "00:10:26.733",
    title: "Coming up: Accumulation ends in exhaustion",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:10:26.733. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "0. The end of accumulation is dispersion",
    "Instead, practice gratitude",
    { at: "00:10:26.733" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:13:45.033
  takeaways([
    "As I mentioned the other day, when you get a bowl of porridge or a few pieces of bread, you appreciate, you rejoice: “It’s because of all the other people’s support that I got this. I’m so fortunate. I appreciate, I rejoice, I’m content with that.” And there’s great peace, joy, because you appreciate. “So I’m so grateful.”",
    "We live moment to moment. We plan for the next day, we plan for next week, next month, next year. But who knows? It’s indefinite. But we have now, and now is the time to practice Dharma.",
    "Now is the time we have total freedom about how to manage our mind. So impermanence practice is such a powerful way to manage our mind, moment to moment."
  ], {
    at: "00:13:45.033",
    title: "Takeaways: Appreciate, rejoice, content",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:13:45.033. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Then, *“The end of construction is falling.”* This is the second point.",
    "You built buildings, built roads, built airplanes, railways, all the cars, tractors — all this, after some time you see it is falling, falling into parts. You constantly have to repair all of them."
  ], {
    at: "00:13:45.033",
    title: "Coming up: Everything we build falls into parts",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:13:45.033. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "0. The end of construction is falling",
    "Meditate “All constructions are like this”",
    { at: "00:13:45.033" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:15:22.200
  takeaways([
    "Just for Buddhists, if anybody went to India… Once Buddhists became so powerful. You could go to the Bodhgaya, Nalanda area, Kushinagar, Lumbini: so many monasteries were built, hundreds and thousands of monks and nuns were there, but now you just see ruins.",
    "So look at this, remind yourself, meditate on all of this."
  ], {
    at: "00:15:22.200",
    title: "Takeaways: Remind yourself, meditate",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:15:22.200. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Then, *“The end of meeting is separating.”* This is the third point.",
    "So all meetings in life are like that. Husband and wife, we meet, we met; or children are born, they meet their parents, parents meet their children. But at the end we separate. Maybe we stay together 50 years, 60 years, 70 years, even 100 years, but then one day we have to separate. Look at this."
  ], {
    at: "00:15:22.200",
    title: "Coming up: One day we have to separate",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:15:22.200. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "0. The end of meeting is separating",
    "Prepare, and handle it wisely, carefully",
    { at: "00:15:22.200" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:17:15.067
  takeaways([
    "So, as I mentioned earlier, it’s about preparation so there is not so much pain. When we prepare, meditate on this, then when it actually happens there’s not so much pain. Otherwise there’s such great pain, desperate — you cry, and sometimes there is suicide.",
    "So Buddha taught “This is the reality nature but you can handle it wisely, carefully.” Instead, you should get so much benefit from this. Instead of going through so much suffering, try to get benefit from this.",
    "So we need courage, wisdom, just like earlier I mentioned."
  ], {
    at: "00:17:15.067",
    title: "Takeaways: It’s a preparation",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:17:15.067. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Then, *“The end of life is death.”* This is the fourth point.",
    "When we are born, it means one day we’ll die. Mostly we know we’ll die one day — we know it, because history can tell us there’s no one who lived forever. Even if they live 100 years, 120 years, still they will die one day. It’s clear, obvious. But when we are not prepared, then the suffering is so much. So we don’t need suffering.",
    "Without preparation, at that time we call this guru, that lama, that great teacher: “Can you help me? I’m going through so much suffering.” Then what can the guru tell, what can the lama tell, you know?"
  ], {
    at: "00:17:15.067",
    title: "Coming up: One day we will die",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:17:15.067. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "0. The end of life is death",
    "Liberation is in your hand",
    { at: "00:17:15.067" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:20:26.600
  takeaways([
    "So the Buddha directly talked to his followers: “I can give you all the instructions, all the methods” — as here Gampopa is teaching us — “but you have to apply yourself. Liberation is in your hand.” So how grateful!",
    "Buddha was not telling, “Bring all your offerings to me, I will do everything for you.” Buddha was telling, “You have to sustain your life, you meditate your life. Live in the middle way, not too much, not too little.” Everything in the middle, that way is manageable: you can manage your life. When there’s too much, you cannot manage.",
    "I saw there are some people who have a lot of collections, and they’re suffering so much. They don’t know what to do with those; they can’t get rid of them, and they cannot keep them all. So Buddha is teaching us how to manage our life.",
    "And then there comes the peace, there comes the joy, peace and happiness. And then it is not just only for this life, but for the next life and enlightenment, if one can manage."
  ], {
    at: "00:20:26.600",
    title: "Takeaways: Live in the middle way",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:20:26.600. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "So, these four: firstly, please contemplate these four, they are very important. These four include all the composite phenomena — the accumulation, the constructions, the meeting and the life. Within these four all the impermanence is included.",
    "So reflect on these four subjects: first memorize them, and reflect on these, and then meditate on impermanence.",
    "All the accumulations, at the end they will exhaust, they will disperse. And all the constructions, no matter how concrete you build, after some time they will fall — like airplanes, trains, roads, buildings.",
    "And you see, all we met, like in a meeting hall: hundreds of people you meet, and after some time everything is gone, by themselves, separated. Look at this — everything is just illusory nature. At one point there are hundreds of thousands of people in a big hall; after a few hours they are all gone, and the hall becomes empty. That’s called illusion. If that is not an illusion, then what is an illusion?",
    "Reflect on this. In the morning, a beautiful flower; in the afternoon it fades, it decays. So, like that."
  ], {
    at: "00:20:26.600",
    title: "Coming up: Reflect on these four",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:20:26.600. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "0. These four include all impermanence",
    "The mind is the most important",
    { at: "00:20:26.600" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:27:06.500
  takeaways([
    "So meditate on this. Appreciate the opportunity you have, appreciate the health you have: “I must use it to practice Dharma.” Dharma practice means to improve our mental quality. The mind is the most important, as you can see.",
    "Buddha taught the complete nature of the mind — nothing is missing to achieve complete enlightenment — the complete nature of the mind in the relative state and in the absolute state.",
    "The modern scientists, neurologists, they are working so hard to see the mind, using all the telescopes, all the machines. They cut the brain into many pieces — “Where’s the mind?” — but they cannot find it. They have to meditate themselves: they have to get good shamatha and special insight. Through these two methods they can understand the mind. Otherwise, through a machine they cannot see, because machines are matter, substance, and the mind is consciousness — it’s not matter.",
    "We know we have a mind, but we don’t know how it is, because our attention is completely, always on the outside, not inside.",
    "I wrote one book, “Samsara & Nirvana: two sides of the same hand”. It is about how one side of the mind works, and the other side, how to see the non-duality. It’s a very complex subject. So this is always to improve our mind, to see the advance of the mind, how to relax the mind.",
    "Finally, I just want you to reflect on these four topics. First, this quotation — the Buddha said, *“O nuns and monks, all composite phenomena are impermanent.”* It’s very simple, but a very powerful message. And then next, those four topics. Please reflect on this."
  ], {
    at: "00:27:06.500",
    title: "Takeaways: Dharma practice improves the mind",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:27:06.500. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Then next, the summary of this impermanence: *“classification, method of meditation and beneficial effects of meditation.”* These three comprise all the contemplation on impermanence, and these are very nicely described in this book. You just read it and it’s not so difficult to understand.",
    "So first is outer phenomena, inner phenomena. Outer is the whole universe: the gross impermanence, and then subtle impermanence, and very subtle impermanence. So these are examples on how to practice impermanence, step by step.",
    "First, when you look at the mountains, like the rocky mountains, all this looks very solid. They are like a rock — so silent, unmovable — but they are impermanent. So meditate on that.",
    "Then, after the gross impermanence, go to a little more subtle impermanence. See the four seasons, how the four seasons change. And then day and night: just see how everything is impermanent.",
    "Then very subtle impermanence: like the running of the river. The continuation, the running of the river, is so continuously changing. I don’t realize how it is changing, but it’s changing so… every second it is changing."
  ], {
    at: "00:27:06.500",
    title: "Coming up: Outer impermanence, step by step",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:27:06.500. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "I. - II.A Gross, subtle and very subtle impermanence",
    "How much we are deluded",
    { at: "00:27:06.500" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:31:43.933
  takeaways([
    "So we are deluded to perceive that, because the continuity is similar. That’s why I say, “I saw this river last year”, “I saw this river yesterday.” Actually, it’s gone; it’s gone to the ocean. What I’m seeing now, today, is different from yesterday. But I am deluded to see the same river that I saw yesterday and today. So how much we are deluded, you see?",
    "So the river is constantly changing. Past is past, future is future, but, like the river, this present moment is changing. That means that nature itself is emptiness. So through this practice, meditation, from the impermanence you can realize the emptiness. So meditate on this.",
    "And that’s your mind — how your mind can change and can improve. For example, “Oh yes, my friend — first I like so much, and by just one instance, then I say I don’t like you.” Everything is kind of delicate, changing. So meditate on this.",
    "So that is the Mahamudra, Dzogchen. That’s very profound, but because our gross mind finds it difficult to comprehend, we don’t see it that way. That’s the impermanence of the outer phenomena."
  ], {
    at: "00:31:43.933",
    title: "Takeaways: How much we are deluded",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:31:43.933. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "Then inner phenomena: sentient beings — everyone in the world is impermanent. Here it is called *“impermanence of others”*: all sentient beings are impermanent. And *“impermanence of oneself”*: I also am in the state of impermanence; I am also changing.",
    "Just reflect, take a deep breath and relax: “From last year to this year, I changed one year — my life is shorter. From last month, one month is gone. From last week, one week is gone. From yesterday, one day is gone. Now, from this morning, one hour, two hours are gone.” Just meditate like that: “That’s my nature. I’m changing every second.”",
    "So, that means, impermanence means, no essence. There’s no essence. You look at a beautiful flower, so precious, but that very beautiful flower fades in one second. So there’s no essence; it’s changing. You can see that through your wisdom, special insight: everything is changing, everything is like a bubble, everything is like a mirage.",
    "So look at this, meditate and calm your mind. Bring your mind to the right place, relax there, meditate. Then everything starts to be natural."
  ], {
    at: "00:31:43.933",
    title: "Coming up: I am also changing",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:31:43.933. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "II.B Impermanence of the Inner Sentient Beings",
    "Preparing to die peacefully, joyfully",
    { at: "00:31:43.933" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:38:50.933
  takeaways([
    "So this way we are preparing for our death — to die peacefully, joyfully. Sometimes we put so much attention on the bardo, like the instructions on what to do in the bardo, phowa and this and that. But if you are not prepared, these instructions will do nothing. So we have to prepare step by step.",
    "So here it tells us about how we will die. Sometimes death is threatening: “You will die.” “Oh, I don’t like that. This is scary.” But we have to prepare, prepare peacefully, joyfully, through the Dharma practice.",
    "Gampopa explains, *To meditate on death, one should think: “I myself cannot stay long in this world and will have to leave for the next life.”* So I have to prepare.",
    "But what does preparing for death mean? Contemplate this way: *Meditate on the characteristic of death by contemplating, “my life ends…”* At the time of death, what happens? This breath that I’m breathing will cease to exist, and *“… this body becomes a corpse.”* When the breath stops, this way a person is dead. And this mind leaves the body — *“…and this mind has to wander in different places.”* — dependent on the conditions. So meditate on this.",
    "So at that time, instead of my mind following the wrong direction — attachment, aversion — my mind maintains in the bodhicitta, my mind maintains within the Mahamudra. My mind maintains in the loving kindness: “May every sentient being have peace and happiness. May every sentient being be free from suffering. May they all achieve enlightenment, including people who don’t like me.” Everything is illusory nature. There’s nothing to attach… just a manifestation of causes and conditions. I maintain my mind in the peace. This is so precious. This is the best way of the transition of our death, and so impermanence is so precious.",
    "So this is the practice of impermanence, how to practice impermanence. Reflect your mind in this way."
  ], {
    at: "00:38:50.933",
    title: "Takeaways: Prepare step by step",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:38:50.933. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "There are details on the impermanence of sentient beings; you can read those. I don’t have to go through all the steps. But there’s one point: “I cherish this body so much. I sacrifice, I sacrifice many things for this body, but at the time of death I have to leave this body behind. All the negative karma that I have created to protect this body — when I die the body is left behind, but the karma that I made I have to carry life after life.”",
    "So instead of cherishing this body, attached to this body, utilize this body to practice bodhicitta, to practice the Dharma, and utilize this body to benefit others — how to help others. So these are some important points you can pick up from this impermanence.",
    "Then you’ll be so happy to help others, to benefit others. We all are impermanent; we will change, so relax the mind in that. Instead of being upset, being angry, just relax the mind and meditate on this, and then do all the things that you can do to help others, to help yourself, to meditate yourself."
  ], {
    at: "00:38:50.933",
    title: "Coming up: At death I leave this body behind",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:38:50.933. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "II.B Utilize this body to benefit others",
    "The power of contemplating impermanence",
    { at: "00:38:50.933" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:44:48.667
  takeaways([
    "This way, look at our mind. As mentioned, the habitual tendencies, the inveterate propensities, look so concrete, so stubborn, but their nature is impermanent, their nature is emptiness. So if I make the effort, I can do it, because they are impermanent.",
    "No matter how much I am so habituated in this samsaric habit, still their nature is impermanent, emptiness. So I can make it happen, to purify them. So this is the power of contemplating impermanence.",
    "Relax, meditate. This way you always feel so light, not much burden. Release all your burden and practice the Dharma, and especially bodhicitta.",
    "Instead of only focusing on this life, focus on enlightenment, on buddhahood. So, “I should use this body not only for this life’s enjoyment, but I should use this body for the enlightenment of all sentient beings.”",
    "So for this, reading the life stories of great masters is so precious, how they have practiced, how they have benefited sentient beings.",
    "So, as mentioned, it’s not just a religious training. Our inveterate mind of habits is so arrogant. So the training of the mind is so that we can break through this arrogant mind, make the mind flexible, make the mind like space.",
    "Impermanence has a lot of subjects there; you can read them, and as I mentioned, it’s so precious. Then look at this: whenever you see people dying, reflect, “One day it will also happen to me like this. I must practice Dharma.” Just reminding this, reminding again and again."
  ], {
    at: "00:44:48.667",
    title: "Takeaways: Make the mind flexible",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:44:48.667. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "So, through these practices of impermanence, then come the beneficial effects. Here: *“Awareness of the impermanence of all composite phenomena leads one to release attachment to this life.”*",
    "When we repeat this, meditate on this, then our attachment, our pernicious attachment, is purified, and the mind becomes spacious. And then that spacious mind has such a great opportunity to develop bodhicitta.",
    "*“Further, it nourishes faith,”* When you look at the impermanence of all phenomena, then our faith, our interest in enlightenment, becomes strong — not only for this life, but for enlightenment, to help others.",
    "*“…it supports perseverance,”*: life is impermanent, “I must practice. I cannot stay lazy.” In the morning you get up and do practice; in the evening you practice; during the daytime, do meditation practice as often as possible — because everything is impermanent.",
    "Even if you just watch the breath, relax, meditate, and contemplate everyone’s desire for peace and happiness — because of that, reflect on the loving kindness, compassion."
  ], {
    at: "00:44:48.667",
    title: "Coming up: A great opportunity",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:44:48.667. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "III. The beneficial effects",
    "Release attachment and hatred",
    { at: "00:44:48.667" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:49:08.667
  takeaways([
    "*“… and it quickly frees one from attachment and hatred.”* So through this mindfulness of impermanence, it helps us to release our attachment, our aversion, hatred. As earlier I mentioned, when this attachment and hatred are purified that’s the real peace that can be experienced in the mind.",
    "There are some individuals… very vicious to you. So if we are kind of vicious back to that individual, then our hatred mind brings a lot of pain, suffering: “How can I get rid of this person? How should I respond to this?”",
    "Instead, reflect: this person is so stupid, ignorant, doesn’t know how to handle, doesn’t know how to bring peace and happiness; he or she oneself is suffering so much. All these are impermanent, moment to moment changing, and that person doesn’t know how to do that.",
    "So you reflect about the suffering of that person and develop love and compassion, and all your mental suffering just disappears. That disappearing of that suffering is called the practice of emptiness."
  ], {
    at: "00:49:08.667",
    title: "Takeaways: Disappearing of suffering",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:49:08.667. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "There’s no “big thing” about emptiness. Everything stands within the emptiness. Everything functions within emptiness, manifests from emptiness, dissolves into emptiness. If you know this, are aware of this, then you can relax, meditate there, and appreciate Dharma.",
    "That’s why the relative state and the absolute are non-duality. We don’t make them non-duality, but their nature is within the non-duality. We make duality, and then we suffer. But if we have the wisdom to see how they function within the non-duality, the peace is in our hand.",
    "So this is the wisdom of the Buddha, the wisdom of Gampopa. So meditate on this. That’s why it says here, *“… it becomes a cause for the realization of the equal nature of all phenomena”* — that means emptiness.",
    "When you practice this way, step by step, then you see, as I mentioned, the impermanence of every second. Then you divide: past is past, future is future, and you cannot find now something permanent. That itself is emptiness.",
    "All this gross that we see, all the dust particles we see: if you divide, investigate through the intellect, it functions within the emptiness. Like, for example, the modern quantum physics theory. The scientists there have now proved, or they’ve realized, that all these dust particles are nothing but empty. But they don’t know how to meditate on them, so they got rid of it: “This is empty, now we cannot do anything. No use.”",
    "But for us, emptiness is the best thing we can use: “Yes, there’s nothing that functions independently; their nature is emptiness. There’s nothing to attach to, nothing to hate.” So that understanding itself is the wisdom. Through that wisdom, we get all the excellent opportunity to purify all the mental afflictions."
  ], {
    at: "00:49:08.667",
    title: "Coming up: The peace is in our hand",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:49:08.667. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "III. Equal nature of all phenomena",
    "Don’t treat impermanence as some small subject",
    { at: "00:49:08.667" }
  ),

  // "Some takeaways" keypoints stopping slide at 00:55:14.533
  takeaways([
    "Meditate, and that develops such great love and compassion, special insight, and it can really bring peace in the world. I wish all the great scientists realize that — how to meditate on emptiness — and bring peace in the world.",
    "So we follow that path, then life is beautiful with a precious human life. That is what makes life so precious. Instead of the center of the problems, instead of the center of all the suffering, the life becomes the center of the peace, happiness and joy to all others. This is what is called Dharma practice, and there you can practice the bodhicitta.",
    "So this big subject of impermanence, so many pages we have covered. Reflect on this, meditate, relax. Not just today, as mentioned, but in your daily life. In the morning, reflect on impermanence; meditate on loving kindness, compassion. In the evening, reflect on the bodhicitta; you go to sleep with the bodhicitta, or with all the other practices you have.",
    "But impermanence! Don’t treat impermanence as some small thing. Impermanence is so important, from the beginning to the end of your practice."
  ], {
    at: "00:55:14.533",
    title: "Takeaways: Life becomes the center of peace",
    buttonText: "Continue lesson"
  }),

  // "Coming up" keypoints stopping slide at 00:55:14.533. Shares the timestamp
  // with the takeaways above; slide priority shows those first.
  comingUp([
    "I usually repeat this life story of Milarepa. He had a clay pot. He was walking from one place to another, and his foot stepped on a piece of rock; he fell down, and the pot broke into pieces, unexpectedly.",
    "So that amazed Milarepa so much: “Oh, the pot I had just one second ago, now it’s in pieces here. This is all my collection of the world’s wealth.” He doesn’t have anything, only the pot, and that broke.",
    "Now, if it had happened to us, we would cry: “I’m so unfortunate. Generally I have nothing, but now my only pot is broken. How can I live? There’s nothing I can cook the nettles in.” Oh, we would cry, and then we are just outraged."
  ], {
    at: "00:55:14.533",
    title: "Coming up: The pot broke into pieces",
    buttonText: "Continue lesson"
  }),

  // Announcement banner at 00:55:14.533. Shares the timestamp with the
  // slides above; slide priority shows those first.
  announcement(
    "Milarepa’s broken clay pot",
    "From good or bad, we get good teachings",
    { at: "00:55:14.533" }
  ),

  // Closing "Some takeaways" keypoints stopping slide at 00:59:34.600, the end of
  // the video. Shares the timestamp with the closing slides below; slide
  // priority shows it first, then the thanks and dedication.
  takeaways([
    "But Milarepa was so appreciative, rejoicing in the profound teaching that he received from this: “All the wealth that I have, the pot, is now broken into pieces. This becomes such a profound, great teacher who gave me this profound teaching: everything is impermanent, especially this precious human life.”",
    "Before that, he had the sense, “This is my pot,” in his hand. When it broke, that sense in the mind disappeared; he released that attachment. The small attachment that Milarepa had totally vanished in that instant, and he received such a profound teaching. And that became such a powerful teacher.",
    "So we can all get lessons: from good or bad, we get good teachings like this. So we can sustain our practice by reflecting on impermanence. We can appreciate whatever we have through reflecting on impermanence. This precious human life that we have, every day we can utilize it in the best way, not wasting it.",
    "Whether you are walking, whether you are eating, whether you are sleeping, any time, reflect on impermanence. Then we can practice the Dharma — so precious.",
    "So now, thank you, thank you everybody, thank you so much. Tomorrow we’ll reflect on suffering and karma, cause and effect. Now please take a deep breath, and then say some dedication prayer."
  ], {
    at: "00:59:34.600",
    title: "Takeaways: Reflect on impermanence any time",
    buttonText: "Continue lesson"
  }),

  // Final closing stopping slide at 00:59:34.600, just before the video ends.
  finalSlide("Thank you everybody", {
    at: "00:59:34.600"
  }),

  // Dedication at 00:59:34.600, closing the session (the video ends here).
  // Slide priority shows it after the thanks.
  dedication("slides/dedication.webp", {
    at: "00:59:34.600",
    audio: "audio/dedication.mp3"
  })
];

/** The lesson descriptor consumed by the player engine. */
export const lesson = {
  id: 'jewel-ornament-07',
  name: 'Impermanence',
  title: 'Khenchen Rinpoche',
  subtitle: 'Teachings on the Jewel Ornament of Liberation',
  videoId: VIDEO_ID,
  slideBg: SLIDE_BG,
  segments: SEGMENTS,
  slides: SLIDES,

  // Third-party works shown in this teaching, listed under the segments.
  credits: [WATER_DROP_ON_THE_LAKE, JEWEL_ORNAMENT_QUOTES],

  // Printable copy of the slide bullet points, offered from the control bar.
  handout: {
    file: 'handouts/jewel-ornament-07-points-to-remember.pdf',
    label: 'Some takeaways',
    filename: 'Jewel Ornament of Liberation - Impermanence - Some takeaways.pdf'
  }
};

export default lesson;
export { VIDEO_ID, SLIDE_BG, SEGMENTS, SLIDES };

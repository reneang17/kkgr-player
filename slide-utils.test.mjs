/**
 * slide-utils.test.mjs
 * Focused checks on the slide factories' descriptor contract.
 *
 * The factories are pure functions returning plain data, so they are testable
 * without a browser. This file covers the parts a lesson author depends on and
 * that the engine assumes — especially the gating flags on image slides, where
 * getting `once` wrong makes the refuge slide re-trigger forever.
 *
 * No dependencies. Run with:  node slide-utils.test.mjs
 */

import { announcement, comingUp, takeaways, finalSlide, imageSlide, refuge, dedication }
  from './slide-utils/index.js';

let failures = 0;
let checks = 0;

function check(name, condition, detail) {
  checks++;
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name}${detail ? '  -> ' + detail : ''}`);
  }
}

console.log('slide factories\n');

/* ---- No factory may emit a typography size ----
   Inline sizes override the layout model. This has been the cause of two
   separate regressions; see CLAUDE.md invariant 1. */
const everySlide = [
  announcement('Red', 'Black', { at: '0:29' }),
  comingUp(['a', 'b'], { at: '1:00' }),
  takeaways(['a', 'b'], { at: '2:00' }),
  finalSlide('Thanks', { at: '3:00' }),
  imageSlide('slides/x.png', { at: '4:00' }),
  refuge('slides/refuge.png'),
  dedication('slides/dedication.png', { at: '5:00' })
];
const sizeKeys = ['titleSize', 'bulletSize', 'redSize', 'blackSize'];
const withRemSizes = everySlide.filter(s =>
  sizeKeys.some(k => typeof s[k] === 'string' && s[k].includes('rem')));
check('no factory emits a rem-based font size by default',
  withRemSizes.length === 0,
  withRemSizes.map(s => s.kind).join(', '));

/* ---- Image slides carry no text ---- */
const ref = refuge('slides/refuge.png');
const ded = dedication('slides/dedication.png', { at: '00:53:32.933' });

check('refuge has no bullets', Array.isArray(ref.bullets) && ref.bullets.length === 0);
check('dedication has no bullets', Array.isArray(ded.bullets) && ded.bullets.length === 0);
check('image slide points at its artwork', ref.bg === 'slides/refuge.png');
check('image artwork is not cropped by default (it is lesson content)',
  ref.imageFit === 'contain' && ded.imageFit === 'contain',
  `${ref.imageFit} / ${ded.imageFit}`);
check('image slides pause the video', ref.pause === true && ded.pause === true);
check('image slides have no auto-continue timer (no text to time)',
  ref.duration === null && ded.duration === null,
  `${ref.duration} / ${ded.duration}`);

/* ---- Gating ----
   The refuge slide is offered in the segments list, not fired by the timeline:
   a viewer who simply presses play goes straight into the teaching. */
check('refuge is opened from the segments list, not the timeline',
  ref.openFromSegment === true);
check('refuge supplies a segment label', ref.segmentTitle === 'Refuge');
check('refuge is never fired by the timeline', ref.onTimeline === false);
check('dedication is reached by the teaching at its timestamp',
  ded.onTimeline === true && ded.at === '00:53:32.933');
check('dedication is ALSO offered in the segments list',
  ded.openFromSegment === true && ded.segmentTitle === 'Dedication');
check('listing a slide as a segment does not remove it from the timeline',
  imageSlide('slides/x.png', { at: '1:00', openFromSegment: true }).onTimeline === true);
check('a plain image slide is timeline-driven and unlisted by default',
  imageSlide('slides/x.png', { at: '1:00' }).openFromSegment === false &&
  imageSlide('slides/x.png', { at: '1:00' }).onTimeline === true);
check('segment label falls back to the slide title',
  imageSlide('slides/x.png', { openFromSegment: true, title: 'Praises' }).segmentTitle === 'Praises');
check('the old atStart gating is gone',
  ref.atStart === undefined && ref.once === undefined);

/* ---- Chant recordings ----
   Optional per slide. The engine shows the chant button only when `audio` is
   set, so every other archetype must leave it undefined. */
const refugeWithChant = refuge('slides/refuge.webp', { audio: 'audio/refuge.mp3' });
const dedWithChant = dedication('slides/dedication.webp',
  { at: '00:53:32.933', audio: 'audio/dedication.mp3' });

check('a chant recording is carried on the slide descriptor',
  refugeWithChant.audio === 'audio/refuge.mp3' && dedWithChant.audio === 'audio/dedication.mp3');
check('each slide can carry a different recording',
  refugeWithChant.audio !== dedWithChant.audio);
check('image slides have no chant unless one is given',
  refuge('slides/refuge.webp').audio === null &&
  imageSlide('slides/x.png', { at: '1:00' }).audio === null);
check('chant button has a default label', refugeWithChant.audioLabel === 'Play chant');
check('chant label can be overridden',
  imageSlide('slides/x.png', { audio: 'a.mp3', audioLabel: 'Hear it chanted' }).audioLabel
    === 'Hear it chanted');
check('bullet archetypes carry no chant',
  [comingUp(['a']), takeaways(['a']), finalSlide('x'), announcement('a', 'b')]
    .every(s => s.audio === undefined));

/* ---- Distinct kinds, so slide priority can order them ---- */
check('refuge and dedication have distinct kinds',
  ref.kind === 'refuge' && ded.kind === 'dedication');
check('image slides carry an accessible title even though none is rendered',
  ref.title === 'Refuge' && ded.title === 'Dedication');

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures === 0 ? 0 : 1);

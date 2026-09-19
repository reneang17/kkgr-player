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
   The refuge slide is gated on playback starting, and must never re-arm: the
   engine resumes playback when the viewer continues, and a re-arming start
   slide would re-open immediately and the lesson could never begin. */
check('refuge is gated on playback starting, not a timestamp', ref.atStart === true);
check('refuge never re-arms', ref.once === true);
check('dedication is gated on its timestamp', ded.atStart === false && ded.at === '00:53:32.933');
check('dedication re-arms normally on rewind', ded.once === false);
check('a plain image slide is not a start slide by default',
  imageSlide('slides/x.png', { at: '1:00' }).atStart === false);
check('atStart implies once unless overridden',
  imageSlide('slides/x.png', { atStart: true }).once === true);
check('once can be overridden explicitly',
  imageSlide('slides/x.png', { atStart: true, once: false }).once === false);

/* ---- Distinct kinds, so slide priority can order them ---- */
check('refuge and dedication have distinct kinds',
  ref.kind === 'refuge' && ded.kind === 'dedication');
check('image slides carry an accessible title even though none is rendered',
  ref.title === 'Refuge' && ded.title === 'Dedication');

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures === 0 ? 0 : 1);

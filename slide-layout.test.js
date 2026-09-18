/**
 * slide-layout.test.js
 * Focused checks on the slide layout model's typographic constraints.
 *
 * These cover the parts of the model that are pure arithmetic and therefore
 * testable without a browser: the typography ladder, its bounds, its
 * monotonicity, and the preservation of visual hierarchy. The measurement half
 * of the model (does this content fit?) needs real text layout and is exercised
 * in the browser instead.
 *
 * This repository has no test runner, so this file deliberately has no
 * dependencies. Run it with:
 *
 *     node slide-layout.test.js
 */

'use strict';

const path = require('path');

// slide-layout.js installs itself on the global object it is handed.
global.window = undefined;
const L = require(path.join(__dirname, 'slide-layout.js'));

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

function num(vars, key) {
  return parseFloat(vars[key]);
}

console.log('slide layout model\n');

/* ---- The design canvas ---- */
check('design canvas is 16:9', Math.abs(L.DESIGN.width / L.DESIGN.height - 16 / 9) < 1e-9,
  `${L.DESIGN.width}x${L.DESIGN.height}`);

/* ---- Preferred typography reproduces the reference design ----
   The reference laptop design was authored in container units against the 16:9
   player box (1cqw = 1% of player width). On the 1600px logical canvas that is
   16 logical px per cqw. */
const preferred = L.typographyFor(L.FIT_MAX);
check('preferred body size matches the reference 2.55cqw design',
  Math.abs(num(preferred, '--slide-body-size') - 2.55 * 16) < 1,
  `${num(preferred, '--slide-body-size')} vs ${2.55 * 16}`);
check('preferred heading size matches the reference 4.8cqw design',
  Math.abs(num(preferred, '--slide-heading-size') - 4.8 * 16) < 1,
  `${num(preferred, '--slide-heading-size')} vs ${4.8 * 16}`);
check('preferred step applies no spacing compression',
  Math.abs(num(preferred, '--slide-bullet-gap') - L.TOKENS.bulletGap) < 0.01);
check('preferred line-height is the relaxed maximum',
  Math.abs(num(preferred, '--slide-body-line-height') - L.TOKENS.bodyLineHeightMax) < 0.001);

/* ---- The readability floor ---- */
const floor = L.typographyFor(L.FIT_MIN);
const floorBody = num(floor, '--slide-body-size');

check('floor body size never drops below 28 logical px', floorBody >= 28, `${floorBody}`);
check('floor body size is at least 3% of slide height',
  floorBody / L.DESIGN.height >= 0.03,
  `${(floorBody / L.DESIGN.height * 100).toFixed(2)}%`);
check('floor is not below the previously approved dense design (1.85cqw)',
  floorBody >= 1.85 * 16 - 1.5, `${floorBody} vs ${1.85 * 16}`);
check('floor line-height stays readable (>= 1.2)',
  num(floor, '--slide-body-line-height') >= 1.2,
  `${num(floor, '--slide-body-line-height')}`);
check('floor keeps some bullet separation', num(floor, '--slide-bullet-gap') > 0);

/* ---- Bounds: short slides cannot grow, long slides cannot vanish ---- */
check('typography never exceeds the preferred step',
  num(L.typographyFor(L.FIT_MAX), '--slide-body-size') === L.TOKENS.bodySize);
check('the ladder spans a controlled range, not an open-ended shrink',
  L.FIT_MIN >= 0.6 && L.FIT_MIN < L.FIT_MAX, `FIT_MIN=${L.FIT_MIN}`);
check('total shrink from preferred to floor is at most 30%',
  1 - floorBody / L.TOKENS.bodySize <= 0.3 + 1e-9,
  `${((1 - floorBody / L.TOKENS.bodySize) * 100).toFixed(1)}%`);

/* ---- Monotonicity: required for the bisection search to be correct ---- */
let monotonicBody = true;
let monotonicGap = true;
let monotonicLine = true;
let hierarchyConstant = true;
const ratio0 = num(L.typographyFor(L.fitAt(0)), '--slide-heading-size') /
               num(L.typographyFor(L.fitAt(0)), '--slide-body-size');

for (let i = 1; i <= L.STEP_COUNT; i++) {
  const prev = L.typographyFor(L.fitAt(i - 1));
  const cur = L.typographyFor(L.fitAt(i));
  if (!(num(cur, '--slide-body-size') > num(prev, '--slide-body-size'))) monotonicBody = false;
  if (!(num(cur, '--slide-bullet-gap') > num(prev, '--slide-bullet-gap'))) monotonicGap = false;
  if (!(num(cur, '--slide-body-line-height') > num(prev, '--slide-body-line-height'))) monotonicLine = false;
  const ratio = num(cur, '--slide-heading-size') / num(cur, '--slide-body-size');
  if (Math.abs(ratio - ratio0) > 0.01) hierarchyConstant = false;
}

check('body size increases strictly with the fit parameter', monotonicBody);
check('bullet spacing increases strictly with the fit parameter', monotonicGap);
check('line-height increases strictly with the fit parameter', monotonicLine);
check('heading/body ratio is constant across every step (hierarchy preserved)',
  hierarchyConstant, `ratio=${ratio0.toFixed(3)}`);

/* ---- Spacing is spent before legibility ----
   Across the ladder, whitespace must compress proportionally more than type,
   so crowded slides lose air rather than readable letterforms. */
const bodyDrop = 1 - floorBody / L.TOKENS.bodySize;
const gapDrop = 1 - num(floor, '--slide-bullet-gap') / L.TOKENS.bulletGap;
check('spacing compresses faster than type', gapDrop > bodyDrop,
  `gap -${(gapDrop * 100).toFixed(0)}% vs type -${(bodyDrop * 100).toFixed(0)}%`);

/* ---- Search grid ---- */
check('grid index 0 is the readability floor', Math.abs(L.fitAt(0) - L.FIT_MIN) < 1e-9);
check('top grid index is the preferred step', Math.abs(L.fitAt(L.STEP_COUNT) - L.FIT_MAX) < 1e-9);
check('grid is fine enough to avoid visible jumps (>= 10 steps)', L.STEP_COUNT >= 10,
  `${L.STEP_COUNT} steps`);
check('bisection terminates within a small number of measurements',
  Math.ceil(Math.log2(L.STEP_COUNT + 1)) <= 5,
  `${Math.ceil(Math.log2(L.STEP_COUNT + 1))} measurements`);

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures === 0 ? 0 : 1);

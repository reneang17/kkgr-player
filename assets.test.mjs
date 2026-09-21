/**
 * assets.test.mjs
 * Checks that every asset a lesson references actually exists — in both places
 * it has to exist.
 *
 * `public/<path>` is what the dev server and the production build serve.
 * `<path>` at the repo root is what the deployed site serves, because GitHub
 * Pages publishes the repository rather than `dist/` (see CLAUDE.md invariant 8).
 *
 * Missing the root copy is invisible locally and fatal in production: that is
 * exactly how the chant recordings shipped working on `npm run dev` and 404ing
 * on the live site. This test is here so that cannot happen again quietly.
 *
 * No dependencies. Run with:  node assets.test.mjs
 */

import { existsSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS } from './lessons/index.js';

const ROOT = dirname(fileURLToPath(import.meta.url));

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

/** Every relative asset path a lesson descriptor points at. */
function assetPathsOf(lesson) {
  const paths = new Set();
  const add = (p) => { if (typeof p === 'string' && p && !/^(https?:)?\/\//.test(p)) paths.add(p); };

  add(lesson.slideBg);
  if (lesson.handout) add(lesson.handout.file);
  (lesson.slides || []).forEach((slide) => {
    add(slide.bg);
    add(slide.audio);
  });
  return [...paths];
}

console.log('lesson assets\n');

for (const [id, lesson] of Object.entries(LESSONS)) {
  const paths = assetPathsOf(lesson);
  check(`${id}: references at least one asset`, paths.length > 0, `${paths.length} found`);

  for (const rel of paths) {
    const served = join(ROOT, 'public', rel);   // dev server + vite build
    const deployed = join(ROOT, rel);           // the published repository

    const servedOk = existsSync(served);
    const deployedOk = existsSync(deployed);

    check(`${rel} exists in public/`, servedOk);
    check(`${rel} exists at the repo root (deployed site)`, deployedOk,
      deployedOk ? '' : 'present in public/ only — this 404s in production');

    if (servedOk && deployedOk) {
      const a = statSync(served).size;
      const b = statSync(deployed).size;
      check(`${rel} copies are the same size`, a === b, `${a} vs ${b}`);
      if (a === b && a < 5 * 1024 * 1024) {
        check(`${rel} copies are byte-identical`,
          readFileSync(served).equals(readFileSync(deployed)));
      }
    }
  }
}

console.log(`\n${checks - failures}/${checks} checks passed`);
process.exit(failures === 0 ? 0 : 1);

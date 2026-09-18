/**
 * slide-utils/coming-up.js
 * "Coming up" stopping slide: full-bleed artwork, centred type, no card.
 * Pauses the video until the viewer continues.
 */

import { DEFAULT_WPM, calculateReadingDuration, normalizeSlideArgs } from './reading-time.js';

/**
 * Creates a "Coming up" stopping slide.
 *
 * Accepts comingUp(bullets, config), comingUp(title, bullets, config)
 * or comingUp({ title, bullets, ... }).
 *
 * Note: titleSize / bulletSize are intentionally null. Typography is owned by
 * the slide layout model (slide-layout.js), which measures the rendered content
 * and picks a size for it. Setting either explicitly opts this slide out of
 * fitting — an escape hatch, not the normal path.
 *
 * @returns {Object} stopping slide descriptor
 */
export function comingUp(bullets, options = {}, extraOptions = {}) {
  const { title, bullets: bulletList, config } =
    normalizeSlideArgs(bullets, options, extraOptions, 'Coming up');

  const wpm = typeof config.wpm === 'number' ? config.wpm : DEFAULT_WPM;

  return {
    kind: 'coming-up',
    at: config.at || '00:03:05.000',
    title,
    bullets: bulletList,
    duration: typeof config.duration === 'number'
      ? config.duration
      : calculateReadingDuration(title, bulletList, wpm, 8),
    wpm,
    bg: config.bg || 'slides/coming-up-bg.png',
    font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
    buttonText: config.buttonText || 'Continue lesson',
    titleSize: config.titleSize || null,
    bulletSize: config.bulletSize || null,
    revealAll: config.revealAll !== undefined ? config.revealAll : true,
    pause: true,
    align: config.align || 'center'
  };
}

export const makeComingUp = comingUp;

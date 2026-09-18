/**
 * slide-utils/takeaways.js
 * "Some takeaways" stopping slide: bullets inside a translucent frosted card
 * over the artwork. Pauses the video until the viewer continues.
 */

import { DEFAULT_WPM, calculateReadingDuration, normalizeSlideArgs } from './reading-time.js';

/**
 * Creates a "Some takeaways" stopping slide.
 *
 * Accepts takeaways(bullets, config), takeaways(title, bullets, config)
 * or takeaways({ title, bullets, ... }).
 *
 * Note: titleSize / bulletSize are intentionally null — see comingUp().
 *
 * @returns {Object} stopping slide descriptor
 */
export function takeaways(bullets, options = {}, extraOptions = {}) {
  const { title, bullets: bulletList, config } =
    normalizeSlideArgs(bullets, options, extraOptions, 'Some takeaways');

  const wpm = typeof config.wpm === 'number' ? config.wpm : DEFAULT_WPM;

  return {
    kind: 'takeaways',
    at: config.at || '00:17:48.233',
    title,
    bullets: bulletList,
    duration: typeof config.duration === 'number'
      ? config.duration
      : calculateReadingDuration(title, bulletList, wpm, 8),
    wpm,
    bg: config.bg || 'slides/takeaways-bg.png',
    font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
    boxBg: config.boxBg || 'rgba(96, 145, 149, 0.50)',
    boxPadding: config.boxPadding || null,
    boxMaxWidth: config.boxMaxWidth || null,
    buttonText: config.buttonText || 'Continue lesson',
    titleSize: config.titleSize || null,
    bulletSize: config.bulletSize || null,
    revealAll: config.revealAll !== undefined ? config.revealAll : true,
    pause: true,
    align: 'center'
  };
}

export const someTakeaways = takeaways;
export const makeTakeaways = takeaways;

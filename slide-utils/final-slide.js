/**
 * slide-utils/final-slide.js
 * Closing stopping slide: one large centred line over the artwork.
 */

/**
 * Creates a final/closing stopping slide.
 *
 * @param {string|Object} [titleOrConfig="Thanks for watching!"]
 * @param {Object} [options]
 * @returns {Object} stopping slide descriptor
 */
export function finalSlide(titleOrConfig = 'Thanks for watching!', options = {}) {
  let title = 'Thanks for watching!';
  let config = {};

  if (typeof titleOrConfig === 'string') {
    title = titleOrConfig;
    config = options || {};
  } else if (typeof titleOrConfig === 'object' && titleOrConfig !== null) {
    config = titleOrConfig;
    title = config.title || title;
  }

  return {
    kind: 'final',
    at: config.at || '00:53:32.933',
    title,
    bullets: config.bullets || [],
    duration: typeof config.duration === 'number' ? config.duration : 12,
    bg: config.bg || 'slides/coming-up-bg.png',
    font: config.font || "'Crimson Pro', 'Lora', Georgia, serif",
    buttonText: config.buttonText || 'Finish lesson',
    titleSize: config.titleSize || null,
    align: 'center',
    pause: true,
    revealAll: true,
    ...config
  };
}

export const makeFinalSlide = finalSlide;
export const closingSlide = finalSlide;
export const thanksSlide = finalSlide;

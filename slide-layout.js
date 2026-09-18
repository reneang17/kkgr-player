/**
 * slide-layout.js
 * Keypoint slide layout model: content fitting + uniform viewport scaling.
 *
 * Two separate responsibilities, deliberately decoupled:
 *
 *   1. FIT  — Lay the slide out on a fixed logical canvas (DESIGN.width x DESIGN.height)
 *             and choose one typography step that makes the content fit the usable
 *             content height, searching only between a preferred and a minimum
 *             (readability floor) typographic scale. Runs once per slide, and is
 *             completely independent of the viewport, so it is deterministic:
 *             the same slide always yields the same typography.
 *
 *   2. SCALE — Fit the finished logical canvas into whatever area the player
 *             currently occupies with a single uniform transform, exactly the way
 *             Reveal.js scales a deck or a PDF viewer scales a page:
 *                 scale = min(availableWidth / designWidth, availableHeight / designHeight)
 *             Runs on every resize / fullscreen / orientation change. It never
 *             changes typography, so nothing reflows and nothing jumps.
 *
 * Everything the visual design depends on lives in the TOKENS block below, expressed
 * in logical pixels on the design canvas. Nothing else in the codebase should contain
 * a slide typography number.
 */

(function (global) {
  'use strict';

  /* ======================================================================
     DESIGN TOKENS
     Logical pixels on a 1600 x 900 canvas.

     These are the existing, hand-tuned laptop design translated 1:1. The old
     stylesheet expressed the same design in container-query units against the
     16:9 player box, where 1cqw = 1% of the player width. On a 1600px-wide
     logical canvas that makes 1cqw = 16 logical px, so e.g. the old heading of
     4.8cqw becomes 4.8 * 16 = 76.8 -> 77 logical px. Rendered at the reference
     960px-wide laptop player the result is pixel-identical to the old design.
     ====================================================================== */

  const DESIGN = {
    width: 1600,
    height: 900
  };

  const TOKENS = {
    /* Slide padding (safe area inside the 16:9 frame) */
    padX: 77,            // was 4.8cqw
    padTop: 48,          // was 3.0cqw
    padBottom: 29,       // was 1.8cqw

    /* Typography at the PREFERRED (fit = 1) step */
    headingSize: 77,     // was 4.8cqw
    headingLineHeight: 1.22,
    headingMarginBottom: 14,

    bodySize: 41,        // was 2.55cqw
    bodyLineHeightMax: 1.42,
    bodyLineHeightMin: 1.24,

    /* Bullet list */
    bulletGap: 18,       // was 1.1cqw
    bulletIndent: 35,    // was 2.2cqw

    /* Translucent panel ("Some takeaways" frosted card) */
    boxPadY: 32,         // was 2.0cqw
    boxPadX: 48,         // was 3.0cqw
    boxRadius: 10,       // was 0.6cqw
    boxMaxWidthPct: 78,

    /* Label chip */
    labelSize: 22,
    labelMarginBottom: 13,

    /* Vertical breathing room reserved between content and the footer UI */
    footerGap: 16,

    /* Title-safe inset, in logical px, kept clear at each side of the heading.
       Slide artwork may carry a mark in a top corner — coming-up-bg.png has the
       lineage logo at roughly x 0.90-0.97 of its width — and a long centred
       heading would otherwise run underneath it. Measured from that artwork:
       the logo's left edge sits at ~1445 logical px, the content box ends at
       1523, so 78px is the minimum; 90 leaves a little clearance.
       Applied symmetrically so the heading stays centred. */
    headingSafeInset: 90
  };

  /* ======================================================================
     FITTING CONSTRAINTS

     The fit is a single parameter `f` (the typographic scale) searched between
     FIT_MIN and FIT_MAX. Font sizes scale linearly with `f`; spacing collapses
     faster than type, so a crowded slide loses whitespace before it loses
     readable letterforms. That ordering is what the old two-state "is-dense"
     class approximated, expressed here as a continuum instead of a breakpoint.

     FIT_MIN is the readability floor and is the single most important number
     here. It is set so that body text never renders below MIN_BODY_SIZE logical
     px (41 * 0.70 = 28.7). Rationale for 28/900:

       - It reproduces the previously hand-tuned and design-approved "dense"
         step (the old .is-dense rule used 1.85cqw = 29.6 logical px), so the
         floor is a value this design has already accepted as readable.
       - At that size, with the tightened line-height, the usable content region
         holds roughly 15 lines of body text. A keypoint slide that needs more
         than ~15 lines is a content problem, not a layout problem.
       - Expressed as a share of slide height it is 28/900 = 3.1%, comparable to
         a 28pt body on a 16:9 deck, which is the usual floor in presentation
         style guides.

     To tune the system, change FIT_MIN (or the tokens above). Nothing else.
     ====================================================================== */

  const FIT_MAX = 1.00;          // preferred typography
  const FIT_MIN = 0.70;          // readability floor  -> body 28.7 logical px
  const FIT_STEP = 0.02;         // search granularity; keeps results stable & deterministic
  const SPACING_MIN = 0.35;      // spacing multiplier at the readability floor

  /** Number of discrete steps between the floor and the preferred typography. */
  const STEP_COUNT = Math.round((FIT_MAX - FIT_MIN) / FIT_STEP);

  /* ----------------------------------------------------------------------
     HEADING FIT

     A separate, narrower search than the body fit. Slide titles vary far more
     in length than in line count ("Coming Up" vs "Coming Up, Introduction —
     Written by Gampopa"), so a long title is shrunk to keep it on ONE line
     within the title-safe width, rather than being allowed to wrap and eat the
     body's vertical space.

     This multiplies the body fit rather than replacing it, so a heading is
     never larger than the typographic step the slide as a whole is using.

     If a title cannot fit on one line even at HEADING_FIT_MIN, it is allowed to
     wrap instead — shrinking further would make the title smaller than the body
     text and invert the hierarchy.
     ---------------------------------------------------------------------- */
  const HEADING_FIT_MAX = 1.00;
  const HEADING_FIT_MIN = 0.62;
  const HEADING_FIT_STEP = 0.02;
  const HEADING_STEP_COUNT = Math.round((HEADING_FIT_MAX - HEADING_FIT_MIN) / HEADING_FIT_STEP);

  /** Grid index (0 = smallest allowed heading, HEADING_STEP_COUNT = full size). */
  function headingFitAt(index) {
    return HEADING_FIT_MIN + (index * (HEADING_FIT_MAX - HEADING_FIT_MIN)) / HEADING_STEP_COUNT;
  }

  /** Grid index (0 = readability floor, STEP_COUNT = preferred) -> fit parameter. */
  function fitAt(index) {
    return FIT_MIN + (index * (FIT_MAX - FIT_MIN)) / STEP_COUNT;
  }

  /* ======================================================================
     VIEWPORT SCALING CONSTRAINTS
     ====================================================================== */

  const MIN_SCALE = 0.05;
  const MAX_SCALE = 4;

  /* ======================================================================
     DERIVED TYPOGRAPHY
     ====================================================================== */

  /**
   * Maps the single fit parameter `f` onto the full set of CSS custom properties
   * that drive the slide. Font sizes track `f` directly; spacing and line-height
   * ride a steeper curve so whitespace is spent before legibility is.
   */
  function typographyFor(f) {
    const t = (f - FIT_MIN) / (FIT_MAX - FIT_MIN);        // 0 at the floor, 1 at preferred
    const spacing = SPACING_MIN + (1 - SPACING_MIN) * t;
    const bodyLineHeight =
      TOKENS.bodyLineHeightMin +
      (TOKENS.bodyLineHeightMax - TOKENS.bodyLineHeightMin) * t;

    return {
      '--slide-fit': f.toFixed(3),
      '--slide-heading-size': px(TOKENS.headingSize * f),
      '--slide-heading-line-height': TOKENS.headingLineHeight.toFixed(3),
      '--slide-heading-margin': px(TOKENS.headingMarginBottom * spacing),
      '--slide-body-size': px(TOKENS.bodySize * f),
      '--slide-body-line-height': bodyLineHeight.toFixed(3),
      '--slide-bullet-gap': px(TOKENS.bulletGap * spacing),
      '--slide-bullet-indent': px(TOKENS.bulletIndent * f),
      '--slide-box-pad-y': px(TOKENS.boxPadY * spacing),
      '--slide-box-pad-x': px(TOKENS.boxPadX * f),
      '--slide-label-size': px(TOKENS.labelSize * f),
      '--slide-label-margin': px(TOKENS.labelMarginBottom * spacing),
      '--slide-heading-safe-inset': px(TOKENS.headingSafeInset)
    };
  }

  function px(v) {
    return Math.round(v * 100) / 100 + 'px';
  }

  function applyVars(el, vars) {
    for (const key in vars) {
      el.style.setProperty(key, vars[key]);
    }
  }

  /* ======================================================================
     SLIDE LAYOUT CONTROLLER
     ====================================================================== */

  /**
   * @param {Object} refs
   *   @param {HTMLElement} refs.stage    - the 16:9 player stage (the available area)
   *   @param {HTMLElement} refs.canvas   - the fixed logical canvas that gets scaled
   *   @param {HTMLElement} refs.content  - the region the content must fit inside
   *   @param {HTMLElement} [refs.heading] - the slide title, fitted to one line
   *   @param {HTMLElement} [refs.footer] - player UI overlaying the bottom of the canvas
   */
  function createSlideLayout(refs) {
    const { stage, canvas, content, footer, heading } = refs;

    let currentScale = 1;
    let reservedFooterLogical = 0;
    let frame = null;
    let active = false;
    let lastFit = null;
    let lastHeadingFit = null;

    /* ---------- 2. Uniform viewport scaling ---------- */

    function measureScale() {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return currentScale;
      const s = Math.min(rect.width / DESIGN.width, rect.height / DESIGN.height);
      return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
    }

    function applyScale() {
      currentScale = measureScale();
      // Written on the stage rather than the slide canvas: custom properties
      // inherit, so every overlay that composites on the same logical canvas
      // (the stopping slide, the announcement banner) shares one scale and
      // stays in lockstep with the video frame.
      stage.style.setProperty('--slide-scale', String(currentScale));
    }

    /**
     * The footer ("Continue lesson") is player UI rather than part of the scaled
     * composition: it keeps a readable, tappable size on small players instead of
     * shrinking with the slide. Because it visually overlays the bottom of the
     * canvas, the space it occupies has to be converted back into logical units
     * and subtracted from the usable content height. That is what guarantees the
     * button can never cover slide text at any player size.
     */
    function measureFooterReserve() {
      if (!footer) return 0;
      const h = footer.getBoundingClientRect().height;
      if (!h || !currentScale) return 0;
      return h / currentScale + TOKENS.footerGap;
    }

    function usableContentHeight() {
      return DESIGN.height - TOKENS.padTop - TOKENS.padBottom - reservedFooterLogical;
    }

    /* ---------- 1. Content fitting ---------- */

    function overflows() {
      // scrollHeight/clientHeight are untransformed layout values, so this
      // measurement is unaffected by the canvas scale.
      return content.scrollHeight > content.clientHeight + 1;
    }

    function tryFit(f) {
      applyVars(canvas, typographyFor(f));
      // Reading scrollHeight forces the pending layout, so no explicit flush needed.
      return !overflows();
    }

    /**
     * True when the title cannot sit on one line inside the title-safe width.
     * scrollWidth/clientWidth are untransformed layout values, so this is
     * unaffected by the canvas scale.
     */
    function headingOverflows() {
      return heading.scrollWidth > heading.clientWidth + 1;
    }

    /**
     * Shrinks the title until it fits on one line within the title-safe width,
     * so a long heading never runs under a mark in the artwork's top corner and
     * never steals vertical space from the bullets by wrapping.
     *
     * Measured at the PREFERRED body step: the body fit that runs afterwards can
     * only scale the heading down further, never up, so a title that fits here
     * still fits at the end.
     *
     * @returns {{fit:number, wrapped:boolean}}
     */
    function fitHeading() {
      if (!heading || !heading.textContent.trim()) {
        canvas.style.setProperty('--slide-heading-fit', '1');
        canvas.style.setProperty('--slide-heading-wrap', 'normal');
        return { fit: 1, wrapped: false };
      }

      applyVars(canvas, typographyFor(FIT_MAX));
      canvas.style.setProperty('--slide-heading-wrap', 'nowrap');
      canvas.style.setProperty('--slide-heading-fit', '1');

      if (!headingOverflows()) {
        return { fit: HEADING_FIT_MAX, wrapped: false };
      }

      // Same integer-grid bisection as the body fit: terminates, and is
      // reproducible rather than dependent on float noise.
      let lo = 0;
      let hi = HEADING_STEP_COUNT;   // known not to fit
      let best = null;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        canvas.style.setProperty('--slide-heading-fit', String(headingFitAt(mid)));
        if (!headingOverflows()) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      if (best === null) {
        // Too long even at the floor: let it wrap rather than shrink the title
        // below the body text and invert the hierarchy.
        canvas.style.setProperty('--slide-heading-fit', String(HEADING_FIT_MIN));
        canvas.style.setProperty('--slide-heading-wrap', 'normal');
        return { fit: HEADING_FIT_MIN, wrapped: true };
      }

      const chosen = headingFitAt(best);
      canvas.style.setProperty('--slide-heading-fit', String(chosen));
      return { fit: chosen, wrapped: false };
    }

    /**
     * Chooses the largest typography step that fits.
     *
     * The search runs over an integer grid of STEP_COUNT steps between FIT_MIN and
     * FIT_MAX (integer indices rather than floats, so the loop always terminates
     * and the result is reproducible). Content height is monotonic in `f`, so
     * bisection finds the exact largest fitting step in ~log2(STEP_COUNT)
     * measurements — four for the default 15-step grid.
     *
     * @returns {{fit:number, overflow:boolean, steps:number}}
     */
    function fitContent() {
      content.style.height = usableContentHeight() + 'px';

      // The title is sized first. It does not depend on the body, and settling it
      // up front means the body fit measures the heading's final height.
      const headingResult = fitHeading();
      lastHeadingFit = headingResult;

      let steps = 1;
      if (tryFit(FIT_MAX)) {
        return { fit: FIT_MAX, overflow: false, steps };
      }

      // Invariant: index `hi` is known NOT to fit; `best` is the largest index
      // known to fit (null until one is found).
      let lo = 0;                  // FIT_MIN
      let hi = STEP_COUNT;         // FIT_MAX, just proven not to fit
      let best = null;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;          // always in [lo, hi-1], so hi strictly shrinks
        steps++;
        if (tryFit(fitAt(mid))) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      if (best === null) {
        // Not even the readability floor fits: hold the floor and report it.
        steps++;
        tryFit(FIT_MIN);
        return { fit: FIT_MIN, overflow: true, steps };
      }

      const chosen = fitAt(best);
      applyVars(canvas, typographyFor(chosen));
      return { fit: chosen, overflow: false, steps };
    }

    /* ---------- Public API ---------- */

    /**
     * Lay out a slide that has just been populated in the DOM.
     * Call after the bullets/heading have been written.
     *
     * @param {Object} [meta] - slide metadata, used only for diagnostics
     * @returns {{fit:number, overflow:boolean, capacity:number}}
     */
    function layout(meta) {
      active = true;
      applyScale();
      reservedFooterLogical = measureFooterReserve();

      const result = fitContent();
      lastFit = result;

      canvas.dataset.slideFit = result.fit.toFixed(2);
      if (result.overflow) {
        canvas.dataset.slideOverflow = 'true';
      } else {
        delete canvas.dataset.slideOverflow;
      }

      if (result.overflow) {
        reportOverflow(meta, result);
      }

      return {
        fit: result.fit,
        overflow: result.overflow,
        capacity: usableContentHeight()
      };
    }

    /**
     * Re-check the footer's logical footprint and re-fit if it changed, which
     * happens when the footer hits its minimum readable size on a small player.
     * The uniform scale itself is applied synchronously in scheduleRefresh().
     */
    function refresh() {
      if (!active) return;

      const reserve = measureFooterReserve();
      if (Math.abs(reserve - reservedFooterLogical) > 1) {
        reservedFooterLogical = reserve;
        const result = fitContent();
        lastFit = result;
        canvas.dataset.slideFit = result.fit.toFixed(2);
        if (result.overflow) {
          canvas.dataset.slideOverflow = 'true';
          reportOverflow(null, result);
        } else {
          delete canvas.dataset.slideOverflow;
        }
      }
    }

    /**
     * Resize entry point. The uniform scale is applied immediately rather than in
     * a frame callback: it is only a rect read plus a custom property write, and
     * requestAnimationFrame is suspended while the page is hidden, which would
     * otherwise leave the slide rendering at a stale scale when the player is
     * resized in a background tab and then brought forward.
     *
     * The re-fit, which is comparatively expensive and rarely needed, stays
     * deferred and coalesced.
     */
    function scheduleRefresh() {
      applyScale();
      if (!active) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        refresh();
      });
    }

    function release() {
      active = false;
      content.style.height = '';
      canvas.style.removeProperty('--slide-heading-fit');
      canvas.style.removeProperty('--slide-heading-wrap');
      delete canvas.dataset.slideOverflow;
    }

    /* ---------- Resize / fullscreen / orientation ---------- */

    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(scheduleRefresh).observe(stage);
    } else {
      global.addEventListener('resize', scheduleRefresh);
    }
    global.addEventListener('orientationchange', scheduleRefresh);
    document.addEventListener('fullscreenchange', scheduleRefresh);
    document.addEventListener('webkitfullscreenchange', scheduleRefresh);
    // Resizes that happened while the page was hidden are reconciled on return.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) scheduleRefresh();
    });

    applyScale();

    return {
      layout,
      refresh: scheduleRefresh,
      release,
      getScale: () => currentScale,
      getLastFit: () => lastFit,
      getLastHeadingFit: () => lastHeadingFit
    };
  }

  /* ======================================================================
     DIAGNOSTICS
     A slide that cannot be laid out above the readability floor is a content
     authoring problem. It is surfaced loudly in development and marked in the
     DOM (data-slide-overflow) rather than silently shrinking text into
     illegibility or clipping bullets away.
     ====================================================================== */

  function isDevEnvironment() {
    const host = global.location ? global.location.hostname : '';
    const debugFlag =
      global.location && /[?&]slideDebug=1/.test(global.location.search || '');
    return debugFlag || host === 'localhost' || host === '127.0.0.1' || host === '';
  }

  function reportOverflow(meta, result) {
    if (!isDevEnvironment()) return;
    const title = meta && meta.title ? `"${meta.title}"` : '(active slide)';
    const at = meta && meta.at ? ` @ ${meta.at}` : '';
    console.warn(
      `[kkgr-player] Keypoint slide exceeds readable content capacity: ${title}${at}\n` +
      `  The slide does not fit at the minimum readable typography ` +
      `(fit=${FIT_MIN.toFixed(2)}, body=${(TOKENS.bodySize * FIT_MIN).toFixed(1)} logical px).\n` +
      `  Shorten or split this slide's bullets. Content is kept scrollable rather than truncated.`
    );
  }

  /**
   * Offline capacity check for authoring: reports which slides in a SLIDES array
   * cannot be laid out above the readability floor, without opening them.
   * Requires a live layout controller (the player installs one as
   * window.KKGRSlideLayout.controller).
   */
  function audit(slides, controller, render) {
    if (!Array.isArray(slides) || !controller || typeof render !== 'function') return [];
    const failures = [];
    slides.forEach((slide) => {
      if (!Array.isArray(slide.bullets) && !slide.title) return;
      render(slide);
      const result = controller.layout(slide);
      if (result.overflow) {
        failures.push({ at: slide.at, title: slide.title, kind: slide.kind });
      }
    });
    controller.release();
    return failures;
  }

  global.KKGRSlideLayout = {
    DESIGN,
    TOKENS,
    FIT_MIN,
    FIT_MAX,
    FIT_STEP,
    STEP_COUNT,
    HEADING_FIT_MIN,
    HEADING_FIT_MAX,
    HEADING_STEP_COUNT,
    headingFitAt,
    SPACING_MIN,
    fitAt,
    typographyFor,
    createSlideLayout,
    audit
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.KKGRSlideLayout;
  }
})(typeof window !== 'undefined' ? window : globalThis);

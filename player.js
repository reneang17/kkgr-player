/**
 * player.js
 * Video player adapter, timeline synchronisation loop, and overlay engine.
 *
 * This is the ENGINE. It contains no lesson content. It consumes one lesson
 * descriptor, loaded from lessons/index.js:
 *
 *   { id, title, subtitle, videoId, slideBg, segments, slides }
 *
 * Slide appearance is not decided here either — that belongs to slide-layout.js.
 * See docs/ARCHITECTURE.md for the layer boundaries.
 */

import { loadLesson } from './lessons/index.js';

/* ==========================================================================
   VIDEO PLAYER ADAPTER
   Abstracted player calls so YouTube can easily be swapped for HTML5 / H5P.
   ========================================================================== */
let ytPlayerInstance = null;
let isPlayerReady = false;

function playerPlay() {
  if (ytPlayerInstance && typeof ytPlayerInstance.playVideo === 'function') {
    ytPlayerInstance.playVideo();
  }
}

function playerPause() {
  if (ytPlayerInstance && typeof ytPlayerInstance.pauseVideo === 'function') {
    ytPlayerInstance.pauseVideo();
  }
}

function playerSeekTo(seconds) {
  if (ytPlayerInstance && typeof ytPlayerInstance.seekTo === 'function') {
    // Before the video has ever played, some browsers (Safari in particular)
    // do not keep the seek: playback later starts from 0:00. Remember where
    // we meant to be so the first real playback can be put back there.
    if (!hasStartedPlayback) pendingSeekTarget = seconds;
    ytPlayerInstance.seekTo(seconds, true);
  }
}

function playerGetCurrentTime() {
  if (ytPlayerInstance && typeof ytPlayerInstance.getCurrentTime === 'function') {
    return ytPlayerInstance.getCurrentTime();
  }
  return 0;
}

function playerGetDuration() {
  if (ytPlayerInstance && typeof ytPlayerInstance.getDuration === 'function') {
    return ytPlayerInstance.getDuration();
  }
  return 0;
}

function playerGetState() {
  if (ytPlayerInstance && typeof ytPlayerInstance.getPlayerState === 'function') {
    return ytPlayerInstance.getPlayerState();
  }
  return -1;
}

// YT.PlayerState.ENDED, named here so it can be checked before the API loads.
const YT_STATE_ENDED = 0;

// How far before the end a segment seek is allowed to land. YouTube dropped a
// seek 0.02 s before the end, while closing slides 0.4–0.9 s before the end have
// always seeked fine, so half a second keeps clear of the dead band.
const END_SEEK_MARGIN_SECONDS = 0.5;

// Resume after a slide. YouTube answers playVideo() on an ended video by
// restarting it from 0:00, so closing the last slide of a lesson whose closing
// slides sit at the very end would otherwise throw the viewer back to the start.
function playerResume() {
  if (playerGetState() === YT_STATE_ENDED) return;
  playerPlay();
}

/* ==========================================================================
   LESSON CONTENT
   The engine never hard-codes lesson content. It loads one lesson descriptor
   from the registry (lessons/index.js), chosen by the ?lesson= query parameter.
   Lookup is synchronous, so the rest of this module's setup keeps its original
   top-to-bottom order (see the note in lessons/index.js on why).

   A window global still wins if one is present, so a host page can inject a
   lesson directly (for example when this player is embedded in a CMS-driven
   site) without going through the registry. See docs/EMBEDDING.md.
   ========================================================================== */
const injectedLesson = (typeof window !== 'undefined' && window.KKGR_LESSON) || null;
const activeLesson = injectedLesson || loadLesson();

const currentVideoId = activeLesson.videoId;
const currentSlideBg = activeLesson.slideBg || '';
const currentSegments = activeLesson.segments || [];
const currentSlides = activeLesson.slides || [];

/**
 * Appends lesson text to an element, turning `*phrase*` into <em>phrase</em>.
 *
 * Lesson files are pure data, so they cannot carry markup; this one marker is
 * how they flag words to italicise — chiefly passages quoted verbatim from a
 * root text. Built from text nodes rather than innerHTML so lesson text can
 * never inject markup. An unpaired `*` is left as a literal character.
 *
 * @param {HTMLElement} el
 * @param {string} text
 */
function appendWithEmphasis(el, text) {
  String(text).split(/\*([^*]+)\*/).forEach((part, i) => {
    if (!part) return;
    if (i % 2 === 1) {
      const em = document.createElement('em');
      em.textContent = part;
      el.append(em);
    } else {
      el.append(part);
    }
  });
}

/* Let the page chrome follow the lesson, so one template serves every video. */
if (typeof document !== 'undefined') {
  const titleEl = document.querySelector('.page-header h1');
  const subtitleEl = document.querySelector('.page-header p.subtitle');
  if (titleEl && activeLesson.title) titleEl.textContent = activeLesson.title;
  if (subtitleEl && activeLesson.subtitle) subtitleEl.textContent = activeLesson.subtitle;
  // `name` places this video within its series ("Introduction Part 1"). It is
  // optional so that injected or older descriptors without one still render.
  const nameEl = document.getElementById('lesson-name');
  if (nameEl) {
    nameEl.textContent = activeLesson.name || '';
    nameEl.hidden = !activeLesson.name;
  }
  const docTitle = [activeLesson.name, activeLesson.title].filter(Boolean).join(' · ');
  if (docTitle) document.title = docTitle;

  /* Optional handout: a printable copy of the slide bullet points. Lessons
     without one simply show no button. */
  const handoutBtn = document.getElementById('handout-btn');
  const handout = activeLesson.handout;
  if (handoutBtn) {
    if (handout && handout.file) {
      const label = handout.label || 'Download handout';
      handoutBtn.href = handout.file;
      // `download` names the saved file; without a value the browser keeps the
      // URL's basename, which is fine but less readable.
      handoutBtn.setAttribute('download', handout.filename || '');
      handoutBtn.setAttribute('aria-label', `${label} (PDF, opens a download)`);
      handoutBtn.setAttribute('title', label);
      const labelEl = document.getElementById('handout-btn-text');
      if (labelEl) labelEl.textContent = label;
      handoutBtn.hidden = false;
    } else {
      handoutBtn.hidden = true;
    }
  }

  /* Optional credits for third-party works (photographs and the like). Built
     with textContent rather than innerHTML so a credit can never inject markup. */
  const creditsSection = document.getElementById('credits-section');
  const creditsList = document.getElementById('credits-list');
  const credits = Array.isArray(activeLesson.credits) ? activeLesson.credits : [];
  if (creditsSection && creditsList) {
    creditsList.replaceChildren(...credits.map((credit) => {
      const item = document.createElement('li');
      item.className = 'credit-item';
      // A free-text acknowledgement, e.g. for quotations, rather than a work.
      if (credit.note) {
        appendWithEmphasis(item, credit.note);
        return item;
      }
      const work = document.createElement('span');
      work.className = 'credit-work';
      work.textContent = credit.work;
      // Thank the person first when we know who made it ("Credit to <author>
      // for <work>"); otherwise the work stands alone.
      if (credit.author) item.append(`Credit to ${credit.author} for `);
      item.append(work);
      const source = credit.via || credit.courtesy;
      if (source) {
        item.append(credit.via ? ', shared via ' : '. Courtesy of ');
        if (credit.sourceUrl) {
          const link = document.createElement('a');
          link.href = credit.sourceUrl;
          link.target = '_blank';
          link.rel = 'noopener';
          link.textContent = source;
          item.append(link);
        } else {
          item.append(source);
        }
      }
      return item;
    }));
    creditsSection.hidden = credits.length === 0;
  }
}

/* ==========================================================================
   UTILITIES & DATA NORMALIZATION
   ========================================================================== */
// Parse "m:ss", "mm:ss", "h:mm:ss", "h:mm:ss:ms/frames" with optional decimals into float seconds
function parseTimestamp(timeStr) {
  if (typeof timeStr === 'number') return timeStr;
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 4) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2] + (parts[3] / 100);
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}

// Format seconds into "m:ss" or "h:mm:ss"
function formatTime(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
  const s = Math.floor(totalSeconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const secStr = secs < 10 ? '0' + secs : secs;

  if (hrs > 0) {
    const minStr = mins < 10 ? '0' + mins : mins;
    return `${hrs}:${minStr}:${secStr}`;
  }
  return `${mins}:${secStr}`;
}

// Build combined segments list from explicit SEGMENTS and all announcement slides
function buildSegmentsList() {
  const merged = [];
  const seenTimes = new Map();

  // 1. Add explicit segments
  currentSegments.forEach(seg => {
    const atSeconds = parseTimestamp(seg.at);
    const item = {
      at: formatTime(atSeconds),
      atSeconds,
      title: seg.title,
      note: seg.note || ''
    };
    merged.push(item);
    seenTimes.set(Math.round(atSeconds), item);
  });

  // 2. Automatically include announcements as segments unless explicitly set { segment: false }
  currentSlides.forEach(slide => {
    if (slide.kind === 'announcement' && slide.segment !== false) {
      const atSeconds = parseTimestamp(slide.at);
      const key = Math.round(atSeconds);
      if (seenTimes.has(key)) {
        const existing = seenTimes.get(key);
        if (!existing.title) existing.title = slide.primaryText || slide.title;
        if (!existing.note && slide.secondaryText) existing.note = slide.secondaryText;
      } else {
        const item = {
          at: formatTime(atSeconds),
          atSeconds,
          title: slide.primaryText || slide.title,
          note: slide.secondaryText || slide.note || ''
        };
        merged.push(item);
        seenTimes.set(key, item);
      }
    }
  });

  // 3. Slides the viewer can open from the segments list (refuge, dedication).
  //    These are actions rather than positions, so they carry no timestamp.
  currentSlides.forEach((slide, originalIndex) => {
    if (!slide.openFromSegment) return;
    merged.push({
      at: '',
      atSeconds: parseTimestamp(slide.at),
      title: slide.segmentTitle || slide.title,
      note: slide.segmentNote || '',
      opensSlideIndex: originalIndex,
      segmentPlacement: slide.segmentPlacement === 'after' ? 'after' : 'before'
    });
  });

  // 4. Sort chronologically. Where an action segment shares a timestamp with a
  //    position, the slide decides which side it goes on: "Refuge" belongs above
  //    "Start of the Video", while "Dedication" belongs below "End of the Video",
  //    because the teaching reaches the closing takeaways before it dedicates.
  const tieRank = (seg) => {
    if (seg.opensSlideIndex === undefined) return 0;
    return seg.segmentPlacement === 'after' ? 1 : -1;
  };
  merged.sort((a, b) => {
    if (Math.abs(a.atSeconds - b.atSeconds) < 0.001) {
      return tieRank(a) - tieRank(b);
    }
    return a.atSeconds - b.atSeconds;
  });

  // 5. Assign sequential index
  return merged.map((seg, index) => ({
    ...seg,
    index
  }));
}

const normalizedSegments = buildSegmentsList();

// Priority ordering for slides triggered at identical timestamps:
// 1. takeaways (shown first)
// 2. coming-up (shown second)
// 3. final slide ("Thank you everybody") — closes the teaching itself
// 4. image slides such as the dedication — the dedication comes last, after
//    the teaching has been closed, so the session ends by dedicating the merit
// 5. other stopping slides
// 6. announcements (shown after stopping slides when video resumes)
// 7. timed side panels
function getSlidePriority(slide) {
  if (slide.kind === 'takeaways') return 1;
  if (slide.kind === 'coming-up') return 2;
  if (slide.kind === 'final' || slide.kind === 'final-slide') return 3;
  if (slide.kind === 'image' || slide.kind === 'refuge' || slide.kind === 'dedication') return 4;
  if (slide.isStopping) return 5;
  if (slide.kind === 'announcement') return 6;
  return 7;
}

// Normalize slides array with parsed timestamps & runtime state
const normalizedSlides = currentSlides.map((slide, index) => {

  const atSeconds = parseTimestamp(slide.at);
  let untilSeconds = slide.until ? parseTimestamp(slide.until) : null;
  
  // If announcement without explicit 'until', calculate based on duration
  if (slide.kind === 'announcement' && untilSeconds === null) {
    untilSeconds = atSeconds + (slide.duration || 8);
  }

  const isStopping = (slide.kind === 'coming-up' || slide.kind === 'takeaways' || slide.kind === 'final' || slide.kind === 'final-slide') ? true : (slide.kind === 'announcement' ? (slide.pause === true) : (untilSeconds === null));
  const duration = (untilSeconds !== null) ? Math.max(1, untilSeconds - atSeconds) : (slide.duration || null);

  return {
    ...slide,
    originalIndex: index,
    atSeconds,
    untilSeconds,
    isStopping,
    duration,
    // Gating flags (see slide-utils/image-slide.js)
    openFromSegment: slide.openFromSegment === true,
    onTimeline: slide.onTimeline !== false,
    // Runtime tracking flags
    passed: false
  };
});

// Sort slides chronologically; if timestamps match (< 0.2s apart), follow priority: takeaways -> coming-up -> announcements
normalizedSlides.sort((a, b) => {
  if (Math.abs(a.atSeconds - b.atSeconds) < 0.2) {
    const pA = getSlidePriority(a);
    const pB = getSlidePriority(b);
    if (pA !== pB) return pA - pB;
    return a.originalIndex - b.originalIndex;
  }
  return a.atSeconds - b.atSeconds;
});

normalizedSlides.forEach((slide, idx) => {
  slide.index = idx;
});

/* Two slides "share a timestamp" when they are within this of each other; the
   same tolerance the sort above and the segment seek use. */
const SAME_MOMENT_SECONDS = 0.2;

/* The playback loop fires a slide once the playhead is at or up to this far
   past its timestamp, so a slide missed by one poll, or landed just after by a
   seek, still shows. */
const SLIDE_TRIGGER_WINDOW_SECONDS = 2.0;

/* The takeaways that close the section just before `slide`, i.e. the takeaways
   at the same moment as a "Coming up", or just before it (within the trigger
   window: some lessons time them a second or two ahead). Null when there are
   none (the first section of a teaching has nothing before it). */
function takeawaysBefore(slide) {
  const candidates = normalizedSlides.filter(s =>
    s.kind === 'takeaways' && s.onTimeline &&
    s.atSeconds < slide.atSeconds + SAME_MOMENT_SECONDS &&
    s.atSeconds > slide.atSeconds - SLIDE_TRIGGER_WINDOW_SECONDS);
  return candidates.length > 0 ? candidates[candidates.length - 1] : null;
}

/* The takeaways that close the section starting at `seg`: the last takeaways
   after the segment's own moment and no later than the next segment's. A
   section's takeaways are timed at the start of the next one, which is why the
   upper bound is inclusive and the lower one is not. */
function sectionTakeaways(seg) {
  if (seg.opensSlideIndex !== undefined) return null;
  const next = normalizedSegments.find(other =>
    other.opensSlideIndex === undefined &&
    other.atSeconds > seg.atSeconds + SAME_MOMENT_SECONDS);
  const end = next ? next.atSeconds + SAME_MOMENT_SECONDS : Infinity;
  const inSection = normalizedSlides.filter(s =>
    s.kind === 'takeaways' && s.onTimeline &&
    s.atSeconds > seg.atSeconds + SAME_MOMENT_SECONDS && s.atSeconds < end);
  return inSection.length > 0 ? inSection[inSection.length - 1] : null;
}

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const playerBox = document.getElementById('player-box');
const pauseToggle = document.getElementById('pause-toggle');
const timeDisplay = document.getElementById('time-display');
const segmentsList = document.getElementById('segments-list');

// Chapters drawer & fullscreen controls
const topCornerMenuBtn = document.getElementById('top-corner-menu-btn');
const chaptersToggleBtn = document.getElementById('chapters-toggle-btn');
const chaptersDrawerLayer = document.getElementById('chapters-drawer');
const chaptersDrawerBackdrop = document.getElementById('chapters-drawer-backdrop');
const chaptersDrawerClose = document.getElementById('chapters-drawer-close');
const chaptersDrawerList = document.getElementById('chapters-drawer-list');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const pseudoFsExitBtn = document.getElementById('pseudo-fs-exit-btn');
const fullscreenIconExpand = document.getElementById('fullscreen-icon-expand');
const fullscreenIconCompress = document.getElementById('fullscreen-icon-compress');


// Stopping slide elements
const stoppingSlideLayer = document.getElementById('stopping-slide');
const slideCanvas = document.getElementById('slide-canvas');
const stoppingContent = document.getElementById('stopping-content');
const stoppingFooter = document.getElementById('stopping-footer');
const playerStage = document.getElementById('player-stage');
const stoppingLabel = document.getElementById('stopping-label');
const stoppingTitle = document.getElementById('stopping-title');
const stoppingBulletsBox = document.getElementById('stopping-bullets-box');
const stoppingBullets = document.getElementById('stopping-bullets');
const continueBtn = document.getElementById('continue-btn');
const chantBtn = document.getElementById('chant-btn');
const chantBtnText = document.getElementById('chant-btn-text');
const chantAudio = document.getElementById('chant-audio');
const continueBtnText = document.getElementById('continue-btn-text');
const slideHint = document.getElementById('slide-hint');
const backBtn = document.getElementById('back-btn');

// Timed panel elements
const timedPanelLayer = document.getElementById('timed-panel');
const timedLabel = document.getElementById('timed-label');
const timedTitle = document.getElementById('timed-title');
const timedBullets = document.getElementById('timed-bullets');

// Announcement elements
const announcementLayer = document.getElementById('announcement-layer');
const announcementPrimary = document.getElementById('announcement-primary');
const announcementSecondary = document.getElementById('announcement-secondary');

/* Slide layout controller: fits slide content on the logical 1600x900 canvas and
   scales that canvas uniformly into the player. See slide-layout.js. */
const slideLayout = (window.KKGRSlideLayout && playerStage && slideCanvas && stoppingContent)
  ? window.KKGRSlideLayout.createSlideLayout({
      stage: playerStage,
      canvas: slideCanvas,
      content: stoppingContent,
      footer: stoppingFooter,
      heading: stoppingTitle
    })
  : null;

if (window.KKGRSlideLayout) {
  window.KKGRSlideLayout.controller = slideLayout;
}

/* --------------------------------------------------------------------------
   Scroll indicator for a slide whose bullets scroll.

   Native scrollbars cannot be relied on to say "there is more below": macOS,
   iOS and Android draw overlay scrollbars that stay hidden until the viewer is
   already scrolling, and none of them can be forced visible on every browser.
   A slide whose first bullet happens to fill the card then looks complete. So
   the list's own scrollbar is hidden (style.css) and this track is drawn
   instead, permanently, whenever the bullets scroll. It also works as a
   scrollbar: the thumb can be dragged and the wheel scrolls over it.
   -------------------------------------------------------------------------- */

/* Smallest thumb, as a fraction of the track: a very long list would otherwise
   give a sliver too small to see or grab. */
const SCROLL_THUMB_MIN_FRACTION = 0.12;
/* Logical px between the text column and the track. Bounded by the room the
   layout leaves (the card's side padding, or coming-up's side margin). */
const SCROLL_TRACK_GAP = 24;
/* The track rests as a faint line and brightens while the viewer scrolls,
   hovers or drags it. How long it stays bright after the last scroll: long
   enough not to flicker between wheel ticks, short enough to get out of the
   way of the text promptly. */
const SCROLL_ACTIVE_LINGER_MS = 1000;

const scrollTrack = document.createElement('div');
scrollTrack.className = 'slide-scroll-track';
scrollTrack.setAttribute('aria-hidden', 'true');
scrollTrack.hidden = true;
const scrollThumb = document.createElement('div');
scrollThumb.className = 'slide-scroll-thumb';
scrollTrack.append(scrollThumb);

function updateScrollIndicator() {
  const list = stoppingBullets;
  const maxScroll = list.scrollHeight - list.clientHeight;
  const scrolls = Boolean(activeStoppingSlide) && slideCanvas
    && slideCanvas.dataset.slideOverflow === 'true' && maxScroll > 1;
  scrollTrack.hidden = !scrolls;
  if (!scrolls) return;

  // Positions are logical px within the bullets box (the canvas is scaled as a
  // whole, so offset* values are already in the right units).
  const listRight = list.offsetLeft + list.offsetWidth;
  const room = stoppingBulletsBox.clientWidth - listRight - scrollTrack.offsetWidth;
  scrollTrack.style.left = `${listRight + Math.max(0, Math.min(SCROLL_TRACK_GAP, room / 2))}px`;
  scrollTrack.style.top = `${list.offsetTop}px`;
  scrollTrack.style.height = `${list.clientHeight}px`;

  const trackHeight = list.clientHeight;
  const thumbHeight = Math.max(trackHeight * SCROLL_THUMB_MIN_FRACTION,
    trackHeight * (list.clientHeight / list.scrollHeight));
  scrollThumb.style.height = `${thumbHeight}px`;
  scrollThumb.style.transform =
    `translateY(${(list.scrollTop / maxScroll) * (trackHeight - thumbHeight)}px)`;
}

let scrollActiveTimer = null;
let scrollDragging = false;
function markScrollActive() {
  scrollTrack.classList.add('is-active');
  clearTimeout(scrollActiveTimer);
  if (scrollDragging) return;            // stays bright until the drag ends
  scrollActiveTimer = setTimeout(() => {
    scrollTrack.classList.remove('is-active');
  }, SCROLL_ACTIVE_LINGER_MS);
}

if (stoppingBulletsBox && stoppingBullets) {
  stoppingBulletsBox.append(scrollTrack);
  stoppingBullets.addEventListener('scroll', () => {
    updateScrollIndicator();
    markScrollActive();
  }, { passive: true });
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(updateScrollIndicator).observe(stoppingBullets);
  }
  if (slideCanvas && typeof MutationObserver === 'function') {
    new MutationObserver(updateScrollIndicator)
      .observe(slideCanvas, { attributes: true, attributeFilter: ['data-slide-overflow'] });
  }

  // Wheel over the track scrolls the list, as it would over a native scrollbar.
  scrollTrack.addEventListener('wheel', (e) => {
    e.preventDefault();
    stoppingBullets.scrollTop += e.deltaY;
  }, { passive: false });

  // Dragging the thumb. Pointer events cover mouse, pen and touch alike.
  let drag = null;
  scrollThumb.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    scrollThumb.setPointerCapture(e.pointerId);
    // Screen px per logical px: the canvas is scaled, the pointer is not.
    const scale = scrollTrack.getBoundingClientRect().height / scrollTrack.offsetHeight || 1;
    const list = stoppingBullets;
    const travel = scrollTrack.offsetHeight - scrollThumb.offsetHeight;
    drag = {
      startY: e.clientY,
      startScroll: list.scrollTop,
      ratio: travel > 0 ? (list.scrollHeight - list.clientHeight) / (travel * scale) : 0
    };
    scrollDragging = true;
    markScrollActive();
  });
  scrollThumb.addEventListener('pointermove', (e) => {
    if (!drag) return;
    stoppingBullets.scrollTop = drag.startScroll + (e.clientY - drag.startY) * drag.ratio;
  });
  const endDrag = () => {
    drag = null;
    scrollDragging = false;
    markScrollActive();                  // fade back after the usual linger
  };
  scrollThumb.addEventListener('pointerup', endDrag);
  scrollThumb.addEventListener('pointercancel', endDrag);
}

// State
let activeStoppingSlide = null;
let stoppingQueue = [];
let pendingAnnouncements = [];
let stoppingBulletIndex = 0;
let stoppingTimer = null;
let activeTimedSlide = null;
let activeAnnouncement = null;
let lastKnownTime = 0;

/* Has the viewer started the teaching at all this session? Used to decide where
   "Begin lesson" returns to — see segmentReturn below. */
let hasStartedPlayback = false;

/* A seek made before the video first played, not yet confirmed by playback
   (see playerSeekTo). When playback does start, onStateChange checks it landed
   there and seeks again if it did not. */
let pendingSeekTarget = null;

/* A seek in flight (a segment jump, or the correction above). For a moment
   after a seek the player can still report the old position — or 0:00, on its
   way to a corrected one — and the playback loop would read that as the viewer
   rewinding: it would close the slide just opened and re-arm the ones already
   shown, which then replay from the previous section's takeaways. So the loop
   is held until the reported time arrives (see holdUntilSeekLands). */
let seekLandingTarget = null;

/* How far from the intended position counts as "the seek was lost". Seeks
   land on a keyframe, a second or so either side, so this must be wider than
   that; a lost seek is off by minutes. */
const SEEK_LANDED_TOLERANCE_SECONDS = 3;
/* Longest the timeline is held waiting for a seek to land. Seeks normally
   land well within a second; this only matters if the viewer moves the video
   elsewhere themselves meanwhile, which must not leave the slides switched off. */
const SEEK_LANDING_TIMEOUT_MS = 5000;
let seekLandingDeadline = 0;

function holdUntilSeekLands(target) {
  seekLandingTarget = target;
  seekLandingDeadline = Date.now() + SEEK_LANDING_TIMEOUT_MS;
  lastKnownTime = target;
}

/* Where to go back to when the viewer continues from a slide they opened out of
   the segments list. Opening such a slide does not move the playhead, so the
   only thing that has to be restored is whatever the slide interrupted:

     - nothing yet        -> start the teaching from the beginning
     - a keypoint slide   -> put that slide back up, still paused
     - a point in the video -> carry on from there

   Holds { forSlide, slide, hadStarted }; `forSlide` identifies the instance that
   was segment-opened, so a dedication reached by the timeline (which is also
   listed as a segment) is unaffected. */
let segmentReturn = null;

/* Apply optional custom background if provided.
   The artwork is painted on the scaled canvas, not on the layer, so it composites
   as part of the presentation surface. See .slide-canvas in style.css. */
function setSlideBackground(url) {
  if (!slideCanvas) return;
  if (url && url.trim() !== '') {
    slideCanvas.style.setProperty('--slide-bg', `url('${url}')`);
  } else {
    slideCanvas.style.setProperty('--slide-bg', 'none');
  }
}

if (currentSlideBg && currentSlideBg.trim() !== "") {
  setSlideBackground(currentSlideBg);
}

/* ==========================================================================
   SEGMENTS & CHAPTERS RENDERING & NAVIGATION
   ========================================================================== */
function seekToSegment(seg) {
  // Captured before anything is torn down: this is what the viewer was on.
  const interruptedSlide = activeStoppingSlide;

  // If a stopping slide was open or queued, clear and close
  stoppingQueue = [];
  pendingAnnouncements = [];
  if (activeStoppingSlide) {
    closeStoppingSlide(false);
  }
  if (activeAnnouncement) {
    closeAnnouncement();
  }

  // An action segment opens its slide rather than moving the playhead. The video
  // stays where it is; continuing from the slide resumes from there, which for
  // the refuge slide means the teaching starts from the beginning.
  if (seg.opensSlideIndex !== undefined) {
    const slide = normalizedSlides.find(s => s.originalIndex === seg.opensSlideIndex);
    if (slide) openSlideFromSegment(slide, interruptedSlide);
    return;
  }

  // A normal seek discards any pending return: the viewer has chosen a new place
  // in the teaching, so there is nothing to come back to.
  segmentReturn = null;

  // Reset passed state for slides at or after this timestamp so stopping slides fire
  normalizedSlides.forEach((slide) => {
    if (slide.atSeconds >= seg.atSeconds - 0.5) {
      slide.passed = false;
    }
  });
  // YouTube ignores a seek that lands within a few hundredths of a second of the
  // end, so a segment there would leave the playhead where it was. Stop just
  // short of the end instead; the slides at the segment open directly below.
  const duration = playerGetDuration();
  const seekTarget = duration > 0
    ? Math.min(seg.atSeconds, duration - END_SEEK_MARGIN_SECONDS)
    : seg.atSeconds;
  holdUntilSeekLands(seekTarget);
  playerSeekTo(seekTarget);

  // Keypoint slides at the segment's own timestamp are shown straight away
  // rather than left for the playback loop. A seek lands on a keyframe, and for
  // slides less than a second or so before the end of the video that keyframe is
  // the end itself: the video ends, playback never passes the marker, and the
  // segment appears to do nothing. Matching uses the same 0.2 s tolerance the
  // slide sort treats as "the same timestamp".
  //
  // The takeaways at this moment close the PREVIOUS section, so a viewer who
  // chose this section starts at its "Coming up" instead; the takeaways stay
  // one click away (the back button on that slide, or the previous segment's
  // Takeaways button). They are still marked passed, so playback does not
  // show them a moment later.
  const slidesHere = pauseToggle.checked
    ? normalizedSlides.filter(s =>
        s.onTimeline && s.isStopping && Math.abs(s.atSeconds - seg.atSeconds) < SAME_MOMENT_SECONDS)
    : [];
  slidesHere.forEach(s => { s.passed = true; });
  // Likewise anything timed just before the segment, inside the trigger window:
  // landing here would otherwise fire it. Lessons sometimes put the previous
  // section's takeaways a second or two before the next section's banner.
  normalizedSlides.forEach(s => {
    if (s.atSeconds < seg.atSeconds - SAME_MOMENT_SECONDS &&
        s.atSeconds > seg.atSeconds - SLIDE_TRIGGER_WINDOW_SECONDS) {
      s.passed = true;
    }
  });
  const slidesToShow = slidesHere.filter(s => s.kind !== 'takeaways');
  if (slidesToShow.length > 0) {
    showStoppingSlides(slidesToShow);
    return;
  }

  playerPlay();
}

/* Opens a slide on request (refuge, dedication, a section's takeaways) without
   moving the playhead. Continuing from it returns the viewer to where they were
   — see segmentReturn. */
function openSlideFromSegment(slide, interruptedSlide) {
  segmentReturn = {
    forSlide: slide,
    slide: interruptedSlide,
    hadStarted: hasStartedPlayback
  };
  playerPause();
  openStoppingSlide(slide);
}

/* A segment's Takeaways button. Tears down whatever is on screen exactly as a
   segment does, then opens the section's takeaways as a review. */
function openSectionTakeaways(slide) {
  const interruptedSlide = activeStoppingSlide;
  stoppingQueue = [];
  pendingAnnouncements = [];
  if (activeStoppingSlide) closeStoppingSlide(false);
  if (activeAnnouncement) closeAnnouncement();
  openSlideFromSegment(slide, interruptedSlide);
}

/* The back button on a "Coming up": show the previous section's takeaways, then
   come back to this slide. Done through the queue, so Continue on the takeaways
   returns here and anything already queued behind this slide still follows. */
function showPreviousTakeaways() {
  if (!activeStoppingSlide) return;
  const target = takeawaysBefore(activeStoppingSlide);
  if (!target) return;
  stoppingQueue.unshift(target, activeStoppingSlide);
  closeStoppingSlide(false);
}

/* Offer the back button only on a "Coming up" that has takeaways before it. It
   takes the place of the keyboard hint, which keeps the footer to one line. */
function configureBackButton(slide) {
  if (!backBtn) return;
  const show = slide.kind === 'coming-up' && Boolean(takeawaysBefore(slide));
  backBtn.hidden = !show;
  if (slideHint) slideHint.hidden = show;
}

// Pause and show stopping slides in priority order, or queue them behind the
// one already on screen.
function showStoppingSlides(slides) {
  slides.sort((a, b) => getSlidePriority(a) - getSlidePriority(b));
  if (!activeStoppingSlide) {
    playerPause();
    const firstSlide = slides.shift();
    stoppingQueue.push(...slides);
    openStoppingSlide(firstSlide);
  } else {
    stoppingQueue.push(...slides);
  }
}

/* A second, smaller button beside a segment that has closing takeaways, which
   opens them for review (see openSectionTakeaways). A separate button rather
   than part of the segment row, so the row itself still means "go here". */
function appendTakeawaysButton(li, seg, className, timestampClass, beforeOpen) {
  const slide = sectionTakeaways(seg);
  if (!slide) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  // An invisible copy of the segment's timestamp. When the button sits under
  // its segment (narrow screens) it lays out in the same columns as the row
  // above, so this pushes the label exactly under the segment title whatever
  // the timestamp's width. Hidden by CSS when the button sits beside the row.
  const align = document.createElement('span');
  align.className = `${timestampClass} takeaways-align`;
  align.setAttribute('aria-hidden', 'true');
  align.textContent = formatTime(seg.atSeconds);
  const label = document.createElement('span');
  label.className = 'takeaways-label';
  label.textContent = 'Takeaways';
  btn.append(align, label);
  btn.setAttribute('aria-label', `Takeaways for ${seg.title}`);
  btn.addEventListener('click', () => {
    beforeOpen();
    openSectionTakeaways(slide);
  });
  li.classList.add('has-takeaways');
  li.appendChild(btn);
}

/* Segment rows are not <button>s: Safari and Firefox never let a viewer select
   text inside a button, and the titles and notes are teaching text people want
   to copy. So a row is a plain element given a button's role, focus and
   keyboard behaviour (Enter and Space), which keeps it identical for keyboard
   and screen-reader users. */
function createSelectableRow() {
  const row = document.createElement('div');
  row.setAttribute('role', 'button');
  row.tabIndex = 0;
  return row;
}

function onRowActivate(row, activate) {
  row.addEventListener('click', () => {
    // A drag that selected text inside the row also ends in a click. That was
    // the viewer copying, not choosing the segment.
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && row.contains(selection.anchorNode)) return;
    activate();
  });
  row.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();          // Space would otherwise scroll the page
    // Keep the window-level slide shortcuts (Space/Enter continue a slide) from
    // also acting on this key press.
    e.stopPropagation();
    activate();
  });
}

function renderSegmentsList() {
  if (!segmentsList) return;
  segmentsList.innerHTML = '';
  normalizedSegments.forEach((seg) => {
    const li = document.createElement('li');
    const btn = createSelectableRow();
    btn.className = 'segment-button';
    btn.id = `segment-btn-${seg.index}`;
    // An action segment opens a slide instead of moving the playhead, so it
    // shows no timestamp and is described as opening rather than seeking.
    const isAction = seg.opensSlideIndex !== undefined;
    btn.setAttribute('aria-label', isAction
      ? `Open ${seg.title}`
      : `Seek to ${seg.title} at ${formatTime(seg.atSeconds)}`);
    if (isAction) btn.classList.add('segment-action');

    const timeSpan = document.createElement('span');
    timeSpan.className = 'segment-timestamp';
    timeSpan.textContent = isAction ? '\u2022' : formatTime(seg.atSeconds);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'segment-content-wrapper';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'segment-name';
    nameSpan.textContent = seg.title;
    contentWrapper.appendChild(nameSpan);

    if (seg.note && seg.note.trim() !== '') {
      const noteSpan = document.createElement('span');
      noteSpan.className = 'segment-note';
      noteSpan.textContent = seg.note;
      contentWrapper.appendChild(noteSpan);
    }

    btn.appendChild(timeSpan);
    btn.appendChild(contentWrapper);

    onRowActivate(btn, () => {
      seekToSegment(seg);
    });

    li.appendChild(btn);
    appendTakeawaysButton(li, seg, 'segment-takeaways-btn', 'segment-timestamp', () => {});
    segmentsList.appendChild(li);
  });
}

function renderChaptersDrawer() {
  if (!chaptersDrawerList) return;
  chaptersDrawerList.innerHTML = '';
  normalizedSegments.forEach((seg) => {
    const li = document.createElement('li');
    const btn = createSelectableRow();
    btn.className = 'drawer-chapter-btn';
    btn.id = `drawer-chapter-btn-${seg.index}`;
    const isAction = seg.opensSlideIndex !== undefined;
    btn.setAttribute('aria-label', isAction
      ? `Open ${seg.title}`
      : `Jump to ${seg.title} at ${formatTime(seg.atSeconds)}`);
    if (isAction) btn.classList.add('segment-action');

    const timeSpan = document.createElement('span');
    timeSpan.className = 'drawer-timestamp';
    timeSpan.textContent = isAction ? '\u2022' : formatTime(seg.atSeconds);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'drawer-content-wrapper';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'drawer-chapter-name';
    nameSpan.textContent = seg.title;
    contentWrapper.appendChild(nameSpan);

    if (seg.note && seg.note.trim() !== '') {
      const noteSpan = document.createElement('span');
      noteSpan.className = 'drawer-chapter-note';
      noteSpan.textContent = seg.note;
      contentWrapper.appendChild(noteSpan);
    }

    btn.appendChild(timeSpan);
    btn.appendChild(contentWrapper);

    onRowActivate(btn, () => {
      closeChaptersDrawer();
      seekToSegment(seg);
    });

    li.appendChild(btn);
    appendTakeawaysButton(li, seg, 'drawer-takeaways-btn', 'drawer-timestamp', closeChaptersDrawer);
    chaptersDrawerList.appendChild(li);
  });
}

function openChaptersDrawer() {
  if (!chaptersDrawerLayer) return;
  chaptersDrawerLayer.classList.add('active');
  chaptersDrawerLayer.setAttribute('aria-hidden', 'false');
  if (chaptersToggleBtn) {
    chaptersToggleBtn.classList.add('active');
    chaptersToggleBtn.setAttribute('aria-expanded', 'true');
  }
  if (topCornerMenuBtn) {
    topCornerMenuBtn.classList.add('active');
    topCornerMenuBtn.setAttribute('aria-expanded', 'true');
  }
  updateTopCornerMenuVisibility();
}

function closeChaptersDrawer() {
  if (!chaptersDrawerLayer) return;
  chaptersDrawerLayer.classList.remove('active');
  chaptersDrawerLayer.setAttribute('aria-hidden', 'true');
  if (chaptersToggleBtn) {
    chaptersToggleBtn.classList.remove('active');
    chaptersToggleBtn.setAttribute('aria-expanded', 'false');
  }
  if (topCornerMenuBtn) {
    topCornerMenuBtn.classList.remove('active');
    topCornerMenuBtn.setAttribute('aria-expanded', 'false');
  }
  updateTopCornerMenuVisibility();
}

function toggleChaptersDrawer() {
  if (chaptersDrawerLayer && chaptersDrawerLayer.classList.contains('active')) {
    closeChaptersDrawer();
  } else {
    openChaptersDrawer();
  }
}

/**
 * Updates floating top-corner menu button visibility on mobile/touch screens:
 * - Hidden during stopping slides (Takeaways, Coming up, Final) to prevent distraction.
 * - Always visible when chapters drawer is active.
 * - Otherwise, ONLY visible when the video is paused, before starting, or after ending.
 */
function updateTopCornerMenuVisibility() {
  if (!topCornerMenuBtn) return;

  // 1. If stopping slide is active, ALWAYS hide (never distract during slides!)
  if (activeStoppingSlide) {
    topCornerMenuBtn.classList.remove('is-visible');
    return;
  }

  // 2. If chapters drawer is active, keep button active/visible
  if (chaptersDrawerLayer && chaptersDrawerLayer.classList.contains('active')) {
    topCornerMenuBtn.classList.add('is-visible');
    return;
  }

  // 3. In fullscreen the control bar beneath the player is not reachable, so the
  //    corner button is the only route into the chapters drawer. Keep it visible
  //    there even during playback. (Outside fullscreen the control bar is right
  //    below the player, so the button stays out of the way while watching.)
  if (isAnyFullscreen()) {
    topCornerMenuBtn.classList.add('is-visible');
    return;
  }

  // 4. Otherwise: visible when paused (2), unstarted (-1), ended (0), cued (5)
  const state = playerGetState();
  const isPlaying = (state === 1); // 1 = YT.PlayerState.PLAYING

  if (!isPlaying) {
    topCornerMenuBtn.classList.add('is-visible');
  } else {
    topCornerMenuBtn.classList.remove('is-visible');
  }
}

/* Fullscreen Controller */
/* The Fullscreen API is not available for ordinary elements on every device.
   iOS Safari on iPhone in particular exposes fullscreen only on <video> (via
   webkitEnterFullscreen); a <div> has neither requestFullscreen nor
   webkitRequestFullscreen. Without a fallback the button silently did nothing
   there, so the only way to go fullscreen was YouTube's own control inside the
   iframe — and our slide overlay, chapters drawer and corner menu cannot render
   over a natively fullscreened iframe. The result was a lesson that paused at a
   keypoint without ever showing the slide.

   When the native API is unavailable (or refuses), we fall back to a CSS
   "pseudo fullscreen": the player box is pinned over the viewport with
   position: fixed. Everything stays inside our own DOM, so overlays, the
   chapters drawer and the corner menu keep working, and the slide layout model
   rescales automatically through its ResizeObserver on the player stage. */

/* Whether the browser will actually put an ordinary element into fullscreen.
   Checking for the method alone is not enough: iPhone Safari defines
   webkitRequestFullscreen but only honours it for <video>, so on an element it
   is silently ignored — no promise rejection, no error, no fullscreenchange —
   and the pseudo-fullscreen fallback never ran. The *Enabled flags report the
   truth there (false on iPhone), so they win when the browser provides them. */
function nativeFullscreenSupported() {
  if (!playerBox || !(playerBox.requestFullscreen || playerBox.webkitRequestFullscreen)) {
    return false;
  }
  if (typeof document.fullscreenEnabled === 'boolean') return document.fullscreenEnabled;
  if (typeof document.webkitFullscreenEnabled === 'boolean') return document.webkitFullscreenEnabled;
  return true;
}

/* How long a native fullscreen request gets to take effect before we assume it
   was silently ignored and fall back to pseudo fullscreen. Browsers apply it
   within a frame or two; 400ms is comfortably longer than that while still
   feeling like one response to one tap. */
const NATIVE_FULLSCREEN_GRACE_MS = 400;

function isNativeFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function isPseudoFullscreen() {
  return !!(playerBox && playerBox.classList.contains('is-pseudo-fullscreen'));
}

function isAnyFullscreen() {
  return isNativeFullscreen() || isPseudoFullscreen();
}

function enterPseudoFullscreen() {
  if (!playerBox) return;
  playerBox.classList.add('is-pseudo-fullscreen');
  document.body.classList.add('has-pseudo-fullscreen');
  updateFullscreenState();
  // No fullscreenchange event fires for the pseudo mode, so nudge the layout
  // model directly. (Its ResizeObserver also catches this on its own.)
  if (slideLayout) slideLayout.refresh();
}

function exitPseudoFullscreen() {
  if (!playerBox) return;
  playerBox.classList.remove('is-pseudo-fullscreen');
  document.body.classList.remove('has-pseudo-fullscreen');
  updateFullscreenState();
  if (slideLayout) slideLayout.refresh();
}

function toggleFullscreen() {
  if (!playerBox) return;

  if (isPseudoFullscreen()) {
    exitPseudoFullscreen();
    return;
  }

  if (!isNativeFullscreen()) {
    if (!nativeFullscreenSupported()) {
      enterPseudoFullscreen();
      return;
    }
    // A refusal can surface either way: Chrome throws TypeError synchronously
    // when its permissions check fails (hidden tab, embedded context that
    // disallows fullscreen), while other cases reject the returned promise.
    // Both must fall back, otherwise the button is silently dead.
    const onRefused = (err) => {
      console.warn('Fullscreen request failed, using pseudo fullscreen:', err);
      enterPseudoFullscreen();
    };
    try {
      const request = playerBox.requestFullscreen
        ? playerBox.requestFullscreen()
        : playerBox.webkitRequestFullscreen();
      if (request && typeof request.catch === 'function') {
        request.catch(onRefused);
      }
      // Safety net for a request that is neither honoured nor refused (a
      // browser that reports support it does not have). Without this the
      // fullscreen button does nothing at all.
      setTimeout(() => {
        if (!isNativeFullscreen() && !isPseudoFullscreen()) {
          console.warn('Fullscreen request had no effect, using pseudo fullscreen.');
          enterPseudoFullscreen();
        }
      }, NATIVE_FULLSCREEN_GRACE_MS);
    } catch (err) {
      onRefused(err);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.warn('Exit fullscreen failed:', err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function updateFullscreenState() {
  const isFs = isAnyFullscreen();
  if (fullscreenIconExpand && fullscreenIconCompress) {
    fullscreenIconExpand.style.display = isFs ? 'none' : 'block';
    fullscreenIconCompress.style.display = isFs ? 'block' : 'none';
  }
  if (fullscreenBtn) {
    fullscreenBtn.classList.toggle('active', isFs);
  }
  // Entering or leaving fullscreen changes whether the corner menu is the only
  // way to reach the chapters drawer, so re-evaluate it here.
  updateTopCornerMenuVisibility();
}

renderSegmentsList();
renderChaptersDrawer();
updateTopCornerMenuVisibility();



/* ==========================================================================
   SLIDE & ANNOUNCEMENT OPEN / CLOSE FUNCTIONS
   Handles stopping slides, timed side panels, and lower-third announcements.
   ========================================================================== */

/* ==========================================================================
   CHANT PLAYBACK
   Some slides carry a recording of their text being chanted, so a viewer can
   hear how it is sung. It is offered on its own button beside Continue and
   never plays on its own: the viewer asks for it.

   The video is always paused while a stopping slide is open, so the chant never
   competes with the teaching — and closing the slide stops it, so it cannot
   carry on over the resumed video.
   ========================================================================== */

function setChantLabel(playing) {
  if (!chantBtn) return;
  chantBtn.classList.toggle('is-playing', playing);
  chantBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  if (chantBtnText) {
    chantBtnText.textContent = playing ? 'Stop chant' : (chantBtn.dataset.label || 'Play chant');
  }
}

function stopChant() {
  if (!chantAudio) return;
  chantAudio.pause();
  try { chantAudio.currentTime = 0; } catch (err) { /* not seekable yet */ }
  setChantLabel(false);
}

function toggleChant() {
  if (!chantAudio || !chantAudio.getAttribute('src')) return;
  if (!chantAudio.paused) {
    stopChant();
    return;
  }
  chantAudio.currentTime = 0;
  const started = chantAudio.play();
  if (started && typeof started.then === 'function') {
    started.then(() => setChantLabel(true)).catch((err) => {
      console.warn('[kkgr-player] Could not play chant:', err);
      setChantLabel(false);
    });
  } else {
    setChantLabel(true);
  }
}

/**
 * Point the chant button at this slide's recording, or hide it when the slide
 * has none.
 */
function configureChant(slide) {
  if (!chantBtn || !chantAudio) return;
  stopChant();

  const src = slide && slide.audio;
  if (!src) {
    chantBtn.hidden = true;
    chantAudio.removeAttribute('src');
    return;
  }

  const label = slide.audioLabel || 'Play chant';
  chantBtn.dataset.label = label;
  chantBtn.hidden = false;
  chantBtn.setAttribute('aria-label', label);
  setChantLabel(false);

  // Only reload when the recording actually changes, so reopening the same
  // slide does not refetch it.
  if (chantAudio.getAttribute('src') !== src) {
    chantAudio.setAttribute('src', src);
    chantAudio.load();
  }
}

if (chantAudio) {
  chantAudio.addEventListener('ended', () => setChantLabel(false));
  chantAudio.addEventListener('error', () => {
    if (chantAudio.getAttribute('src')) {
      console.warn('[kkgr-player] Chant recording could not be loaded:', chantAudio.getAttribute('src'));
    }
    setChantLabel(false);
  });
}

if (chantBtn) {
  chantBtn.addEventListener('click', (e) => {
    // The slide layer closes the slide on any click that is not the Continue
    // button, so this must not bubble.
    e.stopPropagation();
    toggleChant();
  });
}

/**
 * Open full-frame stopping slide: pauses video, reveals title and prepares bullets.
 */
function openStoppingSlide(slide) {
  activeStoppingSlide = slide;
  stoppingBulletIndex = 0;

  if (stoppingTimer) {
    clearTimeout(stoppingTimer);
    stoppingTimer = null;
  }

  // Check modes
  const isComingUp = slide.kind === 'coming-up';
  const isTakeaways = slide.kind === 'takeaways';
  const isFinal = slide.kind === 'final' || slide.kind === 'final-slide';
  // Image slides carry their content in the artwork itself, so the engine
  // renders no heading, label or bullets for them.
  const isImage = slide.kind === 'image' || slide.kind === 'refuge' || slide.kind === 'dedication';
  stoppingSlideLayer.classList.toggle('coming-up-mode', isComingUp);
  stoppingSlideLayer.classList.toggle('takeaways-mode', isTakeaways);
  stoppingSlideLayer.classList.toggle('final-mode', isFinal);
  stoppingSlideLayer.classList.toggle('image-mode', isImage);

  // The artwork is lesson content, so it is fitted without cropping by default.
  if (slideCanvas) {
    slideCanvas.style.setProperty('--slide-bg-fit', slide.imageFit || 'cover');
  }

  // Density is no longer guessed from bullet/character counts. The layout model
  // measures the rendered content and picks a typographic step for it; see the
  // slideLayout.layout() call at the end of this function.

  // Set background image
  const bgImage = slide.bg || currentSlideBg;

  setSlideBackground(bgImage);

  // Category label (hide for coming-up, takeaways, and final)
  if (isComingUp || isTakeaways || isFinal || isImage) {
    stoppingLabel.style.display = 'none';
  } else {
    stoppingLabel.style.display = 'inline-block';
    stoppingLabel.textContent = slide.kind === 'takehome' ? 'Take-home lessons' : (slide.kind === 'overview' ? 'Overview' : (slide.kind || 'Overview'));
  }

  // Box background and dimensions if custom
  if (stoppingBulletsBox) {
    if (isFinal && (!slide.bullets || slide.bullets.length === 0)) {
      stoppingBulletsBox.style.display = 'none';
    } else {
      stoppingBulletsBox.style.display = '';
    }

    if (slide.boxBg) {
      stoppingBulletsBox.style.backgroundColor = slide.boxBg;
    } else if (!isTakeaways) {
      stoppingBulletsBox.style.backgroundColor = 'transparent';
    } else {
      stoppingBulletsBox.style.backgroundColor = '';
    }

    if (slide.boxPadding) {
      stoppingBulletsBox.style.padding = slide.boxPadding;
    } else {
      stoppingBulletsBox.style.padding = '';
    }

    if (slide.boxMaxWidth) {
      stoppingBulletsBox.style.maxWidth = slide.boxMaxWidth;
    } else {
      stoppingBulletsBox.style.maxWidth = '';
    }
  }

  // Set heading text & font styling.
  // Font SIZE is owned by the layout model and must not be set inline here: an
  // inline size would override the fitted value. `titleSize` / `bulletSize` are
  // honoured only when a slide author sets them explicitly, as a deliberate escape
  // hatch that opts that slide out of fitting.
  stoppingTitle.textContent = slide.title;
  stoppingTitle.style.fontFamily = slide.font || '';
  stoppingTitle.style.fontSize = slide.titleSize || '';

  // Populate bullets list
  stoppingBullets.innerHTML = '';
  stoppingBullets.style.fontFamily = slide.font || '';
  stoppingBullets.style.fontSize = slide.bulletSize || '';

  if (Array.isArray(slide.bullets)) {
    slide.bullets.forEach((bulletText) => {
      const li = document.createElement('li');
      appendWithEmphasis(li, bulletText);
      stoppingBullets.appendChild(li);
    });
  }

  // Offer this slide's chant recording, if it has one.
  configureChant(slide);
  configureBackButton(slide);

  // Update Continue button label
  if (continueBtnText) {
    continueBtnText.textContent = slide.buttonText || (isFinal ? 'Finish lesson' : (isComingUp || isTakeaways ? 'Continue lesson' : 'Continue'));
  }

  // Configure Continue button & bullets visibility
  if (slide.revealAll || isComingUp || isTakeaways || isFinal || !slide.bullets || slide.bullets.length === 0) {
    const bulletElements = stoppingBullets.querySelectorAll('li');
    bulletElements.forEach(el => el.classList.add('revealed'));
    stoppingBulletIndex = bulletElements.length;
    continueBtn.disabled = false;
    continueBtn.classList.add('ready');
    slideHint.textContent = isFinal ? 'Lesson complete' : 'Press Enter, Escape, or Continue lesson';
  } else {
    // Clicking the slide no longer advances (see the click handler below), so
    // the button reveals each point in turn and only then continues.
    continueBtn.disabled = false;
    continueBtn.classList.remove('ready');
    if (continueBtnText) continueBtnText.textContent = 'Next point';
    slideHint.textContent = 'Press Space or Next point';
    advanceStoppingBullet();
  }

  // If duration is specified, set auto-resume timer
  if (typeof slide.duration === 'number' && slide.duration > 0) {
    stoppingTimer = setTimeout(() => {
      closeStoppingSlide(true);
    }, slide.duration * 1000);
  }

  // Show overlay layer & focus
  stoppingSlideLayer.classList.add('active');
  stoppingSlideLayer.setAttribute('aria-hidden', 'false');

  // Fit the slide on the logical canvas and scale it to the player. Runs after the
  // layer is visible so the content has real measurable geometry.
  if (slideLayout) {
    slideLayout.layout(slide);
  }
  updateScrollIndicator();

  stoppingSlideLayer.focus();

  // Hide top-corner menu button during stopping slides
  updateTopCornerMenuVisibility();
}


/**
 * Advance to reveal the next bullet on the stopping slide.
 */
function advanceStoppingBullet() {
  if (!activeStoppingSlide) return;
  const bulletElements = stoppingBullets.querySelectorAll('li');
  
  if (stoppingBulletIndex < bulletElements.length) {
    bulletElements[stoppingBulletIndex].classList.add('revealed');
    stoppingBulletIndex++;
  }

  // If all bullets are shown, the button continues the lesson
  if (stoppingBulletIndex >= bulletElements.length) {
    continueBtn.disabled = false;
    continueBtn.classList.add('ready');
    if (continueBtnText) {
      continueBtnText.textContent = activeStoppingSlide.buttonText || 'Continue';
    }
    slideHint.textContent = 'Press Enter, Escape, or Continue lesson';
  }
}

/**
 * Close stopping slide and resume video playback or advance to next queued stopping slide.
 */
function closeStoppingSlide(resumePlayback = true) {
  if (!activeStoppingSlide) return;
  if (stoppingTimer) {
    clearTimeout(stoppingTimer);
    stoppingTimer = null;
  }
  stoppingSlideLayer.classList.remove('active');
  stoppingSlideLayer.classList.remove('coming-up-mode');
  stoppingSlideLayer.classList.remove('takeaways-mode');
  stoppingSlideLayer.classList.remove('final-mode');
  stoppingSlideLayer.classList.remove('image-mode');
  stopChant();
  if (slideLayout) {
    slideLayout.release();
  }
  if (stoppingBulletsBox) {
    stoppingBulletsBox.style.display = '';
  }
  stoppingSlideLayer.setAttribute('aria-hidden', 'true');

  // Only the instance that was opened from a segment carries a return point.
  const pendingReturn = (segmentReturn && segmentReturn.forSlide === activeStoppingSlide)
    ? segmentReturn
    : null;

  activeStoppingSlide = null;
  stoppingBulletIndex = 0;

  // If more stopping slides are queued, advance to next slide!
  if (stoppingQueue.length > 0) {
    const nextSlide = stoppingQueue.shift();
    openStoppingSlide(nextSlide);
    return;
  }

  if (resumePlayback && pendingReturn) {
    segmentReturn = null;

    if (!pendingReturn.hadStarted) {
      // Refuge taken before watching anything: begin the teaching at the start.
      playerSeekTo(0);
      lastKnownTime = 0;
      playerPlay();
    } else if (pendingReturn.slide) {
      // Put back the keypoint slide the viewer was reading, still paused.
      openStoppingSlide(pendingReturn.slide);
      return;
    } else {
      // Carry on from where they were; the playhead was never moved.
      playerResume();
    }

    updateTopCornerMenuVisibility();
    return;
  }

  if (resumePlayback) {
    playerResume();

    if (pendingAnnouncements.length > 0) {
      const ann = pendingAnnouncements.shift();
      const resumeTime = playerGetCurrentTime();
      ann.atSeconds = resumeTime;
      ann.untilSeconds = resumeTime + (ann.duration || 8);
      openAnnouncement(ann);
    }
  }

  // Restore top-corner menu button visibility if paused/ended/unstarted
  updateTopCornerMenuVisibility();
}


/**
 * Open timed side panel: fades in over left side without pausing video.
 */
function openTimedPanel(slide) {
  activeTimedSlide = slide;

  timedLabel.textContent = slide.kind === 'takehome' ? 'Take-home lessons' : (slide.kind === 'overview' ? 'Overview' : (slide.kind || 'Note'));
  timedTitle.textContent = slide.title;

  timedBullets.innerHTML = '';
  if (Array.isArray(slide.bullets)) {
    slide.bullets.forEach((bulletText) => {
      const li = document.createElement('li');
      appendWithEmphasis(li, bulletText);
      timedBullets.appendChild(li);
    });
  }

  timedPanelLayer.classList.add('active');
  timedPanelLayer.setAttribute('aria-hidden', 'false');
}

/**
 * Update timed panel bullets progressive reveal based on elapsed time window.
 */
function updateTimedPanelProgress(currentTime) {
  if (!activeTimedSlide) return;
  const bulletElements = timedBullets.querySelectorAll('li');
  const totalBullets = bulletElements.length;
  if (totalBullets === 0) return;

  const elapsed = currentTime - activeTimedSlide.atSeconds;
  const totalDuration = activeTimedSlide.duration;
  const progressRatio = Math.max(0, Math.min(1, elapsed / totalDuration));

  // Distribute bullet appearances evenly across duration
  const bulletsToShow = Math.min(totalBullets, Math.floor(progressRatio * totalBullets) + 1);

  bulletElements.forEach((el, idx) => {
    if (idx < bulletsToShow) {
      el.classList.add('revealed');
    } else {
      el.classList.remove('revealed');
    }
  });
}

/**
 * Close timed side panel.
 */
function closeTimedPanel() {
  if (!activeTimedSlide) return;
  timedPanelLayer.classList.remove('active');
  timedPanelLayer.setAttribute('aria-hidden', 'true');
  activeTimedSlide = null;
}

/**
 * Open lower-third Announcement banner.
 */
function openAnnouncement(slide) {
  activeAnnouncement = slide;

  // Font SIZE is owned by the logical canvas in style.css, exactly as it is for
  // stopping slides. redSize / blackSize are honoured only when a slide author
  // sets them explicitly — an escape hatch, not the normal path. Applying a
  // rem-clamped size here is what made the banner render oversized on phones.
  announcementPrimary.textContent = slide.primaryText || slide.title;
  if (slide.redSize) announcementPrimary.style.fontSize = slide.redSize;
  if (slide.redColor) announcementPrimary.style.color = slide.redColor;
  if (slide.font) announcementPrimary.style.fontFamily = slide.font;

  if (slide.secondaryText && slide.secondaryText.trim() !== '') {
    announcementSecondary.textContent = slide.secondaryText;
    if (slide.blackSize) announcementSecondary.style.fontSize = slide.blackSize;
    if (slide.blackColor) announcementSecondary.style.color = slide.blackColor;
    if (slide.font) announcementSecondary.style.fontFamily = slide.font;
    announcementSecondary.style.display = 'block';
  } else {
    announcementSecondary.style.display = 'none';
  }

  announcementLayer.classList.add('active');
  announcementLayer.setAttribute('aria-hidden', 'false');
}

/**
 * Close lower-third Announcement banner.
 */
function closeAnnouncement() {
  if (!activeAnnouncement) return;
  announcementLayer.classList.remove('active');
  announcementLayer.setAttribute('aria-hidden', 'true');
  activeAnnouncement = null;
}

/* ==========================================================================
   EVENT LISTENERS FOR CONTROLS & INTERACTION
   ========================================================================== */
// Chapters drawer triggers
if (chaptersToggleBtn) {
  chaptersToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChaptersDrawer();
  });
}

if (topCornerMenuBtn) {
  topCornerMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChaptersDrawer();
  });
}


if (chaptersDrawerClose) {
  chaptersDrawerClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeChaptersDrawer();
  });
}

if (chaptersDrawerBackdrop) {
  chaptersDrawerBackdrop.addEventListener('click', (e) => {
    e.stopPropagation();
    closeChaptersDrawer();
  });
}

// Fullscreen toggle triggers
if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFullscreen();
  });
}

if (pseudoFsExitBtn) {
  pseudoFsExitBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exitPseudoFullscreen();
  });
}

document.addEventListener('fullscreenchange', updateFullscreenState);
document.addEventListener('webkitfullscreenchange', updateFullscreenState);

// A click or tap on the slide itself does nothing. It used to advance, but on a
// slide that scrolls, a tap that was meant to start a scroll (or a click that
// misses the scrollbar) skipped the rest of the slide and resumed the video.
// Browsers cannot reliably tell those apart from a deliberate tap, so leaving a
// slide takes an explicit action: the Continue button, Enter or Escape (Space
// on the keyboard also steps through it).

if (backBtn) {
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPreviousTakeaways();
  });
}

// Continue button: reveals the next point while any remain, then continues.
continueBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (continueBtn.disabled) return;
  if (stoppingBulletIndex < stoppingBullets.querySelectorAll('li').length) {
    advanceStoppingBullet();
  } else {
    closeStoppingSlide(true);
  }
});

// Keyboard shortcuts (Space to advance bullets, Enter/Escape to continue/close)
window.addEventListener('keydown', (e) => {
  // Close chapters drawer on Escape
  if (e.code === 'Escape' && chaptersDrawerLayer && chaptersDrawerLayer.classList.contains('active')) {
    e.preventDefault();
    closeChaptersDrawer();
    return;
  }

  // The browser exits native fullscreen on Escape by itself, but pseudo
  // fullscreen is ours to close.
  if (e.code === 'Escape' && !activeStoppingSlide && isPseudoFullscreen()) {
    e.preventDefault();
    exitPseudoFullscreen();
    return;
  }

  if (!activeStoppingSlide) return;

  // When a footer button has focus, let the button handle Space/Enter itself.
  // Otherwise activating the chant button would also advance or close the slide,
  // because the shortcuts below are bound at the window level.
  if (e.target instanceof Element && e.target.closest('.stopping-slide-actions')) {
    if (e.code === 'Space' || e.code === 'Enter') return;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    const bulletElements = stoppingBullets.querySelectorAll('li');
    if (stoppingBulletIndex < bulletElements.length) {
      advanceStoppingBullet();
    } else {
      closeStoppingSlide(true);
    }
  } else if (e.code === 'Enter' || e.code === 'Escape') {
    e.preventDefault();
    closeStoppingSlide(true);
  }
});

/* ==========================================================================
   TIMESTAMP-WATCHING LOOP
   Polls player time at high frequency (~100ms) to trigger slides and re-arm.
   ========================================================================== */
/* Lights up the segment the given time falls in, in the segments list and the
   chapters drawer. */
function highlightActiveSegment(time) {
  let activeIndex = -1;
  for (let i = 0; i < normalizedSegments.length; i++) {
    // Action segments open a slide; they are not places in the video, so they
    // never light up as "where we are".
    if (normalizedSegments[i].opensSlideIndex !== undefined) continue;
    if (time >= normalizedSegments[i].atSeconds) {
      activeIndex = i;
    }
  }
  normalizedSegments.forEach((seg) => {
    const btn = document.getElementById(`segment-btn-${seg.index}`);
    if (btn) {
      if (seg.index === activeIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
    const drawerBtn = document.getElementById(`drawer-chapter-btn-${seg.index}`);
    if (drawerBtn) {
      if (seg.index === activeIndex) {
        drawerBtn.classList.add('active');
      } else {
        drawerBtn.classList.remove('active');
      }
    }
  });
}

function checkPlaybackTime() {
  const currentTime = playerGetCurrentTime();
  const duration = playerGetDuration();

  // A segment was chosen before the video first played. Until it does, the
  // reported time is not trustworthy: a browser that dropped the seek reports
  // 0:00, which the rewind check below would read as the viewer going back and
  // close the slide they are reading. Show where they asked to be and wait for
  // playback (onStateChange makes sure it starts there).
  if (pendingSeekTarget !== null) {
    timeDisplay.textContent = `${formatTime(pendingSeekTarget)} / ${formatTime(duration)}`;
    highlightActiveSegment(pendingSeekTarget);
    return;
  }

  // Update control bar timestamp
  timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;

  // Hold everything below until a seek in flight has landed (see
  // seekLandingTarget).
  if (seekLandingTarget !== null) {
    const landed = Math.abs(currentTime - seekLandingTarget) <= SEEK_LANDED_TOLERANCE_SECONDS;
    if (!landed && Date.now() < seekLandingDeadline) return;
    seekLandingTarget = null;
  }

  // 1. RE-ARMING ON REWIND: If user rewinds backwards before a slide timestamp, reset its passed state
  if (currentTime < lastKnownTime - 0.5) {
    normalizedSlides.forEach((slide) => {
      if (currentTime < slide.atSeconds - 0.2) {
        slide.passed = false;
      }
    });
    // If rewound out of active stopping slide range, clear queue and close
    if (activeStoppingSlide && currentTime < activeStoppingSlide.atSeconds - 0.2) {
      stoppingQueue = [];
      closeStoppingSlide(false);
    }
    // If rewound out of timed slide range, close timed panel
    if (activeTimedSlide && (currentTime < activeTimedSlide.atSeconds || currentTime > activeTimedSlide.untilSeconds)) {
      closeTimedPanel();
    }
    // If rewound out of announcement range, close announcement
    if (activeAnnouncement && (currentTime < activeAnnouncement.atSeconds || currentTime > activeAnnouncement.untilSeconds)) {
      closeAnnouncement();
    }
  }
  lastKnownTime = currentTime;

  // 2. ACTIVE SEGMENT HIGHLIGHT in segment list and in-player chapters drawer
  highlightActiveSegment(currentTime);


  // 3. SLIDE & ANNOUNCEMENT TRIGGER DETECTION
  const pauseEnabled = pauseToggle.checked;
  const triggeredStoppingSlides = [];
  const triggeredAnnouncements = [];

  normalizedSlides.forEach((slide) => {
    // A slide may be listed in the segments panel and still be reached by the
    // teaching (the dedication). Only skip the ones that are not on the timeline
    // at all (the refuge slide).
    if (!slide.onTimeline) return;
    // Trigger condition: current time reached marker and slide hasn't fired yet
    if (!slide.passed && currentTime >= slide.atSeconds && currentTime < slide.atSeconds + SLIDE_TRIGGER_WINDOW_SECONDS) {
      slide.passed = true;

      if (slide.kind === 'announcement') {
        if (slide.pause && pauseEnabled) {
          triggeredStoppingSlides.push(slide);
        } else {
          triggeredAnnouncements.push(slide);
        }
      } else if (slide.isStopping) {
        if (pauseEnabled) {
          triggeredStoppingSlides.push(slide);
        }
      } else {
        // Timed side panel slide
        openTimedPanel(slide);
      }
    }
  });

  // If one or more stopping slides were triggered
  if (triggeredStoppingSlides.length > 0) {
    showStoppingSlides(triggeredStoppingSlides);
  }

  // Handle triggered announcements
  if (triggeredAnnouncements.length > 0) {
    if (activeStoppingSlide || stoppingQueue.length > 0 || triggeredStoppingSlides.length > 0) {
      // Defer announcement until stopping slides finish and video resumes
      pendingAnnouncements.push(...triggeredAnnouncements);
    } else {
      openAnnouncement(triggeredAnnouncements[0]);
    }
  }

  // 4. TIMED PANEL & ANNOUNCEMENT UPDATE & DISMISSAL
  if (activeTimedSlide) {
    if (currentTime >= activeTimedSlide.untilSeconds || currentTime < activeTimedSlide.atSeconds) {
      closeTimedPanel();
    } else {
      updateTimedPanelProgress(currentTime);
    }
  }

  if (activeAnnouncement) {
    if (currentTime >= activeAnnouncement.untilSeconds || currentTime < activeAnnouncement.atSeconds) {
      closeAnnouncement();
    }
  }

  // Continuously sync top-corner menu button visibility
  updateTopCornerMenuVisibility();
}

// Run timestamp check loop every 100ms
setInterval(checkPlaybackTime, 100);

/* ==========================================================================
   YOUTUBE IFRAME API INITIALIZATION
   ========================================================================== */
// Load YouTube IFrame API script asynchronously
const ytTag = document.createElement('script');
ytTag.src = "https://www.youtube.com/iframe_api";
const firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(ytTag, firstScript);

window.onYouTubeIframeAPIReady = function() {
  ytPlayerInstance = new YT.Player('yt-player', {
    videoId: currentVideoId,

    playerVars: {
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      // YouTube's own fullscreen button (and double-click-to-fullscreen) hands
      // the frame to the iframe — on iPhone, to Apple's native video player —
      // where none of our overlays can render: no slides, no chapters button
      // (CLAUDE.md invariant 6). Our fullscreen button in the control bar keeps
      // everything in our DOM, so it is the only one offered.
      fs: 0
    },
    events: {
      onReady: function(event) {
        isPlayerReady = true;
        updateTopCornerMenuVisibility();
      },
      onStateChange: function(event) {
        updateTopCornerMenuVisibility();
        // Re-arm slides if video is re-played from start
        if (event.data === YT.PlayerState.PLAYING) {
          hasStartedPlayback = true;
          const cur = playerGetCurrentTime();
          // First playback after a segment was chosen: if the browser dropped
          // that seek and started from the beginning, go where the viewer asked.
          if (pendingSeekTarget !== null) {
            const target = pendingSeekTarget;
            pendingSeekTarget = null;
            if (Math.abs(cur - target) > SEEK_LANDED_TOLERANCE_SECONDS) {
              holdUntilSeekLands(target);
              playerSeekTo(target);
              return;
            }
          }
          if (cur < 1.0) {
            normalizedSlides.forEach(s => s.passed = false);
          }
        }
      }
    }
  });
};



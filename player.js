/**
 * player.js
 * Video Player Adapter, Timeline Synchronization Loop, and Overlay Engine.
 *
 * Consumes configuration and slide data defined in slides-data.js:
 * - VIDEO_ID
 * - SLIDE_BG
 * - SEGMENTS
 * - SLIDES
 */

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

// Resolve lesson data from global scope or window object
const currentVideoId = typeof VIDEO_ID !== 'undefined' ? VIDEO_ID : (typeof window !== 'undefined' && window.VIDEO_ID ? window.VIDEO_ID : "j8WneixXOV4");
const currentSlideBg = typeof SLIDE_BG !== 'undefined' ? SLIDE_BG : (typeof window !== 'undefined' && window.SLIDE_BG ? window.SLIDE_BG : "slides/slide-1.png");
const currentSegments = typeof SEGMENTS !== 'undefined' ? SEGMENTS : (typeof window !== 'undefined' && window.SEGMENTS ? window.SEGMENTS : []);
const currentSlides = typeof SLIDES !== 'undefined' ? SLIDES : (typeof window !== 'undefined' && window.SLIDES ? window.SLIDES : []);

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

  // 3. Sort chronologically by timestamp
  merged.sort((a, b) => a.atSeconds - b.atSeconds);

  // 4. Assign sequential index
  return merged.map((seg, index) => ({
    ...seg,
    index
  }));
}

const normalizedSegments = buildSegmentsList();

// Priority ordering for slides triggered at identical timestamps:
// 1. takeaways (shown first)
// 2. coming-up (shown second)
// 3. final slide (shown after takeaways / coming-up)
// 4. other stopping slides
// 5. announcements (shown after stopping slides when video resumes)
// 6. timed side panels
function getSlidePriority(slide) {
  if (slide.kind === 'takeaways') return 1;
  if (slide.kind === 'coming-up') return 2;
  if (slide.kind === 'final' || slide.kind === 'final-slide') return 3;
  if (slide.isStopping) return 4;
  if (slide.kind === 'announcement') return 5;
  return 6;
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
const fullscreenIconExpand = document.getElementById('fullscreen-icon-expand');
const fullscreenIconCompress = document.getElementById('fullscreen-icon-compress');


// Stopping slide elements
const stoppingSlideLayer = document.getElementById('stopping-slide');
const stoppingLabel = document.getElementById('stopping-label');
const stoppingTitle = document.getElementById('stopping-title');
const stoppingBulletsBox = document.getElementById('stopping-bullets-box');
const stoppingBullets = document.getElementById('stopping-bullets');
const continueBtn = document.getElementById('continue-btn');
const continueBtnText = document.getElementById('continue-btn-text');
const slideHint = document.getElementById('slide-hint');

// Timed panel elements
const timedPanelLayer = document.getElementById('timed-panel');
const timedLabel = document.getElementById('timed-label');
const timedTitle = document.getElementById('timed-title');
const timedBullets = document.getElementById('timed-bullets');

// Announcement elements
const announcementLayer = document.getElementById('announcement-layer');
const announcementPrimary = document.getElementById('announcement-primary');
const announcementSecondary = document.getElementById('announcement-secondary');

// State
let activeStoppingSlide = null;
let stoppingQueue = [];
let pendingAnnouncements = [];
let stoppingBulletIndex = 0;
let stoppingTimer = null;
let activeTimedSlide = null;
let activeAnnouncement = null;
let lastKnownTime = 0;

/* Apply optional custom background if provided */
if (currentSlideBg && currentSlideBg.trim() !== "") {
  stoppingSlideLayer.style.backgroundImage = `url('${currentSlideBg}')`;
}

/* ==========================================================================
   SEGMENTS & CHAPTERS RENDERING & NAVIGATION
   ========================================================================== */
function seekToSegment(seg) {
  // If a stopping slide was open or queued, clear and close
  stoppingQueue = [];
  pendingAnnouncements = [];
  if (activeStoppingSlide) {
    closeStoppingSlide(false);
  }
  if (activeAnnouncement) {
    closeAnnouncement();
  }

  // Reset passed state for slides at or after this timestamp so stopping slides fire
  normalizedSlides.forEach((slide) => {
    if (slide.atSeconds >= seg.atSeconds - 0.5) {
      slide.passed = false;
    }
  });
  lastKnownTime = seg.atSeconds;

  playerSeekTo(seg.atSeconds);
  playerPlay();
}

function renderSegmentsList() {
  if (!segmentsList) return;
  segmentsList.innerHTML = '';
  normalizedSegments.forEach((seg) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'segment-button';
    btn.id = `segment-btn-${seg.index}`;
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', `Seek to ${seg.title} at ${formatTime(seg.atSeconds)}`);

    const timeSpan = document.createElement('span');
    timeSpan.className = 'segment-timestamp';
    timeSpan.textContent = formatTime(seg.atSeconds);

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

    btn.addEventListener('click', () => {
      seekToSegment(seg);
    });

    li.appendChild(btn);
    segmentsList.appendChild(li);
  });
}

function renderChaptersDrawer() {
  if (!chaptersDrawerList) return;
  chaptersDrawerList.innerHTML = '';
  normalizedSegments.forEach((seg) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'drawer-chapter-btn';
    btn.id = `drawer-chapter-btn-${seg.index}`;
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', `Jump to ${seg.title} at ${formatTime(seg.atSeconds)}`);

    const timeSpan = document.createElement('span');
    timeSpan.className = 'drawer-timestamp';
    timeSpan.textContent = formatTime(seg.atSeconds);

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

    btn.addEventListener('click', () => {
      closeChaptersDrawer();
      seekToSegment(seg);
    });

    li.appendChild(btn);
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

  // 3. Check YouTube player state: visible when paused (2), unstarted (-1), ended (0), cued (5)
  const state = playerGetState();
  const isPlaying = (state === 1); // 1 = YT.PlayerState.PLAYING

  if (!isPlaying) {
    topCornerMenuBtn.classList.add('is-visible');
  } else {
    topCornerMenuBtn.classList.remove('is-visible');
  }
}

/* Fullscreen Controller */
function toggleFullscreen() {
  if (!playerBox) return;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (playerBox.requestFullscreen) {
      playerBox.requestFullscreen().catch(err => console.warn('Fullscreen request failed:', err));
    } else if (playerBox.webkitRequestFullscreen) {
      playerBox.webkitRequestFullscreen();
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
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  if (fullscreenIconExpand && fullscreenIconCompress) {
    fullscreenIconExpand.style.display = isFs ? 'none' : 'block';
    fullscreenIconCompress.style.display = isFs ? 'block' : 'none';
  }
  if (fullscreenBtn) {
    fullscreenBtn.classList.toggle('active', isFs);
  }
}

renderSegmentsList();
renderChaptersDrawer();
updateTopCornerMenuVisibility();



/* ==========================================================================
   SLIDE & ANNOUNCEMENT OPEN / CLOSE FUNCTIONS
   Handles stopping slides, timed side panels, and lower-third announcements.
   ========================================================================== */

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
  stoppingSlideLayer.classList.toggle('coming-up-mode', isComingUp);
  stoppingSlideLayer.classList.toggle('takeaways-mode', isTakeaways);
  stoppingSlideLayer.classList.toggle('final-mode', isFinal);

  // Automatic density detection: if 5+ bullets or 340+ characters, apply dense mode
  const totalChars = Array.isArray(slide.bullets) ? slide.bullets.reduce((acc, b) => acc + (b ? b.length : 0), 0) : 0;
  const bulletCount = Array.isArray(slide.bullets) ? slide.bullets.length : 0;
  const isDense = slide.density === 'compact' || slide.density === 'dense' || (slide.density !== 'spacious' && (bulletCount >= 5 || totalChars >= 340));
  stoppingSlideLayer.classList.toggle('is-dense', isDense);

  // Set background image
  const bgImage = slide.bg || currentSlideBg;

  if (bgImage && bgImage.trim() !== '') {
    stoppingSlideLayer.style.backgroundImage = `url('${bgImage}')`;
  } else {
    stoppingSlideLayer.style.backgroundImage = 'none';
  }

  // Category label (hide for coming-up, takeaways, and final)
  if (isComingUp || isTakeaways || isFinal) {
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

  // Set heading text & font styling
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
      li.textContent = bulletText;
      stoppingBullets.appendChild(li);
    });
  }

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
    continueBtn.disabled = true;
    continueBtn.classList.remove('ready');
    slideHint.textContent = 'Click or press Space for next point';
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

  // If all bullets are shown, enable Continue button
  if (stoppingBulletIndex >= bulletElements.length) {
    continueBtn.disabled = false;
    continueBtn.classList.add('ready');
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
  stoppingSlideLayer.classList.remove('is-dense');
  if (stoppingBulletsBox) {
    stoppingBulletsBox.style.display = '';
  }
  stoppingSlideLayer.setAttribute('aria-hidden', 'true');
  activeStoppingSlide = null;
  stoppingBulletIndex = 0;

  // If more stopping slides are queued, advance to next slide!
  if (stoppingQueue.length > 0) {
    const nextSlide = stoppingQueue.shift();
    openStoppingSlide(nextSlide);
    return;
  }

  if (resumePlayback) {
    playerPlay();

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
      li.textContent = bulletText;
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

document.addEventListener('fullscreenchange', updateFullscreenState);
document.addEventListener('webkitfullscreenchange', updateFullscreenState);

// Click on stopping slide triggers next bullet
stoppingSlideLayer.addEventListener('click', (e) => {
  // If click was on the Continue button, handle continue
  if (e.target.closest('#continue-btn')) {
    if (!continueBtn.disabled) {
      closeStoppingSlide(true);
    }
    return;
  }

  // If more bullets remain, show next bullet
  const bulletElements = stoppingBullets.querySelectorAll('li');
  if (stoppingBulletIndex < bulletElements.length) {
    advanceStoppingBullet();
  } else {
    // If all bullets already revealed, clicking slide also continues
    closeStoppingSlide(true);
  }
});

// Continue button click
continueBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!continueBtn.disabled) {
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

  if (!activeStoppingSlide) return;

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
function checkPlaybackTime() {
  const currentTime = playerGetCurrentTime();
  const duration = playerGetDuration();

  // Update control bar timestamp
  timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;

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
  let activeIndex = -1;
  for (let i = 0; i < normalizedSegments.length; i++) {
    if (currentTime >= normalizedSegments[i].atSeconds) {
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


  // 3. SLIDE & ANNOUNCEMENT TRIGGER DETECTION
  const pauseEnabled = pauseToggle.checked;
  const triggeredStoppingSlides = [];
  const triggeredAnnouncements = [];

  normalizedSlides.forEach((slide) => {
    // Trigger condition: current time reached marker and slide hasn't fired yet
    if (!slide.passed && currentTime >= slide.atSeconds && currentTime < slide.atSeconds + 2.0) {
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
    triggeredStoppingSlides.sort((a, b) => getSlidePriority(a) - getSlidePriority(b));
    if (!activeStoppingSlide) {
      playerPause();
      const firstSlide = triggeredStoppingSlides.shift();
      stoppingQueue.push(...triggeredStoppingSlides);
      openStoppingSlide(firstSlide);
    } else {
      stoppingQueue.push(...triggeredStoppingSlides);
    }
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
      fs: 1
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
          const cur = playerGetCurrentTime();
          if (cur < 1.0) {
            normalizedSlides.forEach(s => s.passed = false);
          }
        }
      }
    }
  });
};



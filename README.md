# KKGR Player — Interactive Video Slide Player

An interactive, responsive video lecture player designed for Dharma teachings and structured educational videos. It synchronizes YouTube playback with full-frame interactive stopping slides, timed side panels, lower-third announcement banners, an in-player chapters drawer, and responsive video chapters.

---

## 📁 Architecture & Directory Structure

```
kkgr-player/
├── index.html              # Main application markup & DOM container structure (< 120 lines)
├── style.css               # Design system, CSS variables, overlays, responsive typography, drawer & fullscreen styles
├── slides-data.js          # Active lesson data (VIDEO_ID, SEGMENTS, SLIDES, announcements)
├── player.js               # Core engine: YouTube API adapter, time sync loop, drawer & fullscreen controller
├── slide-utils/            # Modular slide factory helper functions
│   ├── index.js            # Central export hub for slide helper functions
│   ├── announcement.js     # Lower-third banner generator
│   ├── coming-up.js        # "Coming up" stopping slide generator
│   ├── takeaways.js        # "Some takeaways" stopping slide generator
│   └── final-slide.js      # Closing lesson slide generator
├── slides/                 # Background artwork and graphic assets
│   ├── coming-up-bg.png
│   ├── takeaways-bg.png
│   └── slide-1.png
├── package.json            # Vite build scripts & dev dependencies
└── README.md               # Architecture documentation & generalization guide
```

---

## 🧩 Layer Responsibilities

### 1. Presentation & Structure (`index.html` & `style.css`)
- **`index.html`**: Contains the 16:9 player container (`#player-box`), YouTube iframe anchor (`#yt-player`), overlay DOM elements (`#stopping-slide`, `#timed-panel`, `#announcement-layer`, `#chapters-drawer`), control bar with chapters toggle & fullscreen buttons, and segments list.
- **`style.css`**: Defines design tokens (celadon green palette, typography with *Cinzel*, *Crimson Pro*, *Lora*, and *Plus Jakarta Sans*), container queries (`cqw`), frosted glassmorphism overlays, in-player chapters drawer animations, and container fullscreen styles.

### 2. Slide Factory Utilities (`slide-utils/`)
Provides standardized helper functions to construct slide objects with automatic reading-time calculation (130 words per minute rate):
- `announcement(primaryText, secondaryText, options)`: Lower-third banner.
- `comingUp(bullets, options)`: Full-screen pausing slide previewing upcoming points.
- `takeaways(bullets, options)`: Full-screen pausing slide reviewing key takeaways with frosted box container.
- `finalSlide(title, options)`: Lesson completion slide.
- `stoppingSlide(...)` / `timedPanel(...)` / `segment(...)`: Custom slide and chapter constructors.

### 3. Lesson Data Layer (`slides-data.js`)
Separates content from code. Contains:
- `VIDEO_ID`: YouTube video identifier.
- `SLIDE_BG`: Default slide background graphic.
- `SEGMENTS`: Explicit chapter marks for the segment list.
- `SLIDES`: Array of ordered slide objects (`announcement`, `comingUp`, `takeaways`, `finalSlide`).

### 4. Playback & Overlay Engine (`player.js`)
- **YouTube API Adapter**: Standardized wrapper (`playerPlay`, `playerPause`, `playerSeekTo`, `playerGetCurrentTime`).
- **Timestamp Engine**: 100ms polling loop (`checkPlaybackTime`) matching video time with slide timestamps and active chapter highlighting.
- **In-Player Chapters Drawer**: Instant 1-tap chapter menu accessible directly over the video without scrolling away. Synchronizes active segment selection between bottom list and in-player drawer.
- **Container Fullscreen Controller**: Enables the entire player container (`#player-box`) to expand into full screen on desktop and mobile, ensuring all stopping slides, announcements, and chapters menus remain active and functional in full screen.
- **Queue & Priority Management**: If multiple overlays trigger at the same timestamp, they resolve in priority order:
  1. *Takeaways Slide* (pauses video)
  2. *Coming Up Slide* (pauses video)
  3. *Final Slide*
  4. *Announcements* (deferred until user clicks Continue and video resumes)
- **Re-arming on Rewind**: Automatically re-arms passed slides if the user scrubs backwards in the video.
- **Keyboard & Click Handlers**:
  - `Space`: Reveal next bullet / advance.
  - `Enter` / `Escape`: Continue video playback or close chapters drawer.
  - Clicking the slide reveals remaining bullets or resumes playback when finished.

---

## 📝 Slide & Announcement Data Specification

When defining slides in `slides-data.js`:

```javascript
// 1. Lower-third Announcement
announcement(
  "Primary Heading (e.g. Chapter Title)",
  "Secondary Subtitle (e.g. Description)",
  { at: "0:29", duration: 8 } // 'at' supports "m:ss", "mm:ss", "hh:mm:ss.ms"
)

// 2. "Coming Up" Keypoints Stopping Slide
comingUp([
  "First bullet point text...",
  "Second bullet point text...",
  "Third bullet point text..."
], {
  at: "00:03:05.000",
  title: "Coming up",
  buttonText: "Continue lesson"
})

// 3. "Some Takeaways" Stopping Slide
takeaways([
  "Key takeaway point 1...",
  "Key takeaway point 2..."
], {
  at: "00:17:48.233",
  title: "Some takeaways",
  boxBg: "rgba(96, 145, 149, 0.50)"
})

// 4. Final Closing Slide
finalSlide("Thanks for watching!", {
  at: "00:53:32.933"
})
```

---

## 🚀 How Future Agents Can Generalize to Multiple Videos

To generalize this codebase from a single video player to a **multi-video player / course player**:

### Option A: Multiple Lesson Data Files with a Loader
1. Create a `lessons/` folder containing standalone lesson data files (e.g. `lessons/lesson-1.js`, `lessons/lesson-2.js` or JSON files `lessons/lesson-1.json`).
2. Update `player.js` to accept a `lessonData` configuration object rather than reading global constants:
   ```javascript
   function loadLesson(lessonConfig) {
     window.activeLesson = lessonConfig;
     // Re-initialize YouTube video ID, segments list, and slide timelines
     initPlayer(lessonConfig.videoId, lessonConfig.segments, lessonConfig.slides);
   }
   ```
3. Read the current lesson from URL query params (e.g. `?lesson=lesson-1` or `?v=VIDEO_ID`) or a dropdown selector in the header.

### Option B: Pure JSON Course Curriculum
1. Store lessons as JSON files:
   ```json
   {
     "id": "lesson-1",
     "title": "Jewel Ornament of Liberation - Part 1",
     "videoId": "j8WneixXOV4",
     "bg": "slides/coming-up-bg.png",
     "segments": [...],
     "slides": [...]
   }
   ```
2. Fetch the JSON file dynamically with `fetch('/lessons/' + lessonId + '.json')` and pass to `player.js`.

---

## 🛠️ Development & Building

- **Start dev server**:
  ```bash
  npm run dev
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
- **Preview production build**:
  ```bash
  npm run preview
  ```


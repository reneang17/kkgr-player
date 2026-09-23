/**
 * landing.js
 * Renders the lesson list on the landing page from the registry.
 *
 * Reads only the descriptor fields that identify a lesson (id, name, title,
 * subtitle, videoId). It never imports the engine: the landing page does not
 * play anything, and keeping player.js off this page means it does not load the
 * YouTube API just to show a list.
 */

import { LESSONS, lessonUrl } from './lessons/index.js';

/**
 * YouTube's medium-quality still (320x180). Using the video's own thumbnail
 * means a new lesson needs no artwork to be listed.
 */
function thumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/mqdefault.jpg`;
}

function renderLessonCard(lesson, position) {
  const item = document.createElement('li');
  item.className = 'lesson-card';

  const link = document.createElement('a');
  link.className = 'lesson-card-link';
  link.href = lessonUrl(lesson.id);

  if (lesson.videoId) {
    const img = document.createElement('img');
    img.className = 'lesson-card-thumb';
    img.src = thumbnailUrl(lesson.videoId);
    img.alt = '';            // decorative: the heading beside it names the lesson
    img.loading = 'lazy';
    img.width = 320;
    img.height = 180;
    link.appendChild(img);
  }

  const text = document.createElement('div');
  text.className = 'lesson-card-text';

  const number = document.createElement('span');
  number.className = 'lesson-card-number';
  number.textContent = `Teaching ${position}`;

  const heading = document.createElement('h2');
  heading.className = 'lesson-card-title';
  // Older or injected descriptors may lack `name`; fall back to the id so the
  // card is never blank.
  heading.textContent = lesson.name || lesson.id;

  const subtitle = document.createElement('p');
  subtitle.className = 'lesson-card-subtitle';
  subtitle.textContent = lesson.subtitle || '';

  text.append(number, heading, subtitle);
  link.appendChild(text);
  item.appendChild(link);
  return item;
}

const list = document.getElementById('lesson-list');
if (list) {
  Object.values(LESSONS).forEach((lesson, i) => {
    list.appendChild(renderLessonCard(lesson, i + 1));
  });
}

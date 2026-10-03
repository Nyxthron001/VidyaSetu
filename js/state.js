// State management, localStorage persistence & app utilities

const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
};

let state = {
  themeMode: store.get('themeMode', 'system'),
  accessibility: store.get('accessibilityPreferences', { textSize: 'normal', highContrast: false, reducedMotion: false }),
  demoOffline: store.get('demoOffline', false),
  language: store.get('selectedLanguage', 'hi'),
  downloadQuality: store.get('downloadQuality', 'Text + Audio'),
  syncState: 'online', // online | offline | syncing | synced | failed
  lastSync: store.get('lastSyncTime', null)
};

function applyPrefs() {
  const html = document.documentElement;
  html.setAttribute('data-theme', state.themeMode === 'system' ? '' : state.themeMode);
  html.setAttribute('data-contrast', state.accessibility.highContrast ? 'high' : '');
  html.setAttribute('lang', state.language === 'hi' ? 'hi' : 'en');
  document.body.classList.toggle('large', state.accessibility.textSize === 'large');
  document.body.classList.toggle('xlarge', state.accessibility.textSize === 'xlarge');
  document.body.classList.toggle('reduce-motion', !!state.accessibility.reducedMotion);
}

function toast(msg) {
  const wrap = document.getElementById('toasts');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function setOfflineBadge() {
  const isOffline = state.demoOffline || !navigator.onLine;
  state.syncState = isOffline ? 'offline' : (state.syncState === 'offline' ? 'online' : state.syncState);
  if (typeof render === 'function') render();
}

window.addEventListener('online', () => {
  if (!state.demoOffline) {
    state.syncState = 'syncing';
    if (typeof render === 'function') render();
    setTimeout(() => {
      state.syncState = 'synced';
      syncPending();
      state.lastSync = Date.now();
      toast(t('progress_synced_toast'));
      if (typeof render === 'function') render();
    }, 1200);
  }
});

window.addEventListener('offline', () => {
  toast(t('you_are_offline_toast'));
  setOfflineBadge();
});

function badgeInfo() {
  const isOffline = state.demoOffline || !navigator.onLine;
  if (isOffline) return { cls: 'offline', label: t('badge_offline') };
  if (state.syncState === 'syncing') return { cls: 'syncing', label: t('badge_syncing') };
  if (state.syncState === 'failed') return { cls: 'failed', label: t('badge_failed') };
  return { cls: 'online', label: state.lastSync ? t('badge_synced') : t('badge_online') };
}

function getLessonProgress(courseId) {
  const all = store.get('lessonProgress', {});
  return all[courseId] || [];
}

function markLessonDone(courseId, idx) {
  const all = store.get('lessonProgress', {});
  all[courseId] = Array.from(new Set([...(all[courseId] || []), parseInt(idx)]));
  store.set('lessonProgress', all);
  toast(t('lesson_saved_toast') || 'Your lesson progress was saved.');
  if (typeof render === 'function') render();
}

function toggleBookmark(courseId, idx) {
  const marks = store.get('bookmarks', []);
  const key = courseId + ':' + idx;
  const i = marks.indexOf(key);
  if (i > -1) marks.splice(i, 1);
  else marks.push(key);
  store.set('bookmarks', marks);
  toast(i > -1 ? t('bookmark_removed') : t('bookmark_added'));
}

function saveQuizResult(courseId, score, total) {
  const results = store.get('quizResults', []);
  results.push({ courseId, score, total, date: new Date().toISOString() });
  store.set('quizResults', results);
}

function finishQuiz(courseId) {
  let score = 0;
  QUIZ.forEach((q, i) => {
    if (quizState.answers[i] === q.correct) score++;
  });
  saveQuizResult(courseId, score, QUIZ.length);
  location.hash = '#/courses/' + courseId + '/quiz/result';
}

function queueDoubtOffline(courseTitle, text) {
  const pending = store.get('pendingSyncItems', []);
  pending.push({ type: 'doubt', course: courseTitle, text, ts: Date.now() });
  store.set('pendingSyncItems', pending);
}

function syncPending() {
  const pending = store.get('pendingSyncItems', []);
  if (pending.length) {
    store.set('pendingSyncItems', []);
  }
  store.set('lastSyncTime', Date.now());
}

// Audio Player State & Controls
let audio = { playing: false, pos: 0, dur: 180, speed: 1, showTranscript: false };

function toggleAudioPlay() {
  audio.playing = !audio.playing;
  render();
  if (audio.playing) tickAudio();
}

function tickAudio() {
  if (!audio.playing) return;
  audio.pos = Math.min(audio.dur, audio.pos + Math.round(1 * audio.speed));
  if (audio.pos >= audio.dur) audio.playing = false;
  render();
  if (audio.playing) setTimeout(tickAudio, 1000);
}

function skipAudio(d) {
  audio.pos = Math.max(0, Math.min(audio.dur, audio.pos + d));
  render();
}

// Speech Synthesis
function speakLesson() {
  if (!('speechSynthesis' in window)) {
    toast(t('read_aloud_unsupported'));
    return;
  }
  const el = document.querySelector('#main p');
  if (!el) return;
  const u = new SpeechSynthesisUtterance(el.innerText);
  u.lang = state.language === 'hi' ? 'hi-IN' : 'en-US';
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function speakDoubtReply() {
  if (!('speechSynthesis' in window)) {
    toast('Read aloud is not supported on this device.');
    return;
  }
  const el = document.querySelector('.card.pink p');
  if (!el) return;
  const u = new SpeechSynthesisUtterance(el.innerText);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// Quiz UI State
let quizState = { i: 0, answers: [], flags: [] };
let showSubmitConfirm = false;

// Library Filter State
let libState = { q: '', filter: 'All', sort: 'Recommended' };

// Notifications State
let notifFilter = 'all';

// Downloads Actions
function deleteDownload(id) {
  DOWNLOADS = DOWNLOADS.filter(d => d.id !== id);
  toast(t('download_removed_toast'));
  render();
}

function pauseDownload(id) {
  const d = DOWNLOADS.find(x => x.id === id);
  if (d) d.state = 'paused';
  render();
}

function resumeDownload(id) {
  const d = DOWNLOADS.find(x => x.id === id);
  if (d) {
    d.state = 'downloading';
    render();
    tickDownload(id);
  }
}

function retryDownload(id) {
  const d = DOWNLOADS.find(x => x.id === id);
  if (d) {
    d.state = 'downloading';
    d.progress = 0;
    render();
    tickDownload(id);
  }
}

function tickDownload(id) {
  const d = DOWNLOADS.find(x => x.id === id);
  if (!d || d.state !== 'downloading') return;
  d.progress = Math.min(100, d.progress + 15);
  if (d.progress >= 100) {
    d.state = 'done';
    toast(t('course_downloaded_toast'));
  }
  render();
  if (d.state === 'downloading') setTimeout(() => tickDownload(id), 900);
}

// Mentorship Doubt Submission
function submitDoubt() {
  const offline = state.demoOffline || !navigator.onLine;
  const course = document.getElementById('doubtCourse').value;
  const text = document.getElementById('doubtText').value;
  if (offline) queueDoubtOffline(course, text);
  const msgEl = document.getElementById('doubtMsg');
  if (msgEl) {
    msgEl.textContent = offline ? t('doubt_saved_offline') : t('doubt_sent_msg');
  }
  toast(offline ? t('doubt_queued_toast') : t('doubt_sent_toast'));
}

// Clear Local Data
let confirmClearData = false;

function clearAllLocalData() {
  [
    'themeMode', 'accessibilityPreferences', 'demoOffline', 'selectedLanguage',
    'lessonProgress', 'bookmarks', 'quizResults', 'pendingSyncItems',
    'lastSyncTime', 'downloadQuality', 'onboarded'
  ].forEach(k => localStorage.removeItem(k));
  confirmClearData = false;
  toast(t('data_cleared_toast'));
  location.hash = '#/home';
}

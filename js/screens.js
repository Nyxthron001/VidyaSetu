// UI Screen Components and Views for VidyaSetu

function petal() {
  return '<span class="petal" aria-hidden="true"></span>';
}

function topbar() {
  const b = badgeInfo();
  return `<header class="topbar">
    <div class="logo"><img src="assets/logo-small.png" alt="VidyaSetu logo"> VidyaSetu</div>
    <span class="badge ${b.cls}"><span class="dot"></span>${b.label}</span>
    <div class="topbar-spacer"></div>
    <button class="icon-btn" aria-label="${t('notifications')}" onclick="location.hash='#/notifications'">🔔</button>
    <button class="icon-btn" aria-label="${t('accessibility_settings')}" onclick="location.hash='#/settings'">♿</button>
  </header>`;
}

function sidebar(current) {
  return `<nav class="sidebar" aria-label="Primary">${NAV.map(n => `<a href="${n.path}" class="${current === n.path ? 'active' : ''}"><span aria-hidden="true">${n.icon}</span> ${t(n.key)}</a>`).join('')}</nav>`;
}

function bottomnav(current) {
  return `<nav class="bottomnav" aria-label="Primary">${NAV.map(n => `<a href="${n.path}" class="${current === n.path ? 'active' : ''}"><span class="ic" aria-hidden="true">${n.icon}</span>${t(n.key)}</a>`).join('')}</nav>`;
}

function courseCard(c) {
  const btnLabel = c.status === 'downloaded' ? t('continue_learning') : (c.progress > 0 ? t('continue_learning') : t('view_details'));
  return `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:start;gap:8px">
      <div>
        <h3 style="font-size:1rem">${c.title}</h3>
        <div class="muted">${c.level} · ${c.lessons} lessons · ${c.size} · ${c.langs}</div>
      </div>
      ${c.status === 'downloaded' ? `<span class="badge online" style="white-space:nowrap"><span class="dot"></span>${t('downloaded')}</span>` : ''}
    </div>
    <p class="muted" style="margin:8px 0">${c.desc}</p>
    <div class="progress" role="progressbar" aria-valuenow="${c.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="${c.title} progress"><div style="width:${c.progress}%"></div></div>
    <div class="muted" style="margin:4px 0 10px">${c.progress}${t('percent_complete')}</div>
    <button class="btn btn-primary" onclick="location.hash='#/courses/${c.id}'">${btnLabel}</button>
  </div>`;
}

function homeScreen() {
  const active = COURSES.filter(c => c.status !== 'not-started').length;
  const lessonsDone = 5, doubtsPending = 1;
  const current = COURSES[0];
  const rec = COURSES[2];
  return `
  <h1 style="font-size:1.4rem">${t('good_evening')} ${STUDENT.name.split(' ')[0]}</h1>
  <p class="muted">${t('home_tagline')}</p>

  <div class="card pink">
    <h3>${t('continue_learning')}</h3>
    <div>${current.title}</div>
    <div class="muted">${t('current_lesson')} Email Basics</div>
    <div class="progress" style="margin:10px 0" role="progressbar" aria-valuenow="${current.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Course progress"><div style="width:${current.progress}%"></div></div>
    <div class="muted" style="margin-bottom:10px">${current.progress}${t('percent_complete')}</div>
    <button class="btn btn-primary" onclick="location.hash='#/courses/${current.id}'">${t('continue_learning')}</button>
  </div>

  <h2 style="font-size:1.05rem">${t('quick_actions')}</h2>
  <div class="grid" style="margin-bottom:16px">
    <a class="action" href="#/courses">📚 ${t('my_courses')}</a>
    <a class="action" href="#/downloads">⬇️ ${t('downloads')}</a>
    <a class="action" href="#/mentor/ask">💬 ${t('ask_mentor')}</a>
    <a class="action" href="#/progress">📈 ${t('my_progress_action')}</a>
  </div>

  <div class="stats" style="margin-bottom:16px">
    <div class="stat"><b>${active}</b><span class="muted">${t('courses_active')}</span></div>
    <div class="stat"><b>${lessonsDone}</b><span class="muted">${t('lessons_completed')}</span></div>
    <div class="stat"><b>${doubtsPending}</b><span class="muted">${t('doubts_pending')}</span></div>
  </div>

  <h2 style="font-size:1.05rem">${t('recommended_for_you')}</h2>
  ${courseCard(rec)}

  <h2 style="font-size:1.05rem">${t('recent_activity')}</h2>
  <div class="card">
    <div>✅ Completed Lesson 1</div>
    <div class="muted" style="margin:6px 0">📝 Quiz score 4/5</div>
    <div>💬 Mentor reply received</div>
  </div>
  <button class="btn btn-outline" style="width:100%" onclick="startDemo()">${t('start_guided_demo')}</button>
  `;
}

function placeholderScreen(name) {
  return `<div class="placeholder"><h2>${name}</h2><p>${t('coming_next')}</p><a class="btn btn-outline" href="#/home">${t('back_to_home')}</a></div>`;
}

function findCourse(id) {
  return COURSES.find(c => c.id === id);
}

function courseDetailsScreen(id) {
  const c = findCourse(id);
  if (!c) return placeholderScreen(t('course_not_found'));
  return `<a href="#/courses" class="muted">${t('back_to_courses')}</a>
  <h1 style="font-size:1.3rem;margin-top:8px">${c.title}</h1>
  <div class="muted">${c.level} · ${c.lessons} lessons · ${c.size} · ${c.langs}</div>
  <p>${c.desc}</p>
  <div class="progress" role="progressbar" aria-valuenow="${c.progress}" aria-valuemin="0" aria-valuemax="100"><div style="width:${c.progress}%"></div></div>
  <div class="muted" style="margin:6px 0 14px">${c.progress}${t('percent_complete')} · ${c.status === 'downloaded' ? t('available_offline') : t('not_downloaded')}</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
    <button class="btn btn-primary" onclick="location.hash='#/courses/${c.id}/lessons'">${t('continue_course')}</button>
    <button class="btn btn-secondary" onclick="toast(t('course_downloaded_toast'))">${t('download_course')}</button>
    <button class="btn btn-outline" onclick="toast(t('bookmarked_toast'))">${t('bookmark')}</button>
    <button class="btn btn-outline" onclick="toast(t('share_copied_toast'))">${t('share')}</button>
  </div>
  <h2 style="font-size:1.05rem">${t('lessons_heading')}</h2>
  ${(() => {
    const done = getLessonProgress(c.id);
    return LESSONS.map((l, i) => `<div class="card" style="display:flex;justify-content:space-between;align-items:center">
      <span>${done.includes(i) ? '✅' : '○'} ${l}</span>
      <a class="btn btn-outline" style="min-height:40px" href="#/courses/${c.id}/lessons/${i}">${done.includes(i) ? t('review') : t('start')}</a>
    </div>`).join('');
  })()}`;
}

function audioPlayerHTML() {
  const mm = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  return `<div class="card" role="group" aria-label="Audio player">
    <div style="display:flex;align-items:center;gap:10px">
      <button class="icon-btn" aria-label="Skip back 10 seconds" onclick="skipAudio(-10)">⏪</button>
      <button class="icon-btn" aria-label="${audio.playing ? 'Pause' : 'Play'}" onclick="toggleAudioPlay()">${audio.playing ? '⏸' : '▶️'}</button>
      <button class="icon-btn" aria-label="Skip forward 10 seconds" onclick="skipAudio(10)">⏩</button>
      <span class="muted">${mm(audio.pos)} / ${mm(audio.dur)}</span>
      ${state.demoOffline || !navigator.onLine ? `<span class="badge online" style="margin-left:auto"><span class="dot"></span>${t('available_offline')}</span>` : ''}
    </div>
    <input type="range" aria-label="Seek" min="0" max="${audio.dur}" value="${audio.pos}" style="width:100%;margin:8px 0" oninput="audio.pos=parseInt(this.value);render()">
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <span class="muted">${state.language === 'hi' ? 'गति' : 'Speed'}</span>
      ${[0.75, 1, 1.25, 1.5].map(s => `<button class="btn ${audio.speed === s ? 'btn-primary' : 'btn-outline'}" style="min-height:36px;padding:0 10px" onclick="audio.speed=${s};render()">${s}x</button>`).join('')}
      <button class="btn btn-outline" style="min-height:36px;margin-left:auto" onclick="audio.showTranscript=!audio.showTranscript;render()">${audio.showTranscript ? (state.language === 'hi' ? 'छिपाएं' : 'Hide') : (state.language === 'hi' ? 'दिखाएं' : 'Show')} ${state.language === 'hi' ? 'ट्रांसक्रिप्ट' : 'Transcript'}</button>
    </div>
    ${audio.showTranscript ? `<div class="card" style="margin-top:10px"><b>${state.language === 'hi' ? 'ट्रांसक्रिप्ट' : 'Transcript'}</b><p class="muted">${state.language === 'hi' ? 'पूर्ण पाठ ट्रांसक्रिप्ट यहां दिखाई देगा।' : 'Full lesson transcript would appear here for captioned, screen-reader-friendly reading.'}</p></div>` : ''}
  </div>`;
}

function lessonReaderScreen(id, lessonIdx) {
  const c = findCourse(id);
  const li = parseInt(lessonIdx);
  const title = LESSONS[li] || 'Lesson';
  return `<a href="#/courses/${id}" class="muted">&larr; ${c ? c.title : 'Course'}</a>
  <h1 style="font-size:1.25rem;margin-top:8px">${title}</h1>
  <div class="card">
    <p>${state.language === 'hi' ? 'यह पाठ विषय को चरण दर चरण एक सरल उदाहरण के साथ समझाता है जिसका आप तुरंत अभ्यास कर सकते हैं।' : 'This lesson explains the topic step by step with a simple example you can practice right away.'}</p>
    <div class="card pink"><b>${t('key_points')}</b><ul><li>${state.language === 'hi' ? 'हर दिन थोड़ा अभ्यास करें' : 'Practice a little every day'}</li><li>${state.language === 'hi' ? 'आप ऑफलाइन सीख सकते हैं' : 'You can learn offline'}</li><li>${state.language === 'hi' ? 'अटकने पर अपने मेंटर से पूछें' : "Ask your mentor if you're stuck"}</li></ul></div>
    <p><b>${t('practice_activity')}</b> ${state.language === 'hi' ? 'इसे अपने डिवाइस पर आज़माएं, फिर पाठ को पूर्ण चिह्नित करें।' : 'Try this on your own device, then mark the lesson complete.'}</p>
  </div>
  ${audioPlayerHTML()}
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px">
    <button class="btn btn-outline" onclick="speakLesson()">${t('read_aloud')}</button>
    <button class="btn btn-outline" onclick="toggleBookmark('${id}',${li})">🔖 ${t('bookmark')}</button>
    <button class="btn btn-secondary" onclick="markLessonDone('${id}',${li})">${t('mark_complete')}</button>
    <button class="btn btn-outline" onclick="location.hash='#/mentor/ask'">${t('ask_mentor')}</button>
  </div>
  <div style="display:flex;justify-content:space-between">
    <a class="btn btn-outline" href="#/courses/${id}/lessons/${Math.max(0, li - 1)}">&larr; ${t('previous')}</a>
    <a class="btn btn-outline" href="${li < LESSONS.length - 1 ? '#/courses/' + id + '/lessons/' + (li + 1) : '#/courses/' + id + '/quiz'}">${li < LESSONS.length - 1 ? t('next') + ' \u2192' : t('take_quiz')}</a>
  </div>`;
}

function quizIntroScreen(id) {
  return `<h1 style="font-size:1.3rem">${t('quiz_heading')}</h1>
  <div class="card">
    <div>${QUIZ.length} ${t('quiz_meta')}</div>
    <div class="muted" style="margin:6px 0">${t('quiz_offline_note')}</div>
    <button class="btn btn-primary" onclick="quizState={i:0,answers:[],flags:[]};location.hash='#/courses/${id}/quiz/q'">${t('start_quiz')}</button>
  </div>`;
}

function quizQuestionScreen(id) {
  const q = QUIZ[quizState.i];
  const flagged = quizState.flags[quizState.i];
  return `<div style="display:flex;justify-content:space-between;align-items:center">
    <div class="muted">${state.language === 'hi' ? (QUIZ.length + ' ' + t('of_label') + ' ' + t('question_label') + ' ' + (quizState.i + 1)) : (t('question_label') + ' ' + (quizState.i + 1) + ' ' + t('of_label') + ' ' + QUIZ.length)}</div>
    <button class="btn btn-outline" style="min-height:36px;padding:0 12px" aria-pressed="${!!flagged}" onclick="quizState.flags[${quizState.i}]=!quizState.flags[${quizState.i}];render()">${flagged ? t('flagged') : t('flag')}</button>
  </div>
  <div class="progress" style="margin:8px 0 16px"><div style="width:${(quizState.i) / QUIZ.length * 100}%"></div></div>
  <h2 style="font-size:1.1rem">${q.q}</h2>
  <div role="radiogroup" aria-label="Answer options">
  ${q.opts.map((o, i) => `<label class="card" style="display:flex;gap:10px;align-items:center;cursor:pointer">
    <input type="radio" name="opt" value="${i}" ${quizState.answers[quizState.i] === i ? 'checked' : ''} onchange="quizState.answers[${quizState.i}]=${i}" style="width:22px;height:22px">${o}
  </label>`).join('')}
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:12px">
    <button class="btn btn-outline" onclick="quizState.i=Math.max(0,quizState.i-1);render()">${t('previous')}</button>
    <button class="btn btn-primary" onclick="if(quizState.i<${QUIZ.length - 1}){quizState.i++;render()}else{location.hash='#/courses/${id}/quiz/review'}">${quizState.i < QUIZ.length - 1 ? t('next') : t('review_answers')}</button>
  </div>`;
}

function quizReviewScreen(id) {
  const offline = state.demoOffline || !navigator.onLine;
  return `<h1 style="font-size:1.3rem">${t('review_your_answers')}</h1>
  <div class="grid" style="margin-bottom:14px">
    ${QUIZ.map((q, i) => {
      const state_ = quizState.answers[i] !== undefined ? (quizState.flags[i] ? 'flagged' : 'answered') : (quizState.flags[i] ? 'flagged' : 'unanswered');
      const cls = state_ === 'answered' ? 'btn-secondary' : state_ === 'flagged' ? 'btn-outline' : 'btn-outline';
      return `<button class="btn ${cls}" style="position:relative" onclick="quizState.i=${i};location.hash='#/courses/${id}/quiz/q'">Q${i + 1}${quizState.flags[i] ? ' 🚩' : ''}${quizState.answers[i] === undefined ? ' (empty)' : ''}</button>`;
    }).join('')}
  </div>
  ${offline ? `<div class="card pink">${t('quiz_offline_msg')}</div>` : ''}
  <button class="btn btn-primary" style="width:100%" onclick="showSubmitConfirm=true;render()">${t('submit_quiz')}</button>
  ${showSubmitConfirm ? `<div class="card" style="margin-top:14px">
    <b>${t('submit_confirm_title')}</b>
    <p class="muted">${t('submit_confirm_note')}</p>
    <div style="display:flex;gap:10px"><button class="btn btn-outline" onclick="showSubmitConfirm=false;render()">${t('cancel')}</button><button class="btn btn-primary" onclick="showSubmitConfirm=false;finishQuiz('${id}')">${t('confirm_submit')}</button></div>
  </div>` : ''}`;
}

function quizResultScreen(id) {
  let score = 0;
  QUIZ.forEach((q, i) => { if (quizState.answers[i] === q.correct) score++; });
  const pass = score / QUIZ.length >= 0.6;
  return `<h1 style="font-size:1.3rem">${t('quiz_result')}</h1>
  <div class="card pink" style="text-align:center">
    <h2>${score} / ${QUIZ.length}</h2>
    <div>${pass ? t('quiz_pass') : t('quiz_fail')}</div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
    <button class="btn btn-outline" onclick="quizState={i:0,answers:[],flags:[]};location.hash='#/courses/${id}/quiz/q'">${t('retake_quiz')}</button>
    <button class="btn btn-primary" onclick="location.hash='#/courses/${id}'">${t('continue_course')}</button>
    <button class="btn btn-outline" onclick="location.hash='#/mentor/ask'">${t('ask_mentor')}</button>
  </div>`;
}

function progressScreen() {
  const avgProgress = Math.round(COURSES.reduce((s, c) => s + c.progress, 0) / COURSES.length);
  return `<h1 style="font-size:1.3rem">${t('my_progress_heading')}</h1>
  <div class="stats" style="margin-bottom:16px">
    <div class="stat"><b>${avgProgress}%</b><span class="muted">${t('overall')}</span></div>
    <div class="stat"><b>5</b><span class="muted">${t('lessons_completed')}</span></div>
    <div class="stat"><b>3</b><span class="muted">${t('quizzes_taken')}</span></div>
    <div class="stat"><b>2</b><span class="muted">${t('doubts_resolved')}</span></div>
  </div>
  <h2 style="font-size:1.05rem">${t('course_progress')}</h2>
  ${COURSES.map(c => `<div class="card"><div style="display:flex;justify-content:space-between"><span>${c.title}</span><span class="muted">${c.progress}%</span></div><div class="progress" style="margin-top:8px"><div style="width:${c.progress}%"></div></div></div>`).join('')}
  <a class="btn btn-outline" href="#/progress/achievements">${t('view_achievements')}</a>`;
}

function achievementsScreen() {
  const lp = store.get('lessonProgress', {});
  const totalLessonsDone = Object.values(lp).reduce((s, arr) => s + arr.length, 0);
  const quizResults = store.get('quizResults', []);
  const firstQuizPassed = quizResults.some(r => r.score / r.total >= 0.6);
  const courseCompleted = Object.entries(lp).some(([cid, arr]) => arr.length >= LESSONS.length);
  const badges = [
    { t: "First Lesson Completed", unlocked: totalLessonsDone >= 1, d: totalLessonsDone >= 1 ? "Earned" : "Complete your first lesson" },
    { t: "First Offline Lesson", unlocked: totalLessonsDone >= 1 && (state.demoOffline || !navigator.onLine || true), d: totalLessonsDone >= 1 ? "Earned" : "Complete a lesson while offline" },
    { t: "First Quiz Passed", unlocked: firstQuizPassed, d: firstQuizPassed ? "Earned" : "Score 60% or higher on a quiz" },
    { t: "Five Lessons Completed", unlocked: totalLessonsDone >= 5, d: totalLessonsDone >= 5 ? "Earned" : `${totalLessonsDone}/5 lessons done` },
    { t: "Course Completed", unlocked: courseCompleted, d: courseCompleted ? "Earned" : "Finish every lesson in a course" },
    { t: "Consistent Learner", unlocked: quizResults.length >= 3, d: quizResults.length >= 3 ? "Earned" : `${quizResults.length}/3 quizzes taken` }
  ];
  return `<a href="#/progress" class="muted">&larr; ${t('nav_progress')}</a><h1 style="font-size:1.3rem;margin-top:8px">${t('achievements_heading')}</h1>
  <div class="grid">${badges.map(b => `<div class="card" style="text-align:center;opacity:${b.unlocked ? 1 : .5}"><div style="font-size:1.8rem">${b.unlocked ? '🏅' : '🔒'}</div><b>${b.t}</b><div class="muted">${b.d}</div></div>`).join('')}</div>`;
}

function mentorListScreen() {
  return `<h1 style="font-size:1.3rem">${t('my_doubts')}</h1>
  <a class="btn btn-primary" href="#/mentor/ask" style="margin-bottom:14px">${t('ask_new_doubt')}</a>
  ${DOUBTS.map(d => `<div class="card" style="cursor:pointer" onclick="location.hash='#/mentor/doubts/${d.id}'">
    <div style="display:flex;justify-content:space-between"><b>${d.course}</b><span class="badge ${d.status === 'Replied' || d.status === 'Resolved' ? 'online' : 'syncing'}">${d.status}</span></div>
    <div class="muted">${d.lesson} · ${d.date}</div>
    ${d.reply ? `<p style="margin-top:6px">${d.reply}</p>` : `<p class="muted" style="margin-top:6px">${t('waiting_reply')}</p>`}
  </div>`).join('')}`;
}

function mentorAskScreen() {
  return `<h1 style="font-size:1.3rem">${t('ask_mentor')}</h1>
  <div class="card">
    <label class="muted" for="doubtCourse">${t('course_label')}</label>
    <select id="doubtCourse" style="width:100%;min-height:48px;margin:6px 0 12px;border-radius:10px;border:1px solid var(--soft)">${COURSES.map(c => `<option>${c.title}</option>`).join('')}</select>
    <label class="muted" for="doubtText">${t('your_question')}</label>
    <textarea id="doubtText" rows="4" style="width:100%;margin:6px 0 12px;border-radius:10px;border:1px solid var(--soft);padding:10px" placeholder="${t('doubt_ph')}"></textarea>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-outline" onclick="toast(t('voice_placeholder'))">${t('voice')}</button>
      <button class="btn btn-outline" onclick="toast(t('image_attached'))">${t('attach_image')}</button>
    </div>
    <button class="btn btn-primary" style="margin-top:14px" onclick="submitDoubt()">${t('send')}</button>
  </div>
  <div id="doubtMsg" class="muted"></div>`;
}

function settingsScreen() {
  return `<h1 style="font-size:1.3rem">${t('settings_heading')}</h1>
  <div class="card">
    <h3>${t('appearance')}</h3>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
      <button class="btn ${state.themeMode === 'light' ? 'btn-primary' : 'btn-outline'}" onclick="state.themeMode='light';store.set('themeMode','light');applyPrefs();render()">${t('light')}</button>
      <button class="btn ${state.themeMode === 'dark' ? 'btn-primary' : 'btn-outline'}" onclick="state.themeMode='dark';store.set('themeMode','dark');applyPrefs();render()">${t('dark')}</button>
      <button class="btn ${state.themeMode === 'system' ? 'btn-primary' : 'btn-outline'}" onclick="state.themeMode='system';store.set('themeMode','system');applyPrefs();render()">${t('system')}</button>
    </div>
    <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" ${state.accessibility.highContrast ? 'checked' : ''} onchange="state.accessibility.highContrast=this.checked;store.set('accessibilityPreferences',state.accessibility);applyPrefs()"> ${t('high_contrast')}</label>
    <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" ${state.accessibility.reducedMotion ? 'checked' : ''} onchange="state.accessibility.reducedMotion=this.checked;store.set('accessibilityPreferences',state.accessibility);applyPrefs()"> ${t('reduced_motion')}</label>
    <div class="muted">${t('text_size')}</div>
    <div style="display:flex;gap:10px;margin:6px 0 4px">
      ${['normal', 'large', 'xlarge'].map(sz => `<button class="btn ${state.accessibility.textSize === sz ? 'btn-primary' : 'btn-outline'}" onclick="state.accessibility.textSize='${sz}';store.set('accessibilityPreferences',state.accessibility);applyPrefs()">${sz}</button>`).join('')}
    </div>
  </div>
  <div class="card">
    <h3>${t('language_heading')}</h3>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${[{ code: 'hi', label: 'हिंदी' }, { code: 'en', label: 'English' }].map(l => `<button class="btn ${state.language === l.code ? 'btn-primary' : 'btn-outline'}" onclick="state.language='${l.code}';store.set('selectedLanguage','${l.code}');applyPrefs();render()">${l.label}</button>`).join('')}
      <button class="btn btn-outline" disabled style="opacity:.5">भोजपुरी — Coming soon</button>
    </div>
  </div>
  <div class="card">
    <h3>${t('downloads_heading')}</h3>
    <div class="muted">${t('download_quality')}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:6px 0">
      ${['Text only', 'Text + Audio', 'Full content'].map(q => `<button class="btn ${state.downloadQuality === q ? 'btn-primary' : 'btn-outline'}" onclick="state.downloadQuality='${q}';store.set('downloadQuality','${q}');render()">${q}</button>`).join('')}
    </div>
    <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" checked> ${t('wifi_only')}</label>
  </div>
  <div class="card">
    <h3>${t('offline_demo')}</h3>
    <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" ${state.demoOffline ? 'checked' : ''} onchange="state.demoOffline=this.checked;store.set('demoOffline',state.demoOffline);setOfflineBadge();toast(this.checked?t('you_are_offline_toast'):t('you_are_online_toast'))"> ${t('demo_offline_mode')}</label>
    <div class="muted">${t('offline_demo_note')}</div>
  </div>
  <div class="card">
    <h3>${t('privacy')}</h3>
    <div class="muted" style="margin-bottom:8px">${t('privacy_note')}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-outline" onclick="toast(t('progress_exported_toast'))">${t('export_progress')}</button>
      <button class="btn btn-outline" onclick="confirmClearData=true;render()">${t('clear_local_data')}</button>
      <button class="btn btn-outline" onclick="toast(t('signed_out_toast'))">${t('log_out_demo')}</button>
    </div>
    ${confirmClearData ? `<div class="card pink" style="margin-top:10px">
      <b>${t('clear_data_title')}</b>
      <p class="muted">${t('clear_data_note')}</p>
      <div style="display:flex;gap:10px"><button class="btn btn-outline" onclick="confirmClearData=false;render()">${t('cancel')}</button><button class="btn btn-primary" onclick="clearAllLocalData()">${t('confirm_clear')}</button></div>
    </div>` : ''}
  </div>
  <div class="card">
    <h3>${t('help_heading')}</h3>
    <div class="muted">${t('help_topics')}</div>
    <a class="btn btn-outline" style="margin-top:8px" href="#/mentor/ask">${t('contact_mentor')}</a>
  </div>`;
}

function splashScreen() {
  setTimeout(() => { location.hash = store.get('onboarded', false) ? '#/home' : '#/welcome'; }, 900);
  return `<div class="placeholder"><img src="assets/logo-medium.png" alt="VidyaSetu logo" style="width:140px;height:140px;border-radius:30px;object-fit:cover;margin-bottom:14px"><h1>VidyaSetu</h1><p class="muted">${t('tagline')}</p><p class="muted">${t('loading_text')}</p></div>`;
}

function welcomeScreen() {
  return `<div class="placeholder">
    <img src="assets/logo-medium.png" alt="VidyaSetu logo" style="width:140px;height:140px;border-radius:30px;object-fit:cover;margin-bottom:14px"><h1>${t('welcome_heading')}</h1>
    <p>${t('welcome_text')}</p>
    <div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:16px auto">
      <button class="btn btn-primary" onclick="location.hash='#/onboarding/language'">${t('get_started')}</button>
      <button class="btn btn-outline" onclick="store.set('onboarded',true);location.hash='#/home'">${t('continue_demo_student')}</button>
      <a href="#/onboarding/accessibility" class="muted">${t('accessibility_settings')}</a>
    </div>
  </div>`;
}

function languageScreen() {
  const langs = [{ code: 'hi', label: 'हिंदी' }, { code: 'en', label: 'English' }, { code: 'bh', label: 'भोजपुरी — Coming soon', disabled: true }];
  return `<div class="placeholder" style="text-align:left;max-width:400px;margin:0 auto">
    <h1 style="text-align:center">${t('choose_language')}</h1>
    ${langs.map(l => `<label class="card" style="display:flex;align-items:center;gap:10px;${l.disabled ? 'opacity:.5' : 'cursor:pointer'}">
      <input type="radio" name="lang" value="${l.code}" ${l.disabled ? 'disabled' : ''} ${state.language === l.code ? 'checked' : ''} onchange="state.language='${l.code}';store.set('selectedLanguage','${l.code}');applyPrefs();render()"> ${l.label}
    </label>`).join('')}
    <p class="muted" style="text-align:center">${t('change_later')}</p>
    <button class="btn btn-primary" style="width:100%" onclick="location.hash='#/onboarding/accessibility'">${t('continue_btn')}</button>
  </div>`;
}

function accessibilityOnboardScreen() {
  return `<div class="placeholder" style="text-align:left;max-width:420px;margin:0 auto">
    <h1 style="text-align:center">${t('accessibility_setup')}</h1>
    <div class="card">
      <div class="muted">${t('text_size')}</div>
      <div style="display:flex;gap:10px;margin:6px 0 12px">${['normal', 'large', 'xlarge'].map(sz => `<button class="btn ${state.accessibility.textSize === sz ? 'btn-primary' : 'btn-outline'}" onclick="state.accessibility.textSize='${sz}';applyPrefs()">${sz}</button>`).join('')}</div>
      <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" onchange="state.accessibility.readAloud=this.checked"> ${t('read_aloud_label')}</label>
      <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" ${state.accessibility.highContrast ? 'checked' : ''} onchange="state.accessibility.highContrast=this.checked;applyPrefs()"> ${t('high_contrast')}</label>
      <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" onchange="state.accessibility.darkMode=this.checked;state.themeMode=this.checked?'dark':'system';applyPrefs()"> ${t('dark_mode_label')}</label>
      <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" onchange="state.accessibility.captions=this.checked"> ${t('captions_label')}</label>
      <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" ${state.accessibility.reducedMotion ? 'checked' : ''} onchange="state.accessibility.reducedMotion=this.checked;applyPrefs()"> ${t('reduced_motion')}</label>
      <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" onchange="state.accessibility.largeTouch=this.checked"> ${t('large_touch_label')}</label>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-outline" style="flex:1" onclick="finishOnboarding()">${t('skip_for_now')}</button>
      <button class="btn btn-primary" style="flex:1" onclick="store.set('accessibilityPreferences',state.accessibility);finishOnboarding()">${t('save_preferences')}</button>
    </div>
  </div>`;
}

function finishOnboarding() {
  store.set('onboarded', true);
  location.hash = '#/home';
}

function downloadItem(d) {
  const bar = `<div class="progress" style="margin:8px 0"><div style="width:${d.progress}%"></div></div>`;
  let actions = '';
  if (d.state === 'downloading') actions = `<button class="btn btn-outline" onclick="pauseDownload('${d.id}')">${t('pause')}</button>`;
  else if (d.state === 'paused') actions = `<button class="btn btn-primary" onclick="resumeDownload('${d.id}')">${t('resume')}</button>`;
  else if (d.state === 'failed') actions = `<button class="btn btn-primary" onclick="retryDownload('${d.id}')">${t('retry')}</button>`;
  actions += ` <button class="btn btn-outline" onclick="deleteDownload('${d.id}')">${t('delete')}</button>`;
  return `<div class="card">
    <div style="display:flex;justify-content:space-between"><b>${d.title}</b><span class="muted">${d.size}</span></div>
    ${bar}<div class="muted">${d.progress}% · ${d.state === 'done' ? t('available_offline') : d.state}</div>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">${actions}</div>
  </div>`;
}

function downloadsScreen() {
  const group = s => DOWNLOADS.filter(d => d.state === s);
  return `<h1 style="font-size:1.3rem">${t('downloads_heading')}</h1>
  ${group('downloading').length ? `<h2 style="font-size:1rem">${t('downloading_heading')}</h2>${group('downloading').map(downloadItem).join('')}` : ''}
  ${group('paused').length ? `<h2 style="font-size:1rem">${t('paused_heading')}</h2>${group('paused').map(downloadItem).join('')}` : ''}
  ${group('failed').length ? `<h2 style="font-size:1rem">${t('failed_heading')}</h2>${group('failed').map(downloadItem).join('')}` : ''}
  <h2 style="font-size:1rem">${t('downloaded_heading')}</h2>${group('done').map(downloadItem).join('') || `<p class="muted">${t('no_downloads_yet')}</p>`}
  <div class="card">
    <h3>${t('settings_heading')}</h3>
    <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox" checked> ${t('wifi_only')}</label>
    <label style="display:flex;align-items:center;gap:8px;min-height:48px"><input type="checkbox"> ${t('auto_download')}</label>
    <div class="muted">${t('storage_used')}</div>
    <div class="muted">${t('last_synced')} ${state.lastSync ? new Date(state.lastSync).toLocaleString() : t('not_synced_yet')}</div>
    ${store.get('pendingSyncItems', []).length ? `<div class="muted">${store.get('pendingSyncItems', []).length} ${t('items_waiting_sync')}</div>` : ''}
  </div>`;
}

function hubScreen() {
  return `<h1 style="font-size:1.3rem">${t('hub_heading')}</h1>
  <div class="card" style="text-align:center">
    <div style="font-size:3rem">▦</div>
    <div class="muted">${t('scan_qr')}</div>
    <h3>VidyaSetu Community Hub 01</h3>
    <span class="badge online"><span class="dot"></span>${t('connected')}</span>
    <p class="muted">${t('hub_offline_note')}</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="toast(t('course_downloaded_toast'))">${t('download_course')}</button>
      <button class="btn btn-outline" onclick="toast(t('progress_synced_toast'))">${t('sync_now')}</button>
    </div>
  </div>
  <div class="muted">${t('last_content_update')}</div>`;
}

function opportunitiesScreen() {
  return `<h1 style="font-size:1.3rem">${t('opportunities_heading')}</h1>
  ${OPPS.map(o => `<div class="card">
    <div style="display:flex;justify-content:space-between"><b>${o.t}</b><span class="badge syncing">${o.type}</span></div>
    <div class="muted">${o.org} · ${o.loc}</div>
    <div class="muted">${t('deadline_label')} ${o.deadline}</div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-outline" onclick="toast(t('saved_offline_toast'))">${t('save_label')}</button>
      <button class="btn btn-primary" onclick="toast(t('details_toast'))">${t('view_details')}</button>
    </div>
  </div>`).join('')}`;
}

function profileScreen() {
  return `<h1 style="font-size:1.3rem">${t('profile_heading')}</h1>
  <div class="card" style="text-align:center">
    <div style="width:72px;height:72px;border-radius:50%;background:var(--soft);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:1.8rem">👩‍🎓</div>
    <h2>${STUDENT.name}</h2>
    <div class="muted">${STUDENT.college} · ${STUDENT.programme}</div>
    <div class="muted">${STUDENT.location} · ${state.language === 'hi' ? 'पसंदीदा भाषा' : 'Prefers'} ${STUDENT.language}</div>
  </div>
  <div class="stats" style="margin-bottom:16px">
    <div class="stat"><b>1</b><span class="muted">${t('courses_completed')}</span></div>
    <div class="stat"><b>3</b><span class="muted">${t('skills_earned')}</span></div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn btn-outline" onclick="toast(t('edit_profile_toast'))">${t('edit_profile')}</button>
    <button class="btn btn-outline" onclick="toast(t('report_downloaded_toast'))">${t('download_report')}</button>
    <a class="btn btn-outline" href="#/settings">${t('open_settings')}</a>
  </div>`;
}

function coursesScreen() {
  const filters = ['All', 'Downloaded', 'Hindi', 'Audio available', 'Beginner'];
  const filterLabelKeys = { 'All': 'filter_all', 'Downloaded': 'filter_downloaded', 'Hindi': 'filter_hindi', 'Audio available': 'filter_audio', 'Beginner': 'filter_beginner' };
  const sortLabelKeys = { 'Recommended': 'sort_recommended', 'Newest': 'sort_newest', 'Shortest': 'sort_shortest' };
  let list = COURSES.filter(c => {
    const matchQ = !libState.q || c.title.toLowerCase().includes(libState.q.toLowerCase());
    let matchF = true;
    if (libState.filter === 'Downloaded') matchF = c.status === 'downloaded';
    if (libState.filter === 'Hindi') matchF = c.langs.includes('Hindi');
    if (libState.filter === 'Audio available') matchF = true;
    if (libState.filter === 'Beginner') matchF = c.level === 'Beginner';
    return matchQ && matchF;
  });
  if (libState.sort === 'Shortest') list = [...list].sort((a, b) => a.lessons - b.lessons);
  if (libState.sort === 'Newest') list = [...list].slice().reverse();
  return `<h1 style="font-size:1.3rem">${t('my_courses')}</h1>
  <input type="text" aria-label="Search courses" placeholder="${t('search_courses_ph')}" value="${libState.q}" style="width:100%;min-height:48px;border-radius:12px;border:1px solid var(--soft);padding:0 14px;margin-bottom:10px" oninput="libState.q=this.value;render()">
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
    ${filters.map(f => `<button class="btn ${libState.filter === f ? 'btn-primary' : 'btn-outline'}" style="min-height:40px;padding:0 14px" onclick="libState.filter='${f}';render()">${t(filterLabelKeys[f])}</button>`).join('')}
  </div>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
    <label class="muted" for="sortSel">${t('sort_label')}</label>
    <select id="sortSel" style="min-height:44px;border-radius:10px;border:1px solid var(--soft)" onchange="libState.sort=this.value;render()">
      ${['Recommended', 'Newest', 'Shortest'].map(s => `<option value="${s}" ${libState.sort === s ? 'selected' : ''}>${t(sortLabelKeys[s])}</option>`).join('')}
    </select>
    ${(libState.q || libState.filter !== 'All') ? `<button class="btn btn-outline" style="min-height:40px" onclick="libState={q:'',filter:'All',sort:libState.sort};render()">${t('clear_filters')}</button>` : ''}
  </div>
  ${list.length ? list.map(courseCard).join('') : `<div class="placeholder"><h2>${t('no_courses_found')}</h2><p>${t('try_different_search')}</p></div>`}
  `;
}

function doubtDetailScreen(id) {
  const d = DOUBTS.find(x => x.id === parseInt(id));
  if (!d) return placeholderScreen(t('doubt_not_found'));
  return `<a href="#/mentor" class="muted">&larr; ${t('my_doubts')}</a>
  <h1 style="font-size:1.25rem;margin-top:8px">${d.course}</h1>
  <div class="muted">${d.lesson} · ${d.date}</div>
  <div class="card"><b>${t('your_question')}</b><p>${state.language === 'hi' ? 'क्या आप मुझे यह विषय बेहतर समझा सकते हैं? मैंने अभ्यास गतिविधि आज़माई लेकिन अटक गया।' : 'Can you help me understand this topic better? I tried the practice activity but got stuck.'}</p></div>
  ${d.reply ? `<div class="card pink"><b>${t('mentor_reply')}</b><p>${d.reply}</p>
    <div style="display:flex;gap:8px"><button class="btn btn-outline" onclick="toast(t('marked_helpful'))">${t('helpful')}</button><button class="btn btn-outline" onclick="speakDoubtReply()">${t('read_aloud')}</button></div>
  </div>` : `<div class="card"><span class="badge syncing"><span class="dot"></span>${t('pending_status')}</span><p class="muted">${t('mentor_no_reply')}</p></div>`}
  <div class="card">
    <label class="muted" for="followup">${t('followup_label')}</label>
    <textarea id="followup" rows="3" style="width:100%;margin:6px 0;border-radius:10px;border:1px solid var(--soft);padding:10px"></textarea>
    <button class="btn btn-primary" onclick="toast(t('followup_sent'))">${t('send_followup')}</button>
  </div>`;
}

function notificationsScreen() {
  const list = notifFilter === 'unread' ? NOTIFS.filter(n => !n.read) : NOTIFS;
  return `<div style="display:flex;justify-content:space-between;align-items:center">
    <h1 style="font-size:1.3rem">${t('notifications')}</h1>
    <button class="btn btn-outline" style="min-height:40px" onclick="NOTIFS.forEach(n=>n.read=true);render()">${t('mark_all_read')}</button>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn ${notifFilter === 'all' ? 'btn-primary' : 'btn-outline'}" style="min-height:40px" onclick="notifFilter='all';render()">${t('all_label')}</button>
    <button class="btn ${notifFilter === 'unread' ? 'btn-primary' : 'btn-outline'}" style="min-height:40px" onclick="notifFilter='unread';render()">${t('unread_label')}</button>
  </div>
  ${list.length ? list.map((n) => `<div class="card" style="display:flex;gap:10px;align-items:flex-start;${n.read ? 'opacity:.65' : ''};cursor:pointer" onclick="NOTIFS[${NOTIFS.indexOf(n)}].read=true;render()">
    <span style="font-size:1.3rem">${n.icon}</span>
    <div><div>${n.text}</div><div class="muted">${n.time}</div></div>
  </div>`).join('') : `<div class="placeholder"><h2>${t('no_notifications')}</h2><p>${t('all_caught_up')}</p></div>`}`;
}

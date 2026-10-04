// Client-side router and navigation logic

const NAV = [
  { path: '#/home', key: 'nav_home', icon: '🏠' },
  { path: '#/courses', key: 'nav_courses', icon: '📚' },
  { path: '#/progress', key: 'nav_progress', icon: '📈' },
  { path: '#/mentor', key: 'nav_mentor', icon: '💬' },
  { path: '#/profile', key: 'nav_profile', icon: '👤' }
];

const ROUTES = {
  '#/home': homeScreen,
  '#/courses': coursesScreen,
  '#/progress': progressScreen,
  '#/progress/achievements': achievementsScreen,
  '#/mentor': mentorListScreen,
  '#/mentor/ask': mentorAskScreen,
  '#/notifications': notificationsScreen,
  '#/settings': settingsScreen,
  '#/splash': splashScreen,
  '#/welcome': welcomeScreen,
  '#/onboarding/language': languageScreen,
  '#/onboarding/accessibility': accessibilityOnboardScreen,
  '#/downloads': downloadsScreen,
  '#/hub': hubScreen,
  '#/opportunities': opportunitiesScreen,
  '#/profile': profileScreen,
};

const DYNAMIC_ROUTES = [
  { re: /^#\/courses\/([\w-]+)\/lessons\/(\d+)$/, fn: (m) => lessonReaderScreen(m[1], m[2]) },
  { re: /^#\/courses\/([\w-]+)\/lessons$/, fn: (m) => courseDetailsScreen(m[1]) },
  { re: /^#\/courses\/([\w-]+)\/quiz\/q$/, fn: (m) => quizQuestionScreen(m[1]) },
  { re: /^#\/courses\/([\w-]+)\/quiz\/review$/, fn: (m) => quizReviewScreen(m[1]) },
  { re: /^#\/courses\/([\w-]+)\/quiz\/result$/, fn: (m) => quizResultScreen(m[1]) },
  { re: /^#\/courses\/([\w-]+)\/quiz$/, fn: (m) => quizIntroScreen(m[1]) },
  { re: /^#\/courses\/([\w-]+)$/, fn: (m) => courseDetailsScreen(m[1]) },
  { re: /^#\/mentor\/doubts\/(\d+)$/, fn: (m) => doubtDetailScreen(m[1]) }
];

// Guided Demo Walkthrough
let demo = { active: false, step: 0 };

function startDemo() {
  demo = { active: true, step: 0 };
  location.hash = DEMO_STEPS[0].hash;
}

function demoNext() {
  demo.step = Math.min(demo.step + 1, DEMO_STEPS.length - 1);
  location.hash = DEMO_STEPS[demo.step].hash;
}

function demoPrev() {
  demo.step = Math.max(demo.step - 1, 0);
  location.hash = DEMO_STEPS[demo.step].hash;
}

function endDemo() {
  demo.active = false;
  render();
}

function demoBanner() {
  if (!demo.active) return '';
  const s = DEMO_STEPS[demo.step];
  return `<div class="card pink" style="position:sticky;bottom:calc(var(--nav-h) + 10px);z-index:15">
    <b>${t('demo_step_label')} ${demo.step + 1} ${t('of_label')} ${DEMO_STEPS.length}</b>
    <div>${s.note}</div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-outline" style="min-height:40px" onclick="demoPrev()">${t('back')}</button>
      <button class="btn btn-primary" style="min-height:40px" onclick="${demo.step < DEMO_STEPS.length - 1 ? 'demoNext()' : 'endDemo()'}">${demo.step < DEMO_STEPS.length - 1 ? t('next_step') : t('finish_demo')}</button>
      <button class="btn btn-outline" style="min-height:40px" onclick="endDemo()">${t('end')}</button>
    </div>
  </div>`;
}

function render() {
  const hash = location.hash || '#/home';
  let screenHtml;
  try {
    if (ROUTES[hash]) {
      screenHtml = ROUTES[hash]();
    } else {
      const dyn = DYNAMIC_ROUTES.find(d => d.re.test(hash));
      screenHtml = dyn ? dyn.fn(hash.match(dyn.re)) : placeholderScreen(hash.replace('#/', '').replace(/-/g, ' ') || 'Screen');
    }
  } catch (e) {
    screenHtml = `<div class="placeholder"><h2>${state.language === 'hi' ? 'कुछ रीफ्रेश की जरूरत थी' : 'Something needed a refresh'}</h2><p>${state.language === 'hi' ? 'आपकी सहेजी गई प्रगति इस डिवाइस पर सुरक्षित है।' : 'Your saved progress is safe on this device.'}</p><a class="btn btn-primary" href="#/home">${t('back_to_home')}</a></div>`;
  }
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.innerHTML = `
      ${topbar()}
      <div class="layout">
        ${sidebar(hash)}
        <main class="main" id="main" tabindex="-1">${screenHtml}${demoBanner()}</main>
      </div>
      ${bottomnav(hash)}
    `;
    const mainEl = document.getElementById('main');
    if (mainEl) mainEl.focus();
  }
}

window.addEventListener('hashchange', render);


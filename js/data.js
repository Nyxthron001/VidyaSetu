// Mock Data Store for VidyaSetu

const STUDENT = {
  name: "Aarush",
  college: "Government Degree College",
  programme: "B.A. First Year",
  location: "Rural Uttar Pradesh",
  language: "Hindi",
  current: "Digital Skills for College Students"
};

const COURSES = [
  {
    id: "digital-skills",
    title: "Digital Skills for College Students",
    level: "Beginner",
    lessons: 5,
    size: "42 MB",
    langs: "Hindi + English",
    progress: 65,
    status: "in-progress",
    desc: "Core digital literacy for college life."
  },
  {
    id: "comm-english",
    title: "Communication and Spoken English",
    level: "Beginner",
    lessons: 6,
    size: "55 MB",
    langs: "English + Hindi",
    progress: 35,
    status: "in-progress",
    desc: "Build confidence speaking English."
  },
  {
    id: "resume-prep",
    title: "Resume and Interview Preparation",
    level: "Beginner",
    lessons: 4,
    size: "28 MB",
    langs: "Hindi + English",
    progress: 0,
    status: "not-started",
    desc: "Prepare a strong resume and ace interviews."
  },
  {
    id: "digital-safety",
    title: "Introduction to Digital Safety",
    level: "Beginner",
    lessons: 5,
    size: "36 MB",
    langs: "Hindi + English",
    progress: 100,
    status: "downloaded",
    desc: "Stay safe online and protect your data."
  }
];

const LESSONS = [
  "What is Digital Learning?",
  "Email Basics",
  "Online Safety",
  "Creating Documents",
  "Resume Preparation",
  "Final Assessment"
];

const QUIZ = [
  {
    q: "What is the benefit of offline learning?",
    opts: ["No internet needed to keep learning", "Faster videos", "More storage", "Less content"],
    correct: 0
  },
  {
    q: "Which tool stores local progress?",
    opts: ["Browser storage", "A printer", "A calculator", "A camera"],
    correct: 0
  },
  {
    q: "Why are captions useful?",
    opts: ["They help everyone follow audio content", "They slow down video", "They cost extra", "They replace lessons"],
    correct: 0
  },
  {
    q: "What should a strong password contain?",
    opts: ["A mix of letters, numbers and symbols", "Only your name", "Just numbers", "The word 'password'"],
    correct: 0
  },
  {
    q: "Who helps resolve academic doubts?",
    opts: ["A mentor", "A stranger", "No one", "A random app"],
    correct: 0
  }
];

const DOUBTS = [
  {
    id: 1,
    course: "Digital Skills for College Students",
    lesson: "Email Basics",
    status: "Replied",
    date: "2 days ago",
    reply: "Great question! Try attaching files under 10MB."
  },
  {
    id: 2,
    course: "Communication and Spoken English",
    lesson: "Introductions",
    status: "Pending",
    date: "Today",
    reply: null
  },
  {
    id: 3,
    course: "Digital Skills for College Students",
    lesson: "Online Safety",
    status: "Resolved",
    date: "1 week ago",
    reply: "Always use two-factor authentication."
  }
];

const NOTIFS = [
  { icon: "💬", text: "Mentor replied to your doubt on Email Basics", time: "1h ago", read: false },
  { icon: "⬇️", text: "Introduction to Digital Safety finished downloading", time: "3h ago", read: false },
  { icon: "📝", text: "Quiz reminder: finish Communication and Spoken English", time: "Yesterday", read: true },
  { icon: "🔄", text: "Your progress synced successfully", time: "Yesterday", read: true },
  { icon: "🎓", text: "New opportunity: Digital Skills Scholarship", time: "3 days ago", read: true }
];

const OPPS = [
  { t: "Digital Skills Scholarship", org: "State Education Board", loc: "Uttar Pradesh", deadline: "15 Nov 2026", type: "Scholarship" },
  { t: "Community Data Entry Internship", org: "Local NGO", loc: "Remote / Rural UP", deadline: "1 Dec 2026", type: "Internship" },
  { t: "Retail Apprenticeship", org: "District Trade Council", loc: "Nearby town", deadline: "20 Oct 2026", type: "Apprenticeship" },
  { t: "Front Desk Assistant", org: "Local Cooperative Bank", loc: "Nearby town", deadline: "Rolling", type: "Job" },
  { t: "College Digital Archive Project", org: "Government Degree College", loc: "On campus", deadline: "5 Nov 2026", type: "College Project" }
];

let DOWNLOADS = [
  { id: 'digital-safety', title: 'Introduction to Digital Safety', size: '36 MB', progress: 100, state: 'done' },
  { id: 'digital-skills', title: 'Digital Skills for College Students', size: '42 MB', progress: 65, state: 'downloading' },
  { id: 'comm-english', title: 'Communication and Spoken English', size: '55 MB', progress: 20, state: 'paused' }
];

const DEMO_STEPS = [
  { hash: '#/welcome', note: 'Welcome screen — start the journey.' },
  { hash: '#/onboarding/language', note: 'Select Hindi as the learning language.' },
  { hash: '#/onboarding/accessibility', note: 'Turn on Large Text and Read Aloud.' },
  { hash: '#/home', note: 'Home shows offline status and a continue-learning card.' },
  { hash: '#/courses', note: 'Browse the Course Library.' },
  { hash: '#/courses/digital-skills', note: 'Open Digital Skills for College Students.' },
  { hash: '#/settings', note: 'Turn on Demo Offline Mode to simulate no internet.' },
  { hash: '#/courses/digital-skills/lessons/1', note: 'Open a lesson and try Read Aloud or the transcript.' },
  { hash: '#/courses/digital-skills/quiz', note: 'Start the quiz for this course.' },
  { hash: '#/courses/digital-skills/quiz/q', note: 'Answer each question — progress saves locally.' },
  { hash: '#/courses/digital-skills/quiz/review', note: 'Review, flag, and jump between answers before submitting.' },
  { hash: '#/courses/digital-skills/quiz/result', note: 'View your quiz result.' },
  { hash: '#/progress', note: 'Check the Progress dashboard.' },
  { hash: '#/mentor/ask', note: 'Submit a doubt — it queues locally while offline.' },
  { hash: '#/mentor', note: 'See the doubt queued for sync.' },
  { hash: '#/settings', note: 'Turn Demo Offline Mode back off.' },
  { hash: '#/downloads', note: 'Click Sync Now and watch progress sync.' }
];


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'vidyasetu.html'));
});

const db = {
    students: new Map(),
    courses: [],
    progress: new Map(),
    doubts: [],
    syncQueue: []
};

function initializeData() {
    db.courses = [
        {
            id: 'digital-skills',
            title: 'Digital Skills for College Students',
            level: 'Beginner',
            lessons: 5,
            size: '42 MB',
            langs: 'Hindi + English',
            progress: 65,
            status: 'in-progress',
            desc: 'Core digital literacy for college life.'
        },
        {
            id: 'comm-english',
            title: 'Communication and Spoken English',
            level: 'Beginner',
            lessons: 6,
            size: '55 MB',
            langs: 'English + Hindi',
            progress: 35,
            status: 'in-progress',
            desc: 'Build confidence speaking English.'
        },
        {
            id: 'resume-prep',
            title: 'Resume and Interview Preparation',
            level: 'Beginner',
            lessons: 4,
            size: '28 MB',
            langs: 'Hindi + English',
            progress: 0,
            status: 'not-started',
            desc: 'Prepare a strong resume and ace interviews.'
        },
        {
            id: 'digital-safety',
            title: 'Introduction to Digital Safety',
            level: 'Beginner',
            lessons: 5,
            size: '36 MB',
            langs: 'Hindi + English',
            progress: 100,
            status: 'downloaded',
            desc: 'Stay safe online and protect your data.'
        }
    ];

    db.opportunities = [
        {
            id: 1,
            title: 'Digital Skills Scholarship',
            organization: 'State Education Board',
            location: 'Uttar Pradesh',
            deadline: '15 Nov 2026',
            type: 'Scholarship'
        },
        {
            id: 2,
            title: 'Community Data Entry Internship',
            organization: 'Local NGO',
            location: 'Remote / Rural UP',
            deadline: '1 Dec 2026',
            type: 'Internship'
        },
        {
            id: 3,
            title: 'Retail Apprenticeship',
            organization: 'District Trade Council',
            location: 'Nearby town',
            deadline: '20 Oct 2026',
            type: 'Apprenticeship'
        }
    ];

    db.lessons = {
        'digital-skills': [
            'What is Digital Learning?',
            'Email Basics',
            'Online Safety',
            'Creating Documents',
            'Resume Preparation',
            'Final Assessment'
        ],
        'comm-english': [
            'Introduction to Communication',
            'Basic Greetings',
            'Introducing Yourself',
            'Phone Etiquette',
            'Writing Emails',
            'Final Assessment'
        ],
        'resume-prep': [
            'Resume Basics',
            'Formatting Your Resume',
            'Common Interview Questions',
            'Final Assessment'
        ],
        'digital-safety': [
            'Understanding Online Threats',
            'Strong Passwords',
            'Phishing Awareness',
            'Privacy Settings',
            'Final Assessment'
        ]
    };

    db.quizzes = {
        'digital-skills': [
            { q: 'What is the benefit of offline learning?', opts: ['No internet needed to keep learning', 'Faster videos', 'More storage', 'Less content'], correct: 0 },
            { q: 'Which tool stores local progress?', opts: ['Browser storage', 'A printer', 'A calculator', 'A camera'], correct: 0 },
            { q: 'Why are captions useful?', opts: ['They help everyone follow audio content', 'They slow down video', 'They cost extra', 'They replace lessons'], correct: 0 },
            { q: 'What should a strong password contain?', opts: ['A mix of letters, numbers and symbols', 'Only your name', 'Just numbers', 'The word password'], correct: 0 },
            { q: 'Who helps resolve academic doubts?', opts: ['A mentor', 'A stranger', 'No one', 'A random app'], correct: 0 }
        ]
    };
}

initializeData();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/courses', (req, res) => {
    res.json({ success: true, data: db.courses });
});

app.get('/api/courses/:id', (req, res) => {
    const course = db.courses.find(c => c.id === req.params.id);
    if (!course) {
        return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, data: course });
});

app.get('/api/courses/:id/lessons', (req, res) => {
    const lessons = db.lessons[req.params.id] || [];
    res.json({ success: true, data: lessons });
});

app.get('/api/courses/:id/quiz', (req, res) => {
    const quiz = db.quizzes[req.params.id] || [];
    res.json({ success: true, data: quiz });
});

app.get('/api/progress/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const progress = db.progress.get(studentId) || {
        studentId,
        courses: {},
        quizzes: [],
        achievements: [],
        totalLessonsCompleted: 0,
        overallProgress: 0
    };
    res.json({ success: true, data: progress });
});

app.post('/api/progress/:studentId/lesson', (req, res) => {
    const { studentId } = req.params;
    const { courseId, lessonIndex } = req.body;

    let progress = db.progress.get(studentId) || { studentId, courses: {} };

    if (!progress.courses[courseId]) {
        progress.courses[courseId] = { completedLessons: [] };
    }

    if (!progress.courses[courseId].completedLessons.includes(lessonIndex)) {
        progress.courses[courseId].completedLessons.push(lessonIndex);
        progress.totalLessonsCompleted = (progress.totalLessonsCompleted || 0) + 1;
    }

    db.progress.set(studentId, progress);
    res.json({ success: true, data: progress });
});

app.post('/api/progress/:studentId/quiz', (req, res) => {
    const { studentId } = req.params;
    const { courseId, score, total } = req.body;

    let progress = db.progress.get(studentId) || { studentId, courses: {}, quizzes: [] };

    progress.quizzes.push({ courseId, score, total, date: new Date().toISOString() });

    const course = db.courses.find(c => c.id === courseId);
    if (course) {
        course.progress = Math.round((score / total) * 100);
    }

    db.progress.set(studentId, progress);
    res.json({ success: true, data: progress });
});

app.get('/api/doubts/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const doubts = db.doubts.filter(d => d.studentId === studentId);
    res.json({ success: true, data: doubts });
});

app.post('/api/doubts', (req, res) => {
    const { studentId, courseId, courseName, lesson, question } = req.body;

    const doubt = {
        id: db.doubts.length + 1,
        studentId,
        courseId,
        courseName,
        lesson,
        question,
        status: 'Pending',
        date: new Date().toISOString(),
        reply: null
    };

    db.doubts.push(doubt);
    res.json({ success: true, data: doubt });
});

app.get('/api/doubts/:studentId/:doubtId', (req, res) => {
    const doubt = db.doubts.find(d =>
        d.id === parseInt(req.params.doubtId) &&
        d.studentId === req.params.studentId
    );

    if (!doubt) {
        return res.status(404).json({ success: false, error: 'Doubt not found' });
    }

    res.json({ success: true, data: doubt });
});

app.get('/api/opportunities', (req, res) => {
    res.json({ success: true, data: db.opportunities });
});

app.post('/api/sync/queue', (req, res) => {
    const { studentId, data, type } = req.body;

    const syncItem = {
        id: db.syncQueue.length + 1,
        studentId,
        type,
        data,
        timestamp: new Date().toISOString(),
        synced: false
    };

    db.syncQueue.push(syncItem);
    res.json({ success: true, data: syncItem });
});

app.get('/api/sync/queue/:studentId', (req, res) => {
    const pending = db.syncQueue.filter(s =>
        s.studentId === req.params.studentId && !s.synced
    );
    res.json({ success: true, data: pending });
});

app.post('/api/sync/process', (req, res) => {
    const { studentId } = req.body;

    const pending = db.syncQueue.filter(s =>
        s.studentId === studentId && !s.synced
    );

    pending.forEach(item => {
        item.synced = true;
        item.syncedAt = new Date().toISOString();
    });

    res.json({ success: true, data: { processed: pending.length } });
});

app.get('/api/hubs', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'VidyaSetu Community Hub 01', connected: true, lastUpdate: '2 days ago' }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Frontend available at http://localhost:' + PORT);
});

module.exports = app;
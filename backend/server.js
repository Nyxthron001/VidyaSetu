const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'vidyasetu.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await db.all('SELECT * FROM courses');
        res.json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await db.get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/courses/:id/lessons', async (req, res) => {
    try {
        const rows = await db.all(
            'SELECT title FROM lessons WHERE course_id = ? ORDER BY position ASC',
            [req.params.id]
        );
        const titles = rows.map(r => r.title);
        res.json({ success: true, data: titles });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/courses/:id/quiz', async (req, res) => {
    try {
        const rows = await db.all(
            'SELECT question, options, correct_answer FROM quiz_questions WHERE course_id = ?',
            [req.params.id]
        );
        const questions = rows.map(r => ({
            q: r.question,
            opts: JSON.parse(r.options),
            correct: r.correct_answer
        }));
        res.json({ success: true, data: questions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Student Progress
app.get('/api/progress/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const rows = await db.all(
            'SELECT * FROM student_progress WHERE student_id = ?',
            [studentId]
        );

        const courses = {};
        let totalLessonsCompleted = 0;

        rows.forEach(r => {
            if (r.completed && r.lesson_index !== null) {
                if (!courses[r.course_id]) courses[r.course_id] = { completedLessons: [] };
                courses[r.course_id].completedLessons.push(r.lesson_index);
                totalLessonsCompleted++;
            }
        });

        const quizRows = await db.all(
            `SELECT course_id, quiz_score, quiz_total, last_accessed AS date
             FROM student_progress
             WHERE student_id = ? AND quiz_score IS NOT NULL`,
            [studentId]
        );

        res.json({
            success: true,
            data: {
                studentId,
                courses,
                quizzes: quizRows,
                totalLessonsCompleted,
                overallProgress: 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/progress/:studentId/lesson', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { courseId, lessonIndex } = req.body;

        const existing = await db.get(
            'SELECT id FROM student_progress WHERE student_id = ? AND course_id = ? AND lesson_index = ? AND completed = 1',
            [studentId, courseId, lessonIndex]
        );

        if (!existing) {
            await db.run(
                'INSERT INTO student_progress (student_id, course_id, lesson_index, completed) VALUES (?,?,?,1)',
                [studentId, courseId, lessonIndex]
            );
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/progress/:studentId/quiz', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { courseId, score, total } = req.body;

        await db.run(
            'INSERT INTO student_progress (student_id, course_id, quiz_score, quiz_total) VALUES (?,?,?,?)',
            [studentId, courseId, score, total]
        );

        const pct = Math.round((score / total) * 100);
        await db.run('UPDATE courses SET progress = ? WHERE id = ?', [pct, courseId]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Doubts & Mentorship
app.get('/api/doubts/:studentId', async (req, res) => {
    try {
        const doubts = await db.all(
            'SELECT * FROM doubts WHERE student_id = ? ORDER BY created_at DESC',
            [req.params.studentId]
        );
        res.json({ success: true, data: doubts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/doubts', async (req, res) => {
    try {
        const { studentId, courseId, courseName, lesson, question } = req.body;
        const result = await db.run(
            'INSERT INTO doubts (student_id, course_id, course_name, lesson, question) VALUES (?,?,?,?,?)',
            [studentId, courseId, courseName, lesson, question]
        );
        const doubt = await db.get('SELECT * FROM doubts WHERE id = ?', [result.lastID]);
        res.json({ success: true, data: doubt });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/doubts/:studentId/:doubtId', async (req, res) => {
    try {
        const doubt = await db.get(
            'SELECT * FROM doubts WHERE id = ? AND student_id = ?',
            [req.params.doubtId, req.params.studentId]
        );
        if (!doubt) return res.status(404).json({ success: false, error: 'Doubt not found' });
        res.json({ success: true, data: doubt });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Opportunities
app.get('/api/opportunities', async (req, res) => {
    try {
        const opps = await db.all('SELECT * FROM opportunities');
        res.json({ success: true, data: opps });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Offline Sync Queue
app.post('/api/sync/queue', async (req, res) => {
    try {
        const { studentId, data, type } = req.body;
        const result = await db.run(
            'INSERT INTO sync_queue (student_id, type, data) VALUES (?,?,?)',
            [studentId, type, JSON.stringify(data)]
        );
        const item = await db.get('SELECT * FROM sync_queue WHERE id = ?', [result.lastID]);
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/sync/queue/:studentId', async (req, res) => {
    try {
        const pending = await db.all(
            'SELECT * FROM sync_queue WHERE student_id = ? AND synced = 0',
            [req.params.studentId]
        );
        res.json({ success: true, data: pending });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/sync/process', async (req, res) => {
    try {
        const { studentId } = req.body;
        const result = await db.run(
            'UPDATE sync_queue SET synced = 1, synced_at = CURRENT_TIMESTAMP WHERE student_id = ? AND synced = 0',
            [studentId]
        );
        res.json({ success: true, data: { processed: result.changes } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Community Hubs
app.get('/api/hubs', async (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'VidyaSetu Community Hub 01', connected: true, lastUpdate: '2 days ago' }
        ]
    });
});

db.init()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    });

module.exports = app;
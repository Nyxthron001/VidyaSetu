const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'vidyasetu.db');
let _db = null;

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        _db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        _db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        _db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function createTables() {
    await run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        college TEXT,
        programme TEXT,
        location TEXT,
        language TEXT DEFAULT 'hi',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await run(`CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        level TEXT,
        lessons INTEGER,
        size TEXT,
        langs TEXT,
        progress INTEGER DEFAULT 0,
        status TEXT DEFAULT 'not-started',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await run(`CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id TEXT NOT NULL,
        title TEXT NOT NULL,
        position INTEGER,
        content TEXT,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);

    await run(`CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id TEXT NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_answer INTEGER DEFAULT 0,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )`);

    await run(`CREATE TABLE IF NOT EXISTS student_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        course_id TEXT,
        lesson_index INTEGER,
        completed BOOLEAN DEFAULT 0,
        quiz_score INTEGER,
        quiz_total INTEGER,
        last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await run(`CREATE TABLE IF NOT EXISTS doubts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        course_id TEXT,
        course_name TEXT,
        lesson TEXT,
        question TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        reply TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        replied_at DATETIME
    )`);

    await run(`CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await run(`CREATE TABLE IF NOT EXISTS opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        organization TEXT,
        location TEXT,
        deadline TEXT,
        type TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        type TEXT NOT NULL,
        data TEXT NOT NULL,
        synced BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced_at DATETIME
    )`);
}

async function seedFromFile() {
    const row = await get('SELECT COUNT(*) as count FROM courses');
    if (row && row.count > 0) return;

    const seedPath = path.join(__dirname, 'seeds', 'data.json');
    if (!fs.existsSync(seedPath)) return;

    const raw = fs.readFileSync(seedPath, 'utf8');
    const seed = JSON.parse(raw);

    if (Array.isArray(seed.courses)) {
        for (const c of seed.courses) {
            await run(
                'INSERT INTO courses (id, title, level, lessons, size, langs, progress, status, description) VALUES (?,?,?,?,?,?,?,?,?)',
                [c.id, c.title, c.level, c.lessons, c.size, c.langs, c.progress || 0, c.status || 'not-started', c.description || '']
            );
        }
    }

    if (seed.lessons && typeof seed.lessons === 'object') {
        for (const [courseId, titles] of Object.entries(seed.lessons)) {
            for (let i = 0; i < titles.length; i++) {
                await run(
                    'INSERT INTO lessons (course_id, title, position) VALUES (?,?,?)',
                    [courseId, titles[i], i]
                );
            }
        }
    }

    if (seed.quizzes && typeof seed.quizzes === 'object') {
        for (const [courseId, questions] of Object.entries(seed.quizzes)) {
            for (const q of questions) {
                await run(
                    'INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES (?,?,?,?)',
                    [courseId, q.question, JSON.stringify(q.options), q.correct]
                );
            }
        }
    }

    if (Array.isArray(seed.opportunities)) {
        for (const opp of seed.opportunities) {
            await run(
                'INSERT INTO opportunities (title, organization, location, deadline, type) VALUES (?,?,?,?,?)',
                [opp.title, opp.organization, opp.location, opp.deadline, opp.type]
            );
        }
    }

    console.log('Database initialized and seeded from seeds/data.json');
}

async function init() {
    if (_db) return;

    await new Promise((resolve, reject) => {
        _db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Failed to open database:', err.message);
                return reject(err);
            }
            resolve();
        });
    });

    await createTables();
    await seedFromFile();
    console.log('Database connected & ready');
}

function close() {
    if (!_db) return Promise.resolve();
    return new Promise((resolve) => {
        _db.close((err) => {
            if (err) console.error('Error closing db:', err.message);
            _db = null;
            resolve();
        });
    });
}

module.exports = { init, run, get, all, close };
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'vidyasetu.db');

class Database {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('Database connection error:', err);
                    reject(err);
                    return;
                }

                console.log('Connected to database');

                this.createTables()
                    .then(() => {
                        this.initialized = true;
                        resolve();
                    })
                    .catch(reject);
            });
        });
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            const queries = [
                `CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    college TEXT,
                    programme TEXT,
                    location TEXT,
                    language TEXT DEFAULT 'hi',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,

                `CREATE TABLE IF NOT EXISTS courses (
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
                )`,

                `CREATE TABLE IF NOT EXISTS lessons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    course_id TEXT,
                    title TEXT NOT NULL,
                    position INTEGER,
                    content TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (course_id) REFERENCES courses(id)
                )`,

                `CREATE TABLE IF NOT EXISTS quiz_questions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    course_id TEXT,
                    question TEXT NOT NULL,
                    options TEXT NOT NULL,
                    correct_answer INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (course_id) REFERENCES courses(id)
                )`,

                `CREATE TABLE IF NOT EXISTS student_progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER,
                    course_id TEXT,
                    lesson_id INTEGER,
                    completed BOOLEAN DEFAULT FALSE,
                    quiz_score INTEGER,
                    quiz_total INTEGER,
                    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES students(id),
                    FOREIGN KEY (course_id) REFERENCES courses(id)
                )`,

                `CREATE TABLE IF NOT EXISTS doubts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER,
                    course_id TEXT,
                    course_name TEXT,
                    lesson TEXT,
                    question TEXT NOT NULL,
                    status TEXT DEFAULT 'Pending',
                    reply TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    replied_at DATETIME,
                    FOREIGN KEY (student_id) REFERENCES students(id)
                )`,

                `CREATE TABLE IF NOT EXISTS achievements (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER,
                    name TEXT NOT NULL,
                    description TEXT,
                    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES students(id)
                )`,

                `CREATE TABLE IF NOT EXISTS opportunities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    organization TEXT,
                    location TEXT,
                    deadline TEXT,
                    type TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`,

                `CREATE TABLE IF NOT EXISTS sync_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER,
                    type TEXT NOT NULL,
                    data TEXT NOT NULL,
                    synced BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    synced_at DATETIME
                )`
            ];

            let completed = 0;
            queries.forEach(query => {
                this.db.run(query, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    completed++;
                    if (completed === queries.length) {
                        console.log('Tables created');
                        this.seedData().then(resolve).catch(reject);
                    }
                });
            });
        });
    }

    async seedData() {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT COUNT(*) as count FROM courses', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row.count > 0) {
                    console.log('Data already seeded');
                    resolve();
                    return;
                }

                const courses = [
                    ['digital-skills', 'Digital Skills for College Students', 'Beginner', 5, '42 MB', 'Hindi + English', 65, 'in-progress', 'Core digital literacy for college life.'],
                    ['comm-english', 'Communication and Spoken English', 'Beginner', 6, '55 MB', 'English + Hindi', 35, 'in-progress', 'Build confidence speaking English.'],
                    ['resume-prep', 'Resume and Interview Preparation', 'Beginner', 4, '28 MB', 'Hindi + English', 0, 'not-started', 'Prepare a strong resume and ace interviews.'],
                    ['digital-safety', 'Introduction to Digital Safety', 'Beginner', 5, '36 MB', 'Hindi + English', 100, 'downloaded', 'Stay safe online and protect your data.']
                ];

                const courseStmt = this.db.prepare('INSERT INTO courses (id, title, level, lessons, size, langs, progress, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

                courses.forEach(course => {
                    courseStmt.run(course);
                });
                courseStmt.finalize();

                const lessonsData = {
                    'digital-skills': ['What is Digital Learning?', 'Email Basics', 'Online Safety', 'Creating Documents', 'Resume Preparation', 'Final Assessment'],
                    'comm-english': ['Introduction to Communication', 'Basic Greetings', 'Introducing Yourself', 'Phone Etiquette', 'Writing Emails', 'Final Assessment'],
                    'resume-prep': ['Resume Basics', 'Formatting Your Resume', 'Common Interview Questions', 'Final Assessment'],
                    'digital-safety': ['Understanding Online Threats', 'Strong Passwords', 'Phishing Awareness', 'Privacy Settings', 'Final Assessment']
                };

                for (const [courseId, lessons] of Object.entries(lessonsData)) {
                    const lessonStmt = this.db.prepare('INSERT INTO lessons (course_id, title, position) VALUES (?, ?, ?)');
                    lessons.forEach((lesson, index) => {
                        lessonStmt.run(courseId, lesson, index);
                    });
                    lessonStmt.finalize();
                }

                const quizData = {
                    'digital-skills': [
                        ['What is the benefit of offline learning?', '["No internet needed to keep learning","Faster videos","More storage","Less content"]', 0],
                        ['Which tool stores local progress?', '["Browser storage","A printer","A calculator","A camera"]', 0],
                        ['Why are captions useful?', '["They help everyone follow audio content","They slow down video","They cost extra","They replace lessons"]', 0],
                        ['What should a strong password contain?', '["A mix of letters, numbers and symbols","Only your name","Just numbers","The word password"]', 0],
                        ['Who helps resolve academic doubts?', '["A mentor","A stranger","No one","A random app"]', 0]
                    ]
                };

                for (const [courseId, questions] of Object.entries(quizData)) {
                    const quizStmt = this.db.prepare('INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES (?, ?, ?, ?)');
                    questions.forEach(q => {
                        quizStmt.run(courseId, q[0], q[1], q[2]);
                    });
                    quizStmt.finalize();
                }

                const opportunities = [
                    ['Digital Skills Scholarship', 'State Education Board', 'Uttar Pradesh', '15 Nov 2026', 'Scholarship'],
                    ['Community Data Entry Internship', 'Local NGO', 'Remote / Rural UP', '1 Dec 2026', 'Internship'],
                    ['Retail Apprenticeship', 'District Trade Council', 'Nearby town', '20 Oct 2026', 'Apprenticeship']
                ];

                const oppStmt = this.db.prepare('INSERT INTO opportunities (title, organization, location, deadline, type) VALUES (?, ?, ?, ?, ?)');
                opportunities.forEach(opp => {
                    oppStmt.run(opp);
                });
                oppStmt.finalize();

                console.log('Database seeded');
                resolve();
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async close() {
        if (this.db) {
            return new Promise((resolve) => {
                this.db.close((err) => {
                    if (err) console.error('Error closing database:', err);
                    else console.log('Database connection closed');
                    resolve();
                });
            });
        }
    }
}

module.exports = new Database();
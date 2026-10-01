# VidyaSetu (विद्यासेतु)

An offline-first learning web app designed for students with limited or intermittent internet connectivity in rural areas.

Students can download course lessons, take quizzes, track progress, and submit questions/doubts to mentors offline. When the device reconnects to the internet or a local community learning hub, cached progress and queries automatically sync with the backend.

---

## Key Features

- **Offline-First Learning**: All course content, quizzes, and progress are cached locally in `localStorage`.
- **Bilingual (Hindi / English)**: Full in-app language switching with Hindi as default.
- **Mentorship & Doubts**: Students can queue doubts offline; they sync automatically once back online.
- **Accessibility Support**: Built-in dark mode, high contrast mode, adjustable text size, and Web Speech read-aloud support.
- **Lightweight Backend**: Node.js + Express with an SQLite database for syncing student data and serving course catalogs.

---

## Project Structure

```
VidyaSetu/
├── vidyasetu.html       # Standalone frontend SPA (HTML, CSS, Vanilla JS)
├── backend/
│   ├── server.js        # Express REST API server
│   ├── database.js      # SQLite connection & schema setup
│   ├── seeds/
│   │   └── data.json    # Initial courses, lessons, and quiz questions
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

---

## Getting Started

### 1. Run Frontend Only (No Installation Needed)
You can directly open `vidyasetu.html` in any web browser. The app runs completely standalone in offline demo mode using client-side storage.

### 2. Run with Backend API

**Prerequisites:** [Node.js](https://nodejs.org/) (v16 or higher)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server (creates and seeds SQLite database automatically)
npm start
```

The server will start on `http://localhost:3000` and automatically serve both the API and the `vidyasetu.html` frontend.

---

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/courses` | `GET` | List all available courses |
| `/api/courses/:id/lessons` | `GET` | Get lessons list for a course |
| `/api/courses/:id/quiz` | `GET` | Get quiz questions for a course |
| `/api/progress/:studentId` | `GET` | Fetch student lesson & quiz progress |
| `/api/progress/:studentId/lesson` | `POST` | Record completed lesson |
| `/api/progress/:studentId/quiz` | `POST` | Save quiz score |
| `/api/doubts/:studentId` | `GET` / `POST` | View or submit academic doubts |
| `/api/opportunities` | `GET` | List local scholarships & internships |
| `/api/sync/queue` | `POST` | Push offline actions to sync queue |
| `/api/sync/process` | `POST` | Process pending sync queue items |

---

## License

MIT
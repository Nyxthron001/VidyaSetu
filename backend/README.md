# VidyaSetu Backend API

Express.js REST API and SQLite storage layer for VidyaSetu.

## Setup & Run

```bash
# Install dependencies
npm install

# Start production server
npm start

# Or start in dev mode with auto-reload
npm run dev
```

The server listens on `http://localhost:3000`. On first run, it automatically creates the local SQLite database (`vidyasetu.db`) and seeds it from `seeds/data.json`.

## Endpoints

- `GET /api/courses` - Fetch all courses
- `GET /api/courses/:id` - Fetch single course details
- `GET /api/courses/:id/lessons` - Fetch lesson titles for a course
- `GET /api/courses/:id/quiz` - Fetch quiz questions for a course
- `GET /api/progress/:studentId` - Fetch student course/quiz progress
- `POST /api/progress/:studentId/lesson` - Mark a lesson as completed
- `POST /api/progress/:studentId/quiz` - Submit quiz score
- `GET /api/doubts/:studentId` - List submitted doubts
- `POST /api/doubts` - Submit a new doubt
- `GET /api/opportunities` - List available opportunities
- `GET /api/hubs` - Check community learning hub connection status
- `POST /api/sync/queue` - Queue offline payloads
- `POST /api/sync/process` - Process queued items
# VidyaSetu Backend

A lightweight Node.js + Express backend for the VidyaSetu educational platform.

## Quick Start

```bash
cd backend
npm install
npm start
```

Server runs at `http://localhost:3000`

## Features

- RESTful API for courses, lessons, quizzes
- Student progress tracking
- Doubt submission and management
- Opportunities listing
- Offline sync queue
- Learning hubs information

## API Endpoints

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/lessons` - Get course lessons
- `GET /api/courses/:id/quiz` - Get course quiz

### Progress
- `GET /api/progress/:studentId` - Get student progress
- `POST /api/progress/:studentId/lesson` - Save lesson progress
- `POST /api/progress/:studentId/quiz` - Submit quiz result

### Doubts
- `GET /api/doubts/:studentId` - Get student doubts
- `POST /api/doubts` - Submit new doubt

### Other
- `GET /api/opportunities` - Get opportunities
- `GET /api/hubs` - Get learning hubs
- `POST /api/sync/queue` - Queue data for sync
- `POST /api/sync/process` - Process sync queue

## Running with Frontend

The backend serves the frontend HTML file automatically at the root route.

## Tech Stack

- Node.js
- Express.js
- SQLite (optional)

## License

MIT
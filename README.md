# VidyaSetu

An offline-first educational platform built for students in rural India who face limited or unreliable internet connectivity.

## The Problem We Address

In many parts of India, students have smartphones but inconsistent internet access. This gap prevents them from accessing quality educational content when they need it most. VidyaSetu bridges this divide by letting students download courses and learn even when they're offline.

## What Makes It Different

- **Works without internet** - Download lessons while you have data, study anywhere later
- **Bilingual interface** - Available in Hindi and English
- **Progress that sticks** - Your learning progress saves locally and syncs when you're back online
- **Mentor support** - Ask questions and get help from mentors even in remote areas
- **Mobile-first design** - Built for low-end smartphones with varying screen sizes

## Quick Start

### Running the Frontend Only

Just open `vidyasetu.html` in any modern browser. It works completely offline using local storage.

### Running with Backend

```bash
cd backend
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Storage**: LocalStorage for offline client-side caching

## Features

| Feature | Description |
|---------|-------------|
| Course Library | Browse and download courses for offline access |
| Lesson Reader | Read lessons with audio support and transcripts |
| Quiz System | Take quizzes and track scores |
| Progress Tracking | Monitor your learning journey |
| Mentor Chat | Ask doubts and get responses |
| Achievements | Earn badges as you progress |
| Learning Hubs | Connect to community learning centers |

## Project Structure

```
VidyaSetu/
├── vidyasetu.html          # Main frontend application
├── backend/
│   ├── server.js          # Express API server & routes
│   ├── database.js        # SQLite database connection & schema
│   ├── seeds/
│   │   └── data.json      # Initial course, quiz, & opportunity seed data
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

## API Endpoints

The backend provides these REST endpoints:

- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/lessons` - Get lessons for a course
- `GET /api/courses/:id/quiz` - Get quiz questions
- `GET /api/progress/:studentId` - Get student progress
- `POST /api/progress/:studentId/lesson` - Save lesson progress
- `POST /api/progress/:studentId/quiz` - Submit quiz results
- `GET /api/doubts/:studentId` - Get student's doubts
- `POST /api/doubts` - Submit a new doubt
- `GET /api/opportunities` - List available opportunities
- `POST /api/sync/queue` - Queue offline changes
- `POST /api/sync/process` - Process queued sync items

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Works best on mobile browsers including Chrome for Android and Safari for iOS.

## License

MIT License - feel free to use this for any purpose.
# VidyaSetu - Technology Stack

## Project Overview

VidyaSetu is a mobile-first, offline-capable educational platform designed for students in rural India with limited or intermittent internet connectivity.

## Solution Summary

The platform addresses the digital divide by providing accessible, localized learning experiences:

- Download courses for offline learning
- Track progress without internet
- Get mentor support for doubts
- Bilingual content (Hindi/English)
- Achievements and progress tracking

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup |
| CSS3 | Styling (Variables, Grid, Flexbox) |
| JavaScript ES6+ | Application logic |
| LocalStorage | Offline data persistence |
| IndexedDB | Structured storage |
| Service Worker | PWA offline caching |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| SQLite | Database (optional) |

### Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| npm | Package management |

## Architecture

### Offline-First Design

```
Mobile App → Service Worker → Local Cache
                ↓
        Offline Data Storage
                ↓
        Sync Queue → Server (when online)
```

### Key Features

- Offline-first with service workers
- Queue-based progress sync
- i18n support (Hindi, English)
- WCAG accessibility compliance

## Performance Targets

| Metric | Target |
|--------|--------|
| FCP (3G) | < 1.5s |
| TTI | < 3s |
| Bundle Size | < 150KB |

## Project Structure

```
VidyaSetu/
├── vidyasetu.html       # Main application
├── backend/             # Node.js backend
│   ├── server.js
│   ├── database.js
│   └── package.json
├── Documentation/
│   └── VidyaSetu_Tech_Stack.md
└── VidyaSetu_*.docx    # Business docs
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser

### Installation
```bash
cd backend
npm install
npm start
```

Server runs at `http://localhost:3000`

---

**Version**: 1.0
**Updated**: September 2026
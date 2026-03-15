# Writing Studio

A dark, literary-themed creative workspace for writers — built with React, TypeScript, Vite, and Firebase.

## Features

| Module | Description |
|---|---|
| **Dashboard** | Overview of all tools, word count, and streak |
| **Markdown Editor** | Split-pane editor with live preview and formatting toolbar |
| **Idea Vault** | Capture ideas with moods, tags, and notes |
| **Story Board** | Kanban-style board across the 6 narrative beats |
| **Character Database** | Full character profiles with traits, backstory, and motivation |
| **Writing Streak** | GitHub-style activity heatmap and session history |

## Tech Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite** for dev server and bundling
- **Firebase Auth** (Google OAuth)
- **Firestore** for real-time data
- **CSS Modules** for scoped styling
- **react-markdown** + **remark-gfm** for rendering

## Architecture

```
src/
├── types/         # Shared TypeScript interfaces
├── lib/           # Firebase init
├── services/      # Firestore CRUD (one file per collection)
├── hooks/         # React hooks (one per domain)
├── utils/         # Pure helper functions
├── components/
│   └── layout/    # Sidebar
├── pages/         # Full-page views (composed from hooks + UI)
└── styles/        # Global CSS variables and reset
```

## Setup

### 1. Firebase Project

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Google** provider
3. Enable **Firestore** in production or test mode

### 2. Firestore Indexes

Create a **composite index** for each collection that uses `where` + `orderBy`:

| Collection | Fields indexed |
|---|---|
| `ideas` | `userId ASC`, `createdAt DESC` |
| `characters` | `userId ASC`, `createdAt DESC` |
| `documents` | `userId ASC`, `updatedAt DESC` |

> Firestore will auto-prompt you with a link to create missing indexes the first time you run a query.

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

### 4. Install & Run

```bash
npm install
npm run dev
```

### 5. Deploy to Vercel

```bash
npm run build
# Upload dist/ to Vercel, or connect GitHub repo directly
```

Add all `VITE_FIREBASE_*` variables in the Vercel project settings under **Environment Variables**.

## Firestore Security Rules (recommended)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{docId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
    match /streaks/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

## License

MIT

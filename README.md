# Kanban Boards

A full-stack Kanban-style task board app (Trello-like) with JWT
authentication, built with Express, React, and MongoDB. Users can
register, create boards, and manage tasks across TODO / IN PROGRESS /
DONE lanes — with strict per-user, per-board access control.

## Tech Stack

- **Backend:** Express.js, MongoDB, Mongoose, JWT Auth, bcrypt
- **Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router
- **Auth:** JSON Web Tokens with bcrypt password hashing

## Features

- User registration and login with hashed passwords
- Create and view boards, each scoped to the logged-in user
- Full task CRUD within a board: create, move between lanes, delete
- Three-lane Kanban view (TODO / IN_PROGRESS / DONE) derived from a
  single tasks array
- Ownership-check middleware — a valid token alone isn't enough to
  access a board; the API also verifies the board actually belongs to
  the requesting user, preventing broken access control
- Centralized Express error handler normalizing Mongoose validation,
  cast, and duplicate-key errors into consistent JSON responses

## Project Structure

```
taskflow-boards/
├── taskflow-backend/    # Express + Mongoose + MongoDB
└── taskflow-frontend/   # React + Vite
```

Each folder has its own README with detailed setup instructions.

## Quick Start

**1. Backend**
```bash
cd taskflow-backend
npm install
cp .env.example .env   # add your MONGO_URI and JWT_SECRET
npm run dev
```

**2. Frontend** (in a separate terminal)
```bash
cd taskflow-frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The backend
runs on `http://localhost:5000` by default (or `4000` if you changed
`PORT` in `.env` — make sure `VITE_API_URL` in the frontend matches).

## API Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | open | Create an account |
| POST | `/api/auth/login` | open | Log in, returns a JWT |
| POST | `/api/boards` | JWT | Create a board |
| GET | `/api/boards` | JWT | List the caller's own boards |
| POST | `/api/tasks` | JWT + ownership | Create a task on a board |
| GET | `/api/tasks/:boardId` | JWT + ownership | List tasks on a board |
| PUT | `/api/tasks/:id` | JWT (ownership checked inline) | Update task status |
| DELETE | `/api/tasks/:id` | JWT (ownership checked inline) | Delete a task |

## Why the ownership check matters

A JWT only proves *who* is calling the API — it doesn't prove they're
allowed to touch a specific board. `checkBoardOwnership` middleware
fetches the board and compares its `userId` to the logged-in user before
letting the request through, returning 404 (not 403) so it doesn't leak
that a board belonging to someone else exists. This is the kind of
access-control gap many beginner CRUD apps skip.
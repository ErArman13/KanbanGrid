# TaskFlow Boards — Frontend

Vite + React + Tailwind client for the boards/tasks backend. Covers steps
1–8 of the frontend build plan: axios interceptors, auth pages with route
protection, a boards list, a board view with three filtered lanes, and
global 401 handling.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

Make sure the backend (taskflow-backend.zip) is running first — this app
expects it at `http://localhost:5000/api` by default.

## Structure

```
src/
  api/axiosInstance.js   axios client — attaches JWT to every request,
                          redirects to /login on any 401
  context/AuthContext.jsx  holds user/token state, login()/logout()
  components/
    PrivateRoute.jsx     redirects unauthenticated users to /login
    TaskCard.jsx          one task with move/delete controls
  pages/
    Login.jsx / Register.jsx
    Boards.jsx            list + create boards
    BoardView.jsx         single tasks array, 3 lanes via .filter()
  App.jsx                 routes
  main.jsx                 entry point
```

## How the board view stays simple

`BoardView` keeps ONE `tasks` state array fetched from
`GET /api/tasks/:boardId`. The three lanes (To Do / In Progress / Done) are
just `tasks.filter(t => t.status === lane.status)` — there's no separate
state per column to keep in sync. Moving or deleting a task updates that
one array locally after a successful API call, so the UI reflects the
change instantly without refetching everything.

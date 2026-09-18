# TaskFlow Boards — Backend

Express + MongoDB API for a Kanban-style boards/tasks app. Covers steps 1–8
of the backend build plan: schemas with validation, JWT auth, an
ownership-check middleware to prevent broken access control, and a
centralized error handler.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # or: npm start
```

## Folder structure

```
models/        User, Board, Task — Mongoose schemas with validation
middleware/    verifyJWT, checkBoardOwnership, errorHandler
controllers/   authController, boardController, taskController
routes/        authRoutes, boardRoutes, taskRoutes
utils/         AppError (operational error class), asyncHandler (removes try/catch)
server.js      wires everything together — errorHandler is registered LAST
```

## API

| Method | Route                | Auth              | Body                              |
|--------|-----------------------|-------------------|------------------------------------|
| POST   | /api/auth/register     | open              | `{ email, password }`              |
| POST   | /api/auth/login        | open              | `{ email, password }`              |
| POST   | /api/boards             | verifyJWT         | `{ title }`                        |
| GET    | /api/boards             | verifyJWT         | —                                   |
| POST   | /api/tasks               | verifyJWT + ownership | `{ title, description?, boardId }` |
| GET    | /api/tasks/:boardId       | verifyJWT + ownership | —                                   |
| PUT    | /api/tasks/:id             | verifyJWT (ownership checked inline) | `{ status }`              |
| DELETE | /api/tasks/:id             | verifyJWT (ownership checked inline) | —                          |

## Why the ownership check exists

A valid JWT only proves *who* is calling — it doesn't prove they're allowed
to touch a specific board or task. `checkBoardOwnership` fetches the board
and compares `board.userId` to the logged-in user before letting the
request through, returning 404 (not 403) so it doesn't leak that a board
belonging to someone else exists.

## Why the centralized error handler exists

Every controller uses `asyncHandler` instead of try/catch, and throws
`AppError(message, statusCode)` for expected failures. All of that funnels
into one error-handling middleware in `server.js` (must be registered last)
which also normalizes Mongoose `ValidationError`, `CastError`, and
duplicate-key errors into consistent JSON responses.

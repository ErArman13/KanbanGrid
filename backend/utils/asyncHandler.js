// Wraps an async route handler so any thrown error (or rejected promise)
// is automatically forwarded to next(err) -> your centralized error handler.
// This is what lets your controllers skip try/catch blocks entirely.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

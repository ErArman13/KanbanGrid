// Centralized error handler. Must be registered LAST in server.js, after all
// routes: app.use(errorHandler)
//
// Every controller either throws an AppError (expected, safe-to-show error)
// or lets an unexpected exception bubble up via asyncHandler. This single
// place decides how each becomes an HTTP response, so you never repeat
// try/catch + res.status(...).json(...) in every route.
const errorHandler = (err, req, res, next) => {
  // Known/operational error (bad input, not found, unauthorized, etc.)
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  // Mongoose validation errors (e.g. schema minlength/enum/required failing)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose bad ObjectId (e.g. malformed :id in a route param)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key (e.g. registering with an email that already exists)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already in use`;
  }

  // Log full detail server-side always; only expose safe messages to client
  if (statusCode === 500) {
    console.error('UNEXPECTED ERROR:', err);
    message = 'Internal server error'; // never leak stack traces / raw err.message for 500s
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

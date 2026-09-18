// A small helper class so every "expected" error (bad input, not found,
// unauthorized) carries an HTTP status code and a flag that marks it as
// "operational" (i.e. safe to show the message to the client), as opposed
// to a raw bug/exception which should never leak its message to the client.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');


const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // stash for downstream handlers/middleware
    next();
  } catch (err) {
    // jwt.verify throws on expired/tampered/malformed tokens
    throw new AppError('Not authorized, token invalid or expired', 401);
  }
});

module.exports = verifyJWT;

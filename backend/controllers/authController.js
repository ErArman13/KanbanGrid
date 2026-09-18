const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register  (body: { email, password })
exports.register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password: hashedPassword });
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    data: { token, user: { id: user._id, email: user.email } },
  });
});

// POST /api/auth/login  (body: { email, password })
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has `select: false` in the schema, so it must be explicitly requested
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: true,
    data: { token, user: { id: user._id, email: user.email } },
  });
});

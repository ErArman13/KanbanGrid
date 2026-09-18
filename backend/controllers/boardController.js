const Board = require('../models/Board');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/boards  (body: { title })  — requires verifyJWT
exports.createBoard = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const board = await Board.create({ title, userId: req.userId });
  res.status(201).json({ success: true, data: board });
});

// GET /api/boards — requires verifyJWT, only returns the caller's own boards
exports.getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: boards });
});

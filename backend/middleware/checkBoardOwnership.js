const mongoose = require('mongoose');
const Board = require('../models/Board');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Run this AFTER verifyJWT on any route that takes a :boardId param
// (e.g. GET /api/tasks/:boardId, POST /api/tasks with boardId in body).
//
// Without this check, a logged-in user could pass ANY board's ObjectId
// and read/write tasks on a board they don't own, as long as their own
// token is valid. verifyJWT alone does not stop this — it only proves
// *a* user is logged in, not that *this* user owns *this* board.
const checkBoardOwnership = asyncHandler(async (req, res, next) => {
  // boardId can arrive as a route param (:boardId) or in the body (POST /tasks)
  const boardId = req.params.boardId || req.body.boardId;

  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    throw new AppError('Valid boardId is required', 400);
  }

  const board = await Board.findById(boardId);

  if (!board) {
    throw new AppError('Board not found', 404);
  }

  if (board.userId.toString() !== req.userId) {
    // 404, not 403 — don't reveal that a board with this id exists
    // if it belongs to someone else
    throw new AppError('Board not found', 404);
  }

  req.board = board; // downstream handler can reuse it, no second query needed
  next();
});

module.exports = checkBoardOwnership;

const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/tasks/:boardId
// verifyJWT + checkBoardOwnership already ran, so req.board is guaranteed
// to belong to req.userId here.
exports.getTasksForBoard = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ boardId: req.board._id });
  res.status(200).json({ success: true, data: tasks });
});

// POST /api/tasks  (body: { title, boardId, description? })
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // req.board is attached by checkBoardOwnership — confirms this user
  // actually owns the board they're trying to add a task to.
  const task = await Task.create({
    title,
    description,
    boardId: req.board._id,
  });
  res.status(201).json({ success: true, data: task });
});

// PUT /api/tasks/:id  (body: { status })
exports.updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id).populate('boardId');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Ownership check inline here since the route only has a task :id,
  // not a :boardId — same principle as checkBoardOwnership.
  if (task.boardId.userId.toString() !== req.userId) {
    throw new AppError('Task not found', 404);
  }

  task.status = status; // schema enum validation runs on save()
  await task.save();

  res.status(200).json({ success: true, data: task });
});

// DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('boardId');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.boardId.userId.toString() !== req.userId) {
    throw new AppError('Task not found', 404);
  }

  await task.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

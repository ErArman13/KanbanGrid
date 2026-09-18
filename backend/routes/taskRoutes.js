const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const checkBoardOwnership = require('../middleware/checkBoardOwnership');
const {
  getTasksForBoard,
  createTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

// Every route below requires a valid JWT.
// Routes carrying a boardId also run checkBoardOwnership afterwards,
// so by the time the controller runs, both identity AND ownership
// are already verified.
router.get('/:boardId', verifyJWT, checkBoardOwnership, getTasksForBoard);
router.post('/', verifyJWT, checkBoardOwnership, createTask);
router.put('/:id', verifyJWT, updateTaskStatus); // ownership checked inline (see controller)
router.delete('/:id', verifyJWT, deleteTask); // ownership checked inline (see controller)

module.exports = router;

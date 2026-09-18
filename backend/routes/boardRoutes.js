const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const { createBoard, getBoards } = require('../controllers/boardController');

// Note: no checkBoardOwnership needed here — getBoards is naturally scoped
// to req.userId, and createBoard always creates under the caller's own id.
// Ownership only becomes a question once a boardId is passed INTO a route,
// which is what checkBoardOwnership guards on the task routes.
router.post('/', verifyJWT, createBoard);
router.get('/', verifyJWT, getBoards);

module.exports = router;

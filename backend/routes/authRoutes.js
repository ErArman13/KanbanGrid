const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Open routes — no verifyJWT here, this is how you GET a token in the first place
router.post('/register', register);
router.post('/login', login);

module.exports = router;

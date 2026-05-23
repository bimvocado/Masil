// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// POST /api/users/signup
router.post('/signup', userController.signup);

// POST /api/users/login
router.post('/login', userController.login);

router.get('/profile/:userId', userController.getProfile);

module.exports = router;
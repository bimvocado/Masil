const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/check-duplicate', userController.checkDuplicate);

router.get('/profile/:userId', userController.getProfile);

router.patch('/profile', authMiddleware, userController.updateProfile);

router.patch('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
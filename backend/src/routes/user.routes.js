const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');
const { validateSignup } = require('../middlewares/validator.middleware');


router.post('/signup', validateSignup, userController.signup);
router.get('/check-duplicate', userController.checkDuplicate);

router.get('/profile/:userId', userController.getProfile);
router.get('/:userId/posts', userController.getUserPosts);

router.patch('/profile', authMiddleware, upload.single('image'), userController.updateProfile);
router.patch('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
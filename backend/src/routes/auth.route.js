const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../middlewares/validator.middleware');

router.post('/login', validateLogin, authController.login);
router.post('/google', authController.googleLogin);
module.exports = router;
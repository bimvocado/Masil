const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// 프론트엔드에서 구글 인가 코드를 보낼 주소
router.post('/google', authController.googleLogin);

module.exports = router;
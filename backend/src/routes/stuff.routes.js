const express = require('express');
const router = express.Router();
const stuffController = require('../controllers/stuff.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
// 1. 검색창 - 상품으로 검색
router.get('/search', stuffController.searchStuffs);

// 2. 상품 생성
router.post('/', stuffController.createStuff);

// 3. 상품창 - 상세 페이지 전체 
// 💡 authMiddleware를 통해 누가 보는지(국적) 파악합니다!
router.get('/:stuffId/detail', authMiddleware, stuffController.getStuffDetail);

module.exports = router;
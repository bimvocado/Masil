const express = require('express');
const router = express.Router();

const stuffController = require('../controllers/stuff.controller');

// 검색창 - 상품으로 검색
router.get('/search', stuffController.searchStuffs);

// 상품 생성
router.post('/', stuffController.createStuff);

// 상품창 - 상세 페이지 전체
router.get('/:stuffId/detail', stuffController.getStuffDetail);

module.exports = router;
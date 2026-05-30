const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brand.controller');

// 검색창 - 브랜드 리스트 3열
router.get('/', brandController.getBrandList);

// 검색창 - 브랜드로 검색
router.get('/search', brandController.searchBrands);

// 브랜드창 - 상품 리스트 나열
router.get('/:brandId/stuffs', brandController.getBrandStuffList);

module.exports = router;
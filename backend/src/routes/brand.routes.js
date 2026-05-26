const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brand.controller');

// 브랜드 생성
router.post('/', brandController.createBrand);

// 브랜드 수정
router.patch('/:brandId', brandController.updateBrand);

// 브랜드 삭제
router.delete('/:brandId', brandController.deleteBrand);

/* 브랜드 탐색 페이지
 GET /api/brands/search?category=FOOD
 GET /api/brands/search?category=HOUSEHOLD
 GET /api/brands/search?keyword=롯데리아&category=FOOD
*/ 
router.get(
  '/search',
  brandController.searchBrands
);

module.exports = router;
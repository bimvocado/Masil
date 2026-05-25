const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brand.controller');

// 브랜드 생성
router.post('/', brandController.createBrand);

// 브랜드 수정
router.patch('/:brandId', brandController.updateBrand);

// 브랜드 삭제
router.delete('/:brandId', brandController.deleteBrand);

module.exports = router;
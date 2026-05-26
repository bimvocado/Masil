
// Express 라우터 만들기
const express = require('express');
const router = express.Router();

// Stuff 관련 요청 처리 controller
const stuffController =
  require('../controllers/stuff.controller');


// 상품 생성
// POST /api/stuffs
router.post('/',
  stuffController.createStuff
);


// 상품 수정
// PATCH /api/stuffs/:stuffId
router.patch('/:stuffId',
  stuffController.updateStuff
);


// 상품 삭제
// DELETE /api/stuffs/:stuffId
router.delete('/:stuffId',
  stuffController.deleteStuff
);


// 브랜드별 상품 목록 조회
// GET /api/stuffs/brand/1?sort=LIKE_DESC&page=0&size=10
router.get('/brand/:brandId', 
  stuffController.getStuffsByBrandId
);

// 상품 상세 페이지 조회
// GET /api/stuffs/1/detail
router.get('/:stuffId/detail',
  stuffController.getStuffDetail
);


module.exports = router;
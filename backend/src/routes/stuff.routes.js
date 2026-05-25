const express = require('express');

const router = express.Router();

const stuffController =
  require('../controllers/stuff.controller');


// 상품 생성
// POST /api/stuffs
router.post(
  '/',
  stuffController.createStuff
);


// 상품 수정
// PATCH /api/stuffs/:stuffId
router.patch(
  '/:stuffId',
  stuffController.updateStuff
);


// 상품 삭제
// DELETE /api/stuffs/:stuffId
router.delete(
  '/:stuffId',
  stuffController.deleteStuff
);


module.exports = router;
const { param, body, validationResult } = require('express-validator');

const ApiResponse = require('../utils/api-response.util');

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      ApiResponse.error(400, errors.array()[0].msg)
    );
  }
  next();
};

const validateToggleInteraction = [
  param('stuffId')
    .notEmpty().withMessage('상품 ID 누락')
    .isInt().withMessage('상품 ID는 숫자여야 합니다.'),

  body('reactionType')
    .notEmpty().withMessage('반응 종류(reactionType) 누락')
    .toUpperCase()
    .isIn(['LIKE', 'DISLIKE']).withMessage('반응 종류는 LIKE 또는 DISLIKE 중 하나여야 합니다.'),


  checkValidationResult,
];

const validateGetStats = [
  param('stuffId')
    .notEmpty().withMessage('상품 ID 누락')
    .isInt().withMessage('상품 ID는 숫자여야 합니다.'),

  checkValidationResult,
];

module.exports = {
  validateToggleInteraction,
  validateGetStats,
};
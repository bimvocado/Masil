const { body, validationResult } = require('express-validator');
const ApiResponse = require('../utils/api.response.util');

const validateSignup = [
  body('email').isEmail().withMessage('유효한 이메일 형식을 입력해주세요.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('비밀번호는 영문과 숫자를 포함해야 합니다.'),
  body('loginId').notEmpty().withMessage('아이디를 입력해주세요.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return ApiResponse.sendError(res, errors.array()[0].msg, 400);
    next();
  }
];

const validateLogin = [
  body('loginId').notEmpty().withMessage('아이디를 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return ApiResponse.sendError(res, errors.array()[0].msg, 400);
    next();
  }
];

const validateGoogleLogin = [
  body('code').notEmpty().withMessage('구글 인가 코드가 누락되었습니다.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return ApiResponse.sendError(res, errors.array()[0].msg, 400);
    next();
  }
];

module.exports = { validateSignup, validateLogin, validateGoogleLogin };
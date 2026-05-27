const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/api.response.util'); // 👈 유틸 추가

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * 1. 일반 로그인
 */
const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body;
    const user = await userService.loginUser(loginId, password);

    const token = jwt.sign(
      { userId: user.userId || user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return ApiResponse.send(res, {
      token,
      user: {
        userId: user.userId || user.id,
        loginId: user.loginId,
        nickname: user.nickname
      }
    }, '로그인 성공');
    
  } catch (error) {
    next(error);
  }
};

/**
 * 2. 구글 로그인
 */
const googleLogin = async (req, res, next) => {
  const { code, codeVerifier } = req.body;
  try {
    const { tokens } = await client.getToken({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      codeVerifier, 
    });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const user = await userService.socialLoginOrSignup(payload);

    const accessToken = jwt.sign(
      { userId: user.userId || user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return ApiResponse.send(res, {
      token: accessToken,
      user: {
        userId: user.userId || user.id,
        nickname: user.nickname,
        email: user.email
      }
    }, '구글 로그인 성공');

  } catch (error) {
    console.error('구글 로그인 에러:', error);
    return ApiResponse.sendError(res, error.message || '구글 로그인 실패', error.status || 500);
  }
};

module.exports = { login, googleLogin };
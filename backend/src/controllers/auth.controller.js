const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const userService = require('../services/user.service'); // 일반 로그인용
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * 1. 일반 로그인 (통합 수정)
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

    return res.status(200).json({
      success: true,
      token: token, 
      data: {
        userId: user.userId || user.id,
        loginId: user.loginId,
        nickname: user.nickname
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. 구글 로그인 (이미 고쳤던 것 다시 확인)
 */
const googleLogin = async (req, res) => {
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
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ where: { socialId: sub, provider: 'google' } });

    if (!user) {
      user = await User.create({
        loginId: `google_${sub}`,
        email: email,
        nickname: name,
        socialId: sub,
        provider: 'google',
        profileImageUrl: picture,
      });
    }
    const accessToken = jwt.sign(
      { userId: user.userId || user.id || user.dataValues?.userId }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        userId: user.userId || user.id || user.dataValues?.userId,
        nickname: user.nickname,
        email: user.email
      }
    });
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    res.status(500).json({ success: false, message: '구글 로그인 실패' });
  }
};

module.exports = { login, googleLogin };
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

const googleLogin = async (req, res) => {
    const { code, codeVerifier } = req.body;
    try {
        const { tokens } = await client.getToken({
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          // 🚨 구글아, 여기 열쇠(verifier) 가져왔다! 문 열어!
          codeVerifier: codeVerifier, 
        });

    // 2. 토큰에서 유저 정보 추출 (id_token 디코딩)
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // 3. DB 확인 및 가입/로그인
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

    // 4. 우리 서비스 전용 JWT 발행
    const accessToken = jwt.sign(
      { userId: user.userId || user.id || user.dataValues?.userId }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
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

module.exports = { googleLogin };
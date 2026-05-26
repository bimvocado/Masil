const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');


const checkDuplicate = async (req, res, next) => {
  try {
    const { type, value } = req.query; 
    
    const isDuplicate = await userService.checkExists(type, value);

    return res.status(200).json({
      success: true,
      isDuplicate,
      message: isDuplicate ? `이미 사용 중인 ${type}입니다.` : `사용 가능한 ${type}입니다.`
    });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  console.log("드디어 백엔드에 요청 도착!!! 데이터:", req.body);
  try {
    const { loginId, email } = req.body;

    
    const idExists = await userService.checkExists('loginId', loginId);
    const emailExists = await userService.checkExists('email', email);

    if (idExists || emailExists) {
      return res.status(400).json({
        success: false,
        message: idExists ? '이미 존재하는 아이디입니다.' : '이미 존재하는 이메일입니다.'
      });
    }

    const newUser = await userService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: '회원가입 성공! 마실에 오신 것을 환영합니다.',
      data: { userId: newUser.userId }
    });
  } catch (error) {
    next(error); 
  }
};
const login = async (req, res, next) => {
  console.log("백엔드 로그인 요청 도착:", req.body);
  try {
    const { loginId, password } = req.body;
    const user = await userService.loginUser(loginId, password);

    // ✅ 2. JWT 토큰 생성 (비밀키 'your_jwt_secret'은 본인 설정에 맞게 변경)
    // 보통 process.env.JWT_SECRET 을 사용합니다.
    const token = jwt.sign(
      { id: user.userId, loginId: user.loginId }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: '로그인 성공',
      token: token, 
      data: {
        userId: user.userId,
        loginId: user.loginId,
        nickname: user.nickname
      }
    });
  } catch (error) {
    next(error);
  }
};
const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const user = await userService.getUserById(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    //토큰or user id 인데 아직 토큰 안해서 userid 
    const { userId, currentPassword, newPassword } = req.body;

    await userService.updatePassword(userId, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.'
    });
  } catch (error) {
    next(error); 
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.body.userId;
    console.log("🔍 [디버그] 추출된 userId:", userId);
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "인증되지 않은 사용자입니다." 
      });
    }

    const updateData = {
      nickname: req.body.nickname,
      bio: req.body.bio,
      profileImageUrl: req.file ? req.file.path : req.body.profileImageUrl 
    };

    const updatedUser = await userService.updateUserProfile(userId, updateData);

    return res.status(200).json({
      success: true,
      message: '프로필이 수정되었습니다.',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { signup, login, getProfile, checkDuplicate, changePassword,updateProfile  };
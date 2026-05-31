const userService = require('../services/user.service');
const postService = require('../services/post.service');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/api.response.util');
/**
 * 1. 중복 확인
 */
const checkDuplicate = async (req, res, next) => {
  try {
    const { type, value } = req.query; 
    const isDuplicate = await userService.checkExists(type, value);

    return ApiResponse.send(res, 
      { isDuplicate }, 
      isDuplicate ? `이미 사용 중인 ${type}입니다.` : `사용 가능한 ${type}입니다.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 2. 회원가입
 */
const signup = async (req, res, next) => {
  try {
    const { loginId, email } = req.body;
    const idExists = await userService.checkExists('loginId', loginId);
    if (idExists) return ApiResponse.sendError(res, '이미 존재하는 아이디입니다.', 400);

    const newUser = await userService.signup(req.body);
    return ApiResponse.send(res, { userId: newUser.userId }, '회원가입 성공!', 201);
  } catch (error) {
    next(error); 
  }
};

/**
 * 3. 로그인 (토큰 키값을 userId로 통일!)
 */
const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body;
    const user = await userService.loginUser(loginId, password);

    const token = jwt.sign(
      { userId: user.userId || user.id }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );

    return ApiResponse.send(res, {
      token,
      user: {
        userId: user.userId,
        loginId: user.loginId,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl
      }
    }, '로그인 성공');
  } catch (error) {
    next(error);
  }
};
/**
 * 4. 프로필 조회 (로그인 유지의 핵심!)
 */
const getProfile = async (req, res, next) => {
  console.log("📍 [백엔드] 프로필 API 진입 성공!");
  try {
    const userId = req.params.userId || (req.user ? req.user.userId : null); 
    if (!userId) {
      return res.status(401).json({ success: false, message: '인증되지 않은 사용자입니다.' });
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: '유저를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user.userId || user.id,
        loginId: user.loginId,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio, 
        profileImageUrl: user.profileImageUrl,
        country: user.country,
        isKorean: user.isKorean 
      },
      message: '프로필 조회 성공'
    });
  } catch (error) {
    next(error);
  }
};
/**
 * 5. 비밀번호 변경
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    await userService.updatePassword(userId, currentPassword, newPassword);

    return ApiResponse.send(res, null, '비밀번호가 변경되었습니다.');
  } catch (error) {
    next(error); 
  }
};
/**
 * 6. 프로필 수정 (국가 설정 로직 추가 버전)
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updateData = {};
    if (req.body.nickname) updateData.nickname = req.body.nickname;
    if (req.body.bio) updateData.bio = req.body.bio;
    if (req.body.country) updateData.country = req.body.country;
    if (req.file) {
      updateData.profileImageUrl = `/uploads/${req.file.filename}`; 
    }

    const updatedUser = await userService.updateUserProfile(userId, updateData);

    if (updatedUser.profileImageUrl?.startsWith('/uploads')) {
        const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
        updatedUser.profileImageUrl = `${SERVER_URL}${updatedUser.profileImageUrl}`;
    }

    return ApiResponse.send(res, updatedUser, '프로필이 수정되었습니다.');
  } catch (error) {
    next(error);
  }
};

/**
 * 7. 사용자별 게시글 조회
 */
const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log("[게시글 조회] 시도 중인 ID:", userId);

    if (!userId || userId === 'undefined') {
       return res.status(200).json({ success: true, data: [], message: 'ID 없음, 빈 배열 반환' });
    }

    const viewerId = req.query.viewerId ? Number(req.query.viewerId) : null;
    const posts = await postService.getUserPosts(Number(userId), viewerId);
    
    return res.status(200).json({
      success: true,
      data: posts || [], 
      message: '조회 성공'
    });

  } catch (error) {
    console.error("❌ [백엔드 내부 터짐]:", error.message);
    return res.status(200).json({ 
      success: true, 
      data: [], 
      message: '서버 에러가 났지만 일단 빈 배열 반환' 
    });
  }
};
module.exports = { signup, login, getProfile, checkDuplicate, changePassword, updateProfile, getUserPosts };
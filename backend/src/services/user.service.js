const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const categoryService = require('./category.service');
const sequelize = require('../config/db');
const Interaction = require('../models/interaction.model');

const DEFAULT_SCRAP_CATEGORY_NAME = '기본 스크랩';

const createDefaultScrapCategory = async (userId, transaction) => {
  return await categoryService.createCategory(userId, DEFAULT_SCRAP_CATEGORY_NAME, { transaction });
};

/* 회원가입 로직 */
const signup = async (userData) => {
  const { loginId, email, password, nickname, birthDate } = userData;

  return await sequelize.transaction(async (t) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      loginId,
      email,
      passwordHash: hashedPassword,
      nickname,
      birthDate,
      isKorean: userData.isKorean ?? true 
    }, { transaction: t });

    await createDefaultScrapCategory(newUser.userId, t);

    return newUser;
  });
};

/* 중복 체크 로직 */
const checkExists = async (type, value) => {
  console.log(`[DB 조회 시작] 타입: ${type}, 값: ${value}`); 
  try {
    const user = await User.findOne({ 
      where: { [type]: value },
      attributes: ['userId'],
      raw: true 
    });
    
    console.log(`[DB 조회 완료] 결과 존재 여부: ${!!user}`); 
    return !!user; 
  } catch (error) {
    console.error(" DB 조회 중 에러 발생:", error);
    throw error;
  }
};

/* 로그인 로직 */
const loginUser = async (loginId, password) => {
  const user = await User.findOne({ where: { loginId } });

  if (!user) {
    throw new Error('존재하지 않는 아이디입니다.');
  }

  // 모델 필드명이 passwordHash이므로 여기서도 맞춰줌
  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  return {
    userId: user.userId,
    loginId: user.loginId,
    nickname: user.nickname,
  };
};

/* 유저 조회 로직 */
const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    raw: true,
    attributes: { exclude: ['passwordHash'] } 
  });
  if (!user) throw new Error('유저를 찾을 수 없습니다.');
  return user;
};

/*비밀번호 수정 로직*/
const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId); 
  
  if (!user) throw new Error('해당 유저를 찾을 수 없습니다.');

  if (user.provider !== 'local') {
    const error = new Error('소셜 계정은 비밀번호를 변경할 수 없습니다. 해당 소셜 서비스에서 변경해주세요.');
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    const error = new Error('현재 비밀번호가 일치하지 않습니다.');
    error.status = 400;
    throw error;
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hashedPassword;
  await user.save(); 
  
  return true;
};

const socialLoginOrSignup = async (googleData) => {
  const { sub, email, name, picture } = googleData;

  let user = await User.findOne({ 
    where: { socialId: sub, provider: 'google' } 
  });

  if (!user) {
    const existingEmailUser = await User.findOne({ where: { email } });
    
    if (existingEmailUser) {
      const error = new Error(`이미 해당 이메일(${email})로 가입된 계정이 존재합니다. 기존 계정으로 로그인해 주세요.`);
      error.status = 409; // Conflict
      throw error;
    }

    user = await sequelize.transaction(async (t) => {
      const createdUser = await User.create({
        loginId: `google_${sub}`,
        email: email,
        nickname: name,
        passwordHash: 'SOCIAL_AUTH_USER', 
        socialId: sub,
        provider: 'google',
        profileImageUrl: picture,
        isKorean: true 
      }, { transaction: t });

      await createDefaultScrapCategory(createdUser.userId, t);
      return createdUser;
    });
  }

  return user;
};

const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

  
    if (updateData.country) {
  const isKor = updateData.country.includes('대한민국');
  
  updateData.isKorean = isKor;
  updateData.is_korean = isKor; // DB 컬럼명 대응

  console.log(`[국가변경] 입력된 국가: ${updateData.country} -> 판정 결과: ${isKor}`);
  await Interaction.update(
        { isKorean: isKor }, 
        { where: { userId: userId } }
      );
      console.log(`[동기화 완료] 유저 ${userId}의 모든 상호작용 국적을 ${isKor}로 변경함.`);
    }

    await user.update(updateData);

    const result = user.toJSON();
    delete result.passwordHash;
    
    return result;
  } catch (error) {
    console.error("서비스 에러 (updateUserProfile):", error);
    throw error; 
  }
};

module.exports = { 
  signup, 
  loginUser,
  getUserById,
  checkExists,
  updatePassword,
  socialLoginOrSignup,
  updateUserProfile 
};


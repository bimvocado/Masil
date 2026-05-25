const User = require('../models/user.model');
const bcrypt = require('bcrypt');

/* 회원가입 로직 */
const signup = async (userData) => {
  const { loginId, email, password, nickname, birthDate } = userData;

  // 1. 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. DB 저장 (모델의 필드명인 passwordHash에 꽂아줌)
  const newUser = await User.create({
    loginId,
    email,
    passwordHash: hashedPassword,
    nickname,
    birthDate,
    isKorean: userData.isKorean ?? true 
  });

  return newUser;
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

/* ⭐️ 비밀번호 변경 로직 (수정 완료) ⭐️ */
const updatePassword = async (userId, currentPassword, newPassword) => {
  console.log(`[서비스] 비밀번호 변경 시도 - userId: ${userId}`);

  // 1. 유저 조회 (raw: true를 쓰면 save()를 못하므로 인스턴스로 가져옵니다)
  const user = await User.findByPk(userId); 
  
  if (!user) {
    throw new Error('해당 유저를 찾을 수 없습니다.');
  }

  // 2. 비밀번호 비교 (모델 필드명인 passwordHash 사용!)
  // currentPassword: 사용자가 입력한 값 / user.passwordHash: DB에 저장된 암호화 값
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  
  if (!isMatch) {
    const error = new Error('현재 비밀번호가 일치하지 않습니다.');
    error.status = 400;
    throw error;
  }

  // 3. 새 비밀번호 암호화
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  // 4. DB 업데이트 (모델 필드명에 맞춰서 저장)
  user.passwordHash = hashedPassword;
  await user.save(); 
  
  console.log(`[서비스] userId: ${userId} 비밀번호 변경 완료`);
  return true;
};

module.exports = { 
  signup, 
  loginUser,
  getUserById,
  checkExists,
  updatePassword
};
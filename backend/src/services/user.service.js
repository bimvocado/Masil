const User = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * 회원가입 로직
 */
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


const loginUser = async (loginId, password) => {
const user = await User.findOne({ where: { loginId } });

  if (!user) {
    throw new Error('존재하지 않는 아이디입니다.');
  }

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

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    raw: true,
    attributes: { exclude: ['passwordHash'] } // 비밀번호는 빼고 가져오기 (보안!)
  });
  if (!user) throw new Error('유저를 찾을 수 없습니다.');
  console.log("서비스에서 찾은 유저:", user);
  return user;
};

module.exports = { 
  signup, 
  loginUser,
  getUserById
};
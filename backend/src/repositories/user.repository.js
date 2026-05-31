const User = require('../models/user.model');
const createUser = async (userData) => {
  const newUser = await User.create({
    loginId: userData.loginId,
    email: userData.email,
    passwordHash: userData.passwordHash,
    nickname: userData.nickname,
    birthDate: userData.birthDate,
    country: userData.country ?? '대한민국',
    isKorean: userData.country === '대한민국' ? true : (userData.isKorean ?? true)
  });
  
  return newUser;
};
//내부로직 고유번호로 정보찾기
const findByUserId = async (userId) => {
  
  return await User.findByPk(userId); 
};

//로그인전용
const findByLoginId = async (loginId) => {
  return await User.findOne({ where: { loginId } });
};

module.exports = { 
  createUser,
  findByLoginId,
  findByUserId
};
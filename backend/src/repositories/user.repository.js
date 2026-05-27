const User = require('../models/user.model');

const createUser = async (userData) => {
  const newUser = await User.create({
    loginId: userData.loginId,
    email: userData.email,
    passwordHash: userData.passwordHash,
    nickname: userData.nickname,
    birthDate: userData.birthDate,
    isKorean: userData.isKorean ?? true
  });
  
  return newUser;
};


const findByLoginId = async (loginId) => {
  return await User.findOne({ where: { loginId } });
};

module.exports = { 
  createUser,
  findByLoginId 
};
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const signup = async (userData) => {
  const { loginId, email, password, nickname, birthDate } = userData;


  const hashedPassword = await bcrypt.hash(password, 10);

 
  const newUser = await User.create({
    login_id: loginId,
    email: email,
    password_hash: hashedPassword,
    nickname: nickname,
    birth_date: birthDate,
  });

  return newUser;
};

module.exports = { signup};
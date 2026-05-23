const userService = require('../services/user.service');

// 회원가입
const signup = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await userService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: '회원가입 성공! 마실에 오신 것을 환영합니다.',
      data: { userId: newUser.user_id }
    });
  } catch (error) {
    next(error); 
  }
};

// 로그인
const login = async (req, res, next) => {
  try {
    const { loginId, password } = req.body;
    const result = await userService.loginUser(loginId, password);

    return res.status(200).json({
      success: true,
      message: '로그인 성공',
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
  
    const { userId } = req.params; 
    console.log("프론트에서 넘어온 userId 값:", userId);
    console.log("userId의 타입:", typeof userId);
    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getProfile};
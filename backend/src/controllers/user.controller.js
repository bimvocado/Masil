const userService = require('../services/user.service');

// 1. 중복 확인 API (아이디 또는 이메일)
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

// 2. 회원가입 (가입 직전 최종 중복 검사 추가)
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
      data: { userId: newUser.user_id }
    });
  } catch (error) {
    next(error); 
  }
};


const login = async (req, res, next) => {
  console.log("백엔드 로그인 요청 도착:", req.body);
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
    const user = await userService.getUserById(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getProfile, checkDuplicate };
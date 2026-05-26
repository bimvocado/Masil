//테스트용 예시 코드

const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/api.response.util'); // 아까 고친 경로 확인!

const authMiddleware = (req, res, next) => {
    try {
        // 1. 헤더에서 토큰 추출
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(ApiResponse.error(401, '인증 토큰이 없습니다.'));
        }

        const token = authHeader.split(' ')[1];

        // 2. 토큰 검증 (JWT_SECRET은 .env에 있어야 함)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // 3. 유저 정보 req에 담기
        req.user = decoded;
        next();
    } catch (error) {
        console.error('인증 에러:', error);
        return res.status(401).json(ApiResponse.error(401, '유효하지 않은 토큰입니다.'));
    }
};

// 🌟 중요: 반드시 내보내줘야 합니다!
module.exports = { authMiddleware };
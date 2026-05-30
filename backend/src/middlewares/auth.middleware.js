const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/api.response.util'); 

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.sendError(res, '인증 토큰이 없습니다.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ 인증 에러 상세:', error.message); 
        return ApiResponse.sendError(res, '유효하지 않은 토큰입니다.', 401);
    }
};

module.exports = { authMiddleware };
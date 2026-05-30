const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/api.response.util');

const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // no token provided — continue without setting req.user
            return next();
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        return next();
    } catch (error) {
        // If token invalid, just continue without user rather than blocking
        console.warn('optionalAuthMiddleware: invalid token, continuing without user');
        return next();
    }
};

module.exports = { optionalAuthMiddleware };

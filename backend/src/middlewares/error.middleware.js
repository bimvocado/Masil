const { AppError } = require('../utils/app-error.util');

const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null,
        });
    }

    return res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
        data: null,
    });
}

module.exports = errorHandler;
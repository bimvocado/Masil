class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundException extends AppError {
    constructor(message = '리소스를 찾을 수 없습니다.') {
        super(404, message);
    }
}

class BadRequestException extends AppError {
    constructor(message = '잘못된 요청입니다.') {
        super(400, message);
    }
}

module.exports = {
    AppError,
    NotFoundException,
    BadRequestException,
};
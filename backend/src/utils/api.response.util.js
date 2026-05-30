class ApiResponse {
  static success(status, message, data = null) {
    return {
      status,
      success: true,
      message,
      data,
    };
  }


  static error(status, message) {
    return {
      status,
      success: false,
      message,
      data: null,
    };
  }

  static send(res, data = null, message = 'Success', status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static sendError(res, message = 'Error', status = 500) {
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

module.exports = ApiResponse;
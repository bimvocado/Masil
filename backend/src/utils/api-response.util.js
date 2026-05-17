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
}

module.exports = ApiResponse;
export class ApiResponse {
  static success(res, message = 'Success', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Internal Server Error', code = 'SERVER_ERROR', statusCode = 500, details = null) {
    const response = {
      success: false,
      message,
      code
    };
    if (details) response.details = details;
    return res.status(statusCode).json(response);
  }
}

import { ApiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);

  if (err.name === 'CastError') {
    return ApiResponse.error(res, `Invalid resource identifier: ${err.value}`, 'INVALID_ID', 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponse.error(res, `Duplicate entry for ${field}`, 'DUPLICATE_KEY', 409);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return ApiResponse.error(res, 'Validation Error', 'VALIDATION_ERROR', 400, messages);
  }

  const statusCode = err.statusCode || 500;
  return ApiResponse.error(
    res,
    err.message || 'Internal Server Error',
    err.code || 'SERVER_ERROR',
    statusCode
  );
};

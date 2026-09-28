import { ApiResponse } from '../utils/apiResponse.js';

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Access denied. Admin authorization required.', 'FORBIDDEN', 403);
  }
  next();
};

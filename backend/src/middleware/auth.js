import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return ApiResponse.error(res, 'Authentication required. Please login.', 'UNAUTHORIZED', 401);
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(res, 'User no longer exists.', 'UNAUTHORIZED', 401);
    }

    if (user.status !== 'active') {
      return ApiResponse.error(res, `Account is ${user.status}. Please contact support.`, 'FORBIDDEN', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Access token expired', 'TOKEN_EXPIRED', 401);
    }
    return ApiResponse.error(res, 'Invalid authentication token', 'UNAUTHORIZED', 401);
  }
};

import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;
    const reqInfo = { ip: req.ip, userAgent: req.headers['user-agent'] };

    const { user, accessToken, refreshToken } = await AuthService.register({
      name,
      email,
      phone,
      password,
      referralCode,
      reqInfo
    });

    sendRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(
      res,
      'User registered successfully',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          referralCode: user.referralCode,
          kycStatus: user.kycStatus,
          balances: user.wallet,
          role: user.role
        },
        accessToken
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const reqInfo = { ip: req.ip, userAgent: req.headers['user-agent'] };

    const { user, accessToken, refreshToken } = await AuthService.login({
      identifier,
      password,
      reqInfo
    });

    sendRefreshTokenCookie(res, refreshToken);

    return ApiResponse.success(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus,
        balances: user.wallet,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const { user, accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);

    sendRefreshTokenCookie(res, newRefreshToken);

    return ApiResponse.success(res, 'Token refreshed successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    return ApiResponse.success(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    return ApiResponse.success(res, 'Authenticated user profile', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus,
        balances: user.wallet,
        role: user.role,
        memberSince: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

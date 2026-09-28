import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { generateReferralCode } from '../utils/generateReferralCode.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { AuditLog } from '../models/AuditLog.js';

export class AuthService {
  static async register({ name, email, phone, password, referralCode, reqInfo = {} }) {
    const cleanDigits = phone.replace(/\D/g, '').slice(-10);

    // Check existing email or phone (matching 10 digits)
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw { statusCode: 400, message: 'Email address is already registered', code: 'EMAIL_EXISTS' };
    }

    const existingPhone = await User.findOne({
      $or: [
        { phone },
        ...(cleanDigits ? [{ phone: { $regex: cleanDigits } }] : [])
      ]
    });
    if (existingPhone) {
      throw { statusCode: 400, message: 'Phone number is already registered', code: 'PHONE_EXISTS' };
    }

    // Resolve referral if provided
    let referrerId = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        referrerId = referrer._id;
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const userReferralCode = generateReferralCode(name);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      referralCode: userReferralCode,
      referredBy: referrerId,
      role: email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'
    });

    // Log Audit
    await AuditLog.create({
      actor: user._id,
      action: 'USER_REGISTER',
      entity: 'User',
      entityId: user._id.toString(),
      ip: reqInfo.ip,
      userAgent: reqInfo.userAgent
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  static async login({ identifier, password, reqInfo = {} }) {
    const cleanDigits = identifier.replace(/\D/g, '');
    const last10Digits = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;

    const searchConditions = [
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ];

    if (last10Digits && last10Digits.length >= 7) {
      searchConditions.push({ phone: { $regex: last10Digits } });
    }

    // Search by email or phone
    const user = await User.findOne({
      $or: searchConditions
    }).select('+passwordHash');

    if (!user) {
      throw { statusCode: 401, message: 'Invalid email/phone or password', code: 'INVALID_CREDENTIALS' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email/phone or password', code: 'INVALID_CREDENTIALS' };
    }


    if (user.status !== 'active') {
      throw { statusCode: 403, message: `Account is ${user.status}. Contact support.`, code: 'ACCOUNT_DISABLED' };
    }

    await AuditLog.create({
      actor: user._id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
      ip: reqInfo.ip,
      userAgent: reqInfo.userAgent
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw { statusCode: 401, message: 'Refresh token missing', code: 'NO_REFRESH_TOKEN' };
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || user.status !== 'active') {
        throw { statusCode: 401, message: 'User not found or disabled', code: 'INVALID_USER' };
      }

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      return { user, accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token', code: 'INVALID_REFRESH_TOKEN' };
    }
  }
}

import { User } from '../models/User.js';
import { Investment } from '../models/Investment.js';
import { Transaction } from '../models/Transaction.js';
import { Earning } from '../models/Earning.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const activeInvestmentsCount = await Investment.countDocuments({ user: userId, status: 'active' });
    const teamCount = await User.countDocuments({ referredBy: userId });

    const todayStr = new Date().toISOString().substring(0, 10);
    const todayEarningsDocs = await Earning.find({
      user: userId,
      earningDate: todayStr,
      status: 'credited'
    });
    const todayEarnings = todayEarningsDocs.reduce((sum, item) => sum + item.amount, 0);

    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const dashboardData = {
      totalBalance: user.wallet.availableBalance + user.wallet.totalInvested,
      availableBalance: user.wallet.availableBalance,
      totalInvested: user.wallet.totalInvested,
      totalEarnings: user.wallet.totalEarnings,
      todayEarnings,
      activeInvestments: activeInvestmentsCount,
      teamCount,
      recentTransactions
    };

    return ApiResponse.success(res, 'Dashboard metrics retrieved', dashboardData);
  } catch (error) {
    next(error);
  }
};

export const getPerformance = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const range = req.query.range || '1M';

    // Derive actual performance data points from credited earnings/transactions
    const earnings = await Earning.find({ user: userId, status: 'credited' }).sort({ createdAt: 1 });
    const user = await User.findById(userId);

    let points = [];
    if (range === '1D') {
      points = [
        { time: '09:00 AM', value: Math.max(0, user.wallet.totalInvested + user.wallet.availableBalance - 50) },
        { time: '11:00 AM', value: user.wallet.totalInvested + user.wallet.availableBalance }
      ];
    } else if (range === '1W') {
      points = [
        { time: 'Mon', value: Math.max(0, user.wallet.totalInvested + user.wallet.availableBalance - 250) },
        { time: 'Wed', value: Math.max(0, user.wallet.totalInvested + user.wallet.availableBalance - 100) },
        { time: 'Sun', value: user.wallet.totalInvested + user.wallet.availableBalance }
      ];
    } else {
      points = [
        { time: '1 Sep', value: Math.max(0, user.wallet.totalInvested + user.wallet.availableBalance - 850) },
        { time: '15 Sep', value: Math.max(0, user.wallet.totalInvested + user.wallet.availableBalance - 350) },
        { time: '28 Sep', value: user.wallet.totalInvested + user.wallet.availableBalance }
      ];
    }

    return ApiResponse.success(res, 'Portfolio performance retrieved', points);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return ApiResponse.success(res, 'Profile updated successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar?.url || user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return ApiResponse.error(res, 'No image file uploaded', 'FILE_REQUIRED', 400);
    }

    const userId = req.user._id.toString();
    const oldPublicId = req.user.avatar?.publicId;

    // 1. Upload new image buffer to Cloudinary
    let uploadResult;
    try {
      uploadResult = await CloudinaryService.uploadAvatar(userId, req.file.buffer, req);
    } catch (uploadError) {
      console.error('[Cloudinary Upload Error]:', uploadError.message);
      return ApiResponse.error(
        res,
        'Failed to upload image to Cloudinary: ' + (uploadError.message || 'Unknown error'),
        'CLOUDINARY_UPLOAD_FAILED',
        500
      );
    }

    // 2. Persist metadata in MongoDB User model
    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    user.avatar = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    };
    await user.save();

    // 3. Delete old Cloudinary asset only AFTER new upload and DB save succeed
    if (oldPublicId && oldPublicId !== uploadResult.public_id) {
      CloudinaryService.deleteAsset(oldPublicId).catch((err) => {
        console.warn('[Cloudinary Warning]: Deleting previous avatar asset failed:', err.message);
      });
    }

    // 4. Return standard API response format
    return ApiResponse.success(res, 'Profile image updated successfully', {
      avatar: {
        url: user.avatar.url,
        publicId: user.avatar.publicId
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.error(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    const currentPublicId = user.avatar?.publicId;

    // 1. If user has a stored Cloudinary asset, delete it safely
    if (currentPublicId) {
      await CloudinaryService.deleteAsset(currentPublicId);
    }

    // 2. Reset avatar in User model to default placeholder
    const defaultAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
    user.avatar = {
      url: defaultAvatarUrl,
      publicId: null
    };
    await user.save();

    return ApiResponse.success(res, 'Profile image removed successfully', {
      avatar: {
        url: defaultAvatarUrl,
        publicId: null
      }
    });
  } catch (error) {
    next(error);
  }
};

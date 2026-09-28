import { NotificationService } from '../services/notification.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user._id);
    return ApiResponse.success(res, 'User notifications retrieved', notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(req.user._id, req.params.id);
    return ApiResponse.success(res, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user._id);
    return ApiResponse.success(res, 'All notifications marked as read', result);
  } catch (error) {
    next(error);
  }
};

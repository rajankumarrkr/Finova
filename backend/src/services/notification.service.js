import { Notification } from '../models/Notification.js';

export class NotificationService {
  static async getUserNotifications(userId) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async markAsRead(userId, notificationId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }

  static async markAllAsRead(userId) {
    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    return { success: true };
  }
}

import { apiClient } from './apiClient';
import { Notification, NotificationSetting } from '../types/notification';

export const notificationService = {
  createNotification: async (notificationData: Partial<Notification>): Promise<any> => {
    const response = await apiClient.post('/notification', notificationData);
    return response.data;
  },

  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notification/get-notifications');
    return response.data.data;
  },

  markAllAsRead: async (): Promise<any> => {
    const response = await apiClient.put('/notification/mark-all-read');
    return response.data;
  },

  deleteNotification: async (notificationId: string): Promise<any> => {
    const response = await apiClient.delete('/notification/delete-notification', { params: { notification_id: notificationId } });
    return response.data;
  },

  getSetting: async (): Promise<NotificationSetting> => {
    const response = await apiClient.get('/notification/get-setting');
    return response.data.data;
  },

  updateSetting: async (settingData: Partial<NotificationSetting>): Promise<any> => {
    const response = await apiClient.post('/notification/create-setting', settingData);
    return response.data;
  },
};

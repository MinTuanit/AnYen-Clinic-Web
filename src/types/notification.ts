export interface Notification {
  notification_id: string;
  recipient_id: string;
  title: string;
  content: string;
  is_read: boolean;
  type?: string;
  createdAt: string;
}

export interface NotificationSetting {
  user_id: string;
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
}

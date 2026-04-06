export type NotificationType = "event-join" | "event-update";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};
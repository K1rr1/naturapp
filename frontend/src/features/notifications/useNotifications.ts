import { useState } from "react";
import type { NotificationItem, NotificationType } from "./notifications.types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
  };
}
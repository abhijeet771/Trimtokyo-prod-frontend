
import { useCallback, useEffect, useState } from "react";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notification.service.js";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications and unread count
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [notificationsRes, unreadCountRes] = await Promise.all([
        getMyNotifications(),
        getUnreadNotificationCount(),
      ]);

      const notificationData = notificationsRes?.data?.data;

      setNotifications(
        Array.isArray(notificationData) ? notificationData : []
      );

      setUnreadCount(
        Number(
          unreadCountRes?.data?.unreadCount ??
          unreadCountRes?.data?.count ??
          0
        )
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark one notification as read
  const markAsRead = useCallback(async (id) => {
    const notification = notifications.find((item) => item._id === id);

    if (!notification || notification.isRead) return;

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isRead: true } : item
      )
    );

    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationRead(id);
    } catch (err) {
      // Restore server state if the request fails
      await fetchNotifications();
      throw err;
    }
  }, [notifications, fetchNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const previousNotifications = notifications;
    const previousUnreadCount = unreadCount;

    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (err) {
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      throw err;
    }
  }, [notifications, unreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
};

export default useNotifications;

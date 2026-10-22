import apik from "./apik";

/* ============================================================
   NOTIFICATION APIs
============================================================ */

// Get current user's notifications
// Optional params: { unreadOnly: true, page: 1, limit: 50 }
export const getMyNotifications = (params = {}) =>
  apik.get("/api/notifications/my", { params });

// Get unread notification count
export const getUnreadNotificationCount = () =>
  apik.get("/api/notifications/unread-count");

// Mark a notification as read
export const markNotificationRead = (id) =>
  apik.patch(`/api/notifications/read/${id}`);

// Mark all current user's notifications as read
export const markAllNotificationsRead = () =>
  apik.patch("/api/notifications/read-all");

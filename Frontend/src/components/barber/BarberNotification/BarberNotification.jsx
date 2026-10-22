
import { useEffect } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  RefreshCw,
  ShoppingBag,
  X,
} from "lucide-react";

import useNotifications from "../../../hooks/useNotifications";
import "./BarberNotification.scss";

const BarberNotifications = ({ open, onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  // Refresh notifications whenever the panel opens.
  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  if (!open) return null;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isBookingNotification = (notification) => {
    const type = String(notification.type || "").toUpperCase();

    return (
      type.includes("SLOT_BOOKING") ||
      String(notification.referenceModel || "").toLowerCase() ===
        "slotbooking"
    );
  };

  return (
    <>
      <div
        className="notification-overlay"
        onClick={onClose}
      />

      <aside
        className="notification-panel"
        role="dialog"
        aria-label="Barber notifications"
      >
        <div className="notification-header">
          <div>
            <h3>Notifications</h3>
            <p>
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "You're all caught up"}
            </p>
          </div>

          <div className="notification-header-actions">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              aria-label="Refresh notifications"
              title="Refresh notifications"
            >
              <RefreshCw size={16} />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="notification-toolbar">
            <span>Recent activity</span>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
            >
              <Check size={14} />
              Mark all read
            </button>
          </div>
        )}

        <div className="notification-list">
          {loading && notifications.length === 0 ? (
            <div className="notification-empty">
              <p>Loading notifications...</p>
            </div>
          ) : error && notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={24} />
              <strong>Couldn't load notifications</strong>
              <p>{error}</p>
              <button type="button" onClick={refresh}>
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <Bell size={24} />
              <strong>No notifications yet</strong>
              <p>New order alerts will appear here.</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isBooking = isBookingNotification(notification);
              const isRead = notification.isRead;

              return (
                <button
                  type="button"
                  key={notification._id}
                  className={`notification-item ${
                    isRead ? "is-read" : "unread"
                  }`}
                  onClick={() => {
                    if (!isRead) {
                      handleMarkAsRead(notification._id);
                    }
                  }}
                >
                  <div
                    className={`notification-icon ${
                      isBooking ? "is-booking" : "is-order"
                    }`}
                  >
                    {isBooking ? (
                      <CalendarDays size={18} />
                    ) : (
                      <ShoppingBag size={18} />
                    )}
                  </div>

                  <div className="notification-content">
                    <h4>{notification.title || "Notification"}</h4>

                    <p>{notification.message}</p>

                    <span>{formatTime(notification.createdAt)}</span>
                  </div>

                  {!isRead && (
                    <span
                      className="notification-unread-dot"
                      aria-label="Unread"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="notification-footer">
          <span>Order notifications</span>
          <span className="notification-live-dot" />
        </div>
      </aside>
    </>
  );
};

export default BarberNotifications;

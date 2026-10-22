
import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  ShoppingBag,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import useNotifications from "../../../hooks/useNotifications";
import "./AdminTopbar.scss";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  users: "Users",
  approvals: "Approvals",
  slots: "Bookings & Slots",
  statistics: "Statistics",
  blogs: "Blogs",
  reels: "Reels",
  campaign: "Campaigns",
  cms: "Content Management",
  settings: "Settings",
};

const AdminTopbar = ({ activeTab }) => {
  const [homepageTheme, setHomepageTheme] = useState("green");
  const [themeLoading, setThemeLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  const pageTitle = PAGE_TITLES[activeTab] || "Dashboard";

  // Close the notification panel when clicking outside it.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  const formatNotificationTime = (date) => {
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

  const getNotificationIcon = (notification) => {
    const type = String(notification.type || "").toUpperCase();
    const referenceModel = String(
      notification.referenceModel || ""
    ).toLowerCase();

    if (
      referenceModel === "slotbooking" ||
      type.includes("SLOT_BOOKING")
    ) {
      return <CalendarDays size={18} />;
    }

    return <ShoppingBag size={18} />;
  };

  const getNotificationClass = (notification) => {
    const type = String(notification.type || "").toUpperCase();
    const referenceModel = String(
      notification.referenceModel || ""
    ).toLowerCase();

    return referenceModel === "slotbooking" ||
      type.includes("SLOT_BOOKING")
      ? "is-booking"
      : "is-order";
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__intro">
        <p className="admin-topbar__eyebrow">TRIMTOKYO ADMIN</p>
        <h1 className="admin-topbar__title">Welcome back, Admin!</h1>
        <p className="admin-topbar__subtitle">
          Here's what's happening with your platform today.
        </p>
      </div>

      <div className="admin-topbar__actions">
        <div className="admin-topbar__page">
          <span className="admin-topbar__page-dot" />
          <span>{pageTitle}</span>
        </div>

        <div className="admin-topbar__theme">
          <span className="admin-topbar__theme-label">
            Website theme
          </span>

          <div className="admin-topbar__theme-options">
            {[
              { value: "pink", label: "Pink theme", color: "#ec4899" },
              { value: "blue", label: "Blue theme", color: "#3b82f6" },
              { value: "green", label: "Green theme", color: "#7cfc00" },
            ].map((theme) => (
              <button
                key={theme.value}
                type="button"
                className={`admin-topbar__theme-button ${
                  homepageTheme === theme.value ? "is-active" : ""
                }`}
                style={{ "--theme-color": theme.color }}
                aria-label={theme.label}
                aria-pressed={homepageTheme === theme.value}
                disabled={themeLoading}
                onClick={() => {
                  // Connect to your existing theme-change handler.
                }}
              />
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div
          className="admin-topbar__notification-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className={`admin-topbar__notification-button ${
              notificationOpen ? "is-active" : ""
            }`}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={notificationOpen}
            onClick={() => {
              const opening = !notificationOpen;
              setNotificationOpen(opening);

              if (opening) {
                refresh();
              }
            }}
          >
            <Bell size={21} strokeWidth={1.8} />

            {unreadCount > 0 && (
              <span className="admin-topbar__notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div
              className="admin-notifications"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="admin-notifications__header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread notifications`
                      : "You're all caught up"}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-notifications__close"
                  aria-label="Close notifications"
                  onClick={() => setNotificationOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="admin-notifications__toolbar">
                <span>Recent activity</span>

                <div className="admin-notifications__toolbar-actions">
                  <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    aria-label="Refresh notifications"
                    title="Refresh notifications"
                  >
                    <RefreshCw size={14} />
                  </button>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                    >
                      <Check size={14} />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-notifications__list">
                {loading && notifications.length === 0 ? (
                  <div className="admin-notifications__empty">
                    <strong>Loading notifications...</strong>
                  </div>
                ) : error && notifications.length === 0 ? (
                  <div className="admin-notifications__empty">
                    <strong>Couldn't load notifications</strong>
                    <p>{error}</p>
                    <button type="button" onClick={refresh}>
                      Try again
                    </button>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="admin-notifications__empty">
                    <span className="admin-notifications__empty-icon">
                      <Bell size={24} />
                    </span>
                    <strong>No notifications yet</strong>
                    <p>New order alerts will appear here.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification._id}
                      className={`admin-notifications__item ${
                        notification.isRead ? "is-read" : "is-unread"
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification._id);
                        }
                      }}
                    >
                      <span
                        className={`admin-notifications__item-icon ${getNotificationClass(
                          notification
                        )}`}
                      >
                        {getNotificationIcon(notification)}
                      </span>

                      <span className="admin-notifications__item-content">
                        <strong>
                          {notification.title || "Notification"}
                        </strong>
                        <span>{notification.message}</span>
                        <small>
                          {formatNotificationTime(notification.createdAt)}
                        </small>
                      </span>

                      {!notification.isRead && (
                        <span className="admin-notifications__unread-dot" />
                      )}
                    </button>
                  ))
                )}
              </div>

              <div className="admin-notifications__footer">
                <span>Order alerts</span>
                <span className="admin-notifications__live-dot" />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="admin-topbar__logout"
          onClick={() => {
            // Connect to your existing logout function.
          }}
        >
          <span className="admin-topbar__logout-icon">↗</span>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;

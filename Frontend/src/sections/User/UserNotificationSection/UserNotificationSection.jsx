
import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Circle,
  CalendarCheck,
  ShoppingBag,
  Search,
  Inbox,
  RefreshCw,
} from "lucide-react";

import useNotifications from "../../../hooks/useNotifications";
import { NOTIFICATION_PAGE_SIZE } from "../../../constants/userNotificationConstants";

import "./UserNotificationSection.scss";

const getNotificationIcon = (notification) => {
  const type = String(notification.type || "").toUpperCase();
  const referenceModel = String(
    notification.referenceModel || ""
  ).toLowerCase();

  if (
    type.includes("SLOT_BOOKING") ||
    referenceModel === "slotbooking"
  ) {
    return CalendarCheck;
  }

  return ShoppingBag;
};

const formatNotificationDate = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserNotificationSection = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionError, setActionError] = useState("");

  // Counts based on notifications currently loaded.
  const readCount = notifications.filter(
    (notification) => notification.isRead
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...notifications]
      .filter((notification) => {
        if (activeFilter === "read" && !notification.isRead) {
          return false;
        }

        if (activeFilter === "unread" && notification.isRead) {
          return false;
        }

        if (!query) return true;

        return [
          notification._id,
          notification.title,
          notification.message,
          notification.type,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [notifications, activeFilter, searchQuery]);

  const pageSize = NOTIFICATION_PAGE_SIZE || 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedNotifications = filteredNotifications.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const startItem =
    filteredNotifications.length === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const endItem = Math.min(
    safePage * pageSize,
    filteredNotifications.length
  );

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleMarkAsRead = async (id) => {
    setActionError("");

    try {
      await markAsRead(id);
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update notification."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionError("");

    try {
      await markAllAsRead();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark notifications as read."
      );
    }
  };

  return (
    <section className="user-notification-section">
      <header className="user-notification-section__header">
        <div className="user-notification-section__heading">
          <div className="user-notification-section__heading-icon">
            <Bell size={23} />
          </div>

          <div>
            <h1>Notifications</h1>
            <p>
              Stay updated on your orders and account activity.
            </p>
          </div>
        </div>

        <div className="user-notification-section__header-actions">
          <button
            type="button"
            className="user-notification-section__refresh"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh notifications"
            title="Refresh notifications"
          >
            <RefreshCw size={17} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              className="user-notification-section__mark-all"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>
          )}
        </div>
      </header>

      {actionError && (
        <div
          className="user-notification-section__error"
          role="alert"
        >
          {actionError}
        </div>
      )}

      <div className="user-notification-section__kpis">
        <article className="user-notification-section__kpi">
          <div className="user-notification-section__kpi-icon user-notification-section__kpi-icon--read">
            <CheckCheck size={19} />
          </div>

          <div className="user-notification-section__kpi-content">
            <span>Read</span>
            <strong>{readCount}</strong>
          </div>
        </article>

        <article className="user-notification-section__kpi">
          <div className="user-notification-section__kpi-icon user-notification-section__kpi-icon--unread">
            <Bell size={19} />
          </div>

          <div className="user-notification-section__kpi-content">
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </article>
      </div>

      <div className="user-notification-section__toolbar">
        <div className="user-notification-section__filters">
          {[
            { value: "all", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
          ].map((filter) => (
            <button
              type="button"
              key={filter.value}
              className={`user-notification-section__filter ${
                activeFilter === filter.value
                  ? "user-notification-section__filter--active"
                  : ""
              }`}
              onClick={() => handleFilterChange(filter.value)}
            >
              {filter.label}

              {filter.value === "unread" && unreadCount > 0 && (
                <span className="user-notification-section__filter-count">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <label className="user-notification-section__search">
          <Search size={17} />

          <input
            type="search"
            value={searchQuery}
            placeholder="Search notifications..."
            onChange={(event) =>
              handleSearchChange(event.target.value)
            }
          />
        </label>
      </div>

      <div className="user-notification-section__list">
        {loading && notifications.length === 0 ? (
          <div className="user-notification-section__empty">
            <div className="user-notification-section__empty-icon">
              <Bell size={27} />
            </div>
            <h3>Loading notifications...</h3>
            <p>Please wait while we retrieve your notifications.</p>
          </div>
        ) : error && notifications.length === 0 ? (
          <div className="user-notification-section__empty">
            <div className="user-notification-section__empty-icon">
              <Inbox size={27} />
            </div>
            <h3>Couldn't load notifications</h3>
            <p>{error}</p>
            <button
              type="button"
              className="user-notification-section__mark-all"
              onClick={refresh}
            >
              Try again
            </button>
          </div>
        ) : paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification) => {
            const NotificationIcon = getNotificationIcon(notification);

            return (
              <article
                key={notification._id}
                className={`user-notification-section__item ${
                  !notification.isRead
                    ? "user-notification-section__item--unread"
                    : ""
                }`}
              >
                <div className="user-notification-section__item-icon">
                  <NotificationIcon size={20} />
                </div>

                <div className="user-notification-section__item-content">
                  <div className="user-notification-section__item-title-row">
                    <h3>{notification.title || "Notification"}</h3>

                    {!notification.isRead && (
                      <span className="user-notification-section__unread-label">
                        New
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="user-notification-section__item-meta">
                    <span>
                      {String(notification.type || "")
                        .replaceAll("_", " ")
                        .toLowerCase()}
                    </span>

                    <span className="user-notification-section__meta-dot">
                      ·
                    </span>

                    <span>
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="user-notification-section__item-actions">
                  <span
                    className={`user-notification-section__read-status ${
                      notification.isRead
                        ? "user-notification-section__read-status--read"
                        : "user-notification-section__read-status--unread"
                    }`}
                  >
                    <Circle size={8} fill="currentColor" />
                    {notification.isRead ? "Read" : "Unread"}
                  </span>

                  {!notification.isRead && (
                    <button
                      type="button"
                      className="user-notification-section__read-button"
                      onClick={() => handleMarkAsRead(notification._id)}
                      aria-label={`Mark ${notification.title || "notification"} as read`}
                      title="Mark as read"
                    >
                      <Check size={17} />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="user-notification-section__empty">
            <div className="user-notification-section__empty-icon">
              <Inbox size={27} />
            </div>

            <h3>No notifications found</h3>
            <p>
              {searchQuery
                ? "Try another search term."
                : "There are no notifications in this category."}
            </p>
          </div>
        )}
      </div>

      <footer className="user-notification-section__pagination">
        <span className="user-notification-section__pagination-info">
          Showing {startItem}–{endItem} of {filteredNotifications.length}
        </span>

        <div className="user-notification-section__pagination-controls">
          <button
            type="button"
            className="user-notification-section__page-arrow"
            disabled={safePage <= 1}
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                className={`user-notification-section__page-number ${
                  safePage === page
                    ? "user-notification-section__page-number--active"
                    : ""
                }`}
                onClick={() => setCurrentPage(page)}
                aria-current={safePage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            className="user-notification-section__page-arrow"
            disabled={safePage >= totalPages}
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default UserNotificationSection;

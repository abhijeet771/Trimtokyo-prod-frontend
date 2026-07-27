import {  Bell,  CheckCircle2,  Clock3,} from "lucide-react";
import "./NotificationItem.scss";

const NotificationItem = ({  notification,  onRead,}) => {

  const formattedDate =
    notification?.createdAt
      ? new Date(
          notification.createdAt
        ).toLocaleString()
      : "N/A";

  return (
    <div
      className={`notification-item ${
        notification.isRead
          ? "read"
          : "unread"
      }`}
      onClick={() =>
        onRead(notification._id)
      }
    >

      {/* ================= ICON ================= */}

      <div className="notification-item__icon">

        {notification.isRead ? (
          <CheckCircle2 size={22} />
        ) : (
          <Bell size={22} />
        )}

      </div>

      {/* ================= CONTENT ================= */}

      <div className="notification-item__content">

        <p>
          {notification.message}
        </p>

        <div className="notification-item__meta">

          <div className="notification-item__time">

            <Clock3 size={14} />

            <span>
              {formattedDate}
            </span>

          </div>

          {!notification.isRead && (
            <span className="notification-item__badge">
              New
            </span>
          )}

        </div>

      </div>

    </div>
  );
};

export default NotificationItem;
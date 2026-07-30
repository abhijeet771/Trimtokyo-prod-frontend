import {  Bell,  CalendarDays,  ShoppingBag,  Star,  X,} from "lucide-react";

import "./BarberNotification.scss";

const notifications = [
  {
    id: 1,
    icon: <ShoppingBag size={18} />,
    title: "New Booking",
    message:
      "Rahul Sharma booked a Haircut at 4:00 PM.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: <CalendarDays size={18} />,
    title: "Appointment Updated",
    message:
      "Your 5:30 PM booking has been rescheduled.",
    time: "25 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: <Star size={18} />,
    title: "New Review",
    message:
      "You received a new 5-star review.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    icon: <Bell size={18} />,
    title: "Reminder",
    message:
      "You have 6 appointments today.",
    time: "Today",
    unread: false,
  },
];

const BarberNotifications = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <>
      <div
        className="notification-overlay"
        onClick={onClose}
      />

      <aside className="notification-panel">
        <div className="notification-header">
          <h3>Notifications</h3>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="notification-list">
          {notifications.map(
            (notification) => (
              <div
                key={
                  notification.id
                }
                className={`notification-item ${
                  notification.unread
                    ? "unread"
                    : ""
                }`}
              >
                <div className="notification-icon">
                  {
                    notification.icon
                  }
                </div>

                <div className="notification-content">
                  <h4>
                    {
                      notification.title
                    }
                  </h4>

                  <p>
                    {
                      notification.message
                    }
                  </p>

                  <span>
                    {
                      notification.time
                    }
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </aside>
    </>
  );
};

export default BarberNotifications;

import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Phone,
  User,
  BadgeCheck,
} from "lucide-react";

import { updateOrderStatus } from "../../../services/api";
import "./BarberOrderCard.scss";

const BarberOrderCard = ({ order, readOnly = false }) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status) => {
    try {
      setLoading(true);
      await updateOrderStatus(order._id, status);
      setCurrentStatus(status);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setLoading(false);
    }
  };

  let formattedTime = "Immediate";

  if (order.scheduledAt) {
    const dateObj = new Date(order.scheduledAt);

    if (!Number.isNaN(dateObj.getTime())) {
      formattedTime = dateObj.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  }

  const isAutoConfirmed = currentStatus === "CONFIRMED";
  const address = order.deliveryAddress || {};

  return (
    <div
      className={`barber-order-card ${
        readOnly ? "barber-order-card--compact" : ""
      }`}
    >
      <div className="order-header">
        <div className="order-header__left">
          <h3>Order #{String(order._id).slice(-6)}</h3>

          <div className="customer">
            <User size={15} />
            <span>{order.userId?.name || "Customer"}</span>
          </div>
        </div>

        <div className="order-header__right">
          <span className={`status ${currentStatus.toLowerCase()}`}>
            {currentStatus.replace(/_/g, " ")}
          </span>

          {isAutoConfirmed && (
            <span className="auto-badge">
              <BadgeCheck size={13} />
              Auto
            </span>
          )}
        </div>
      </div>

      <div className="order-info">
        <div className="info-item">
          <CalendarDays size={16} />
          <div>
            <small>Scheduled</small>
            <p>{formattedTime}</p>
          </div>
        </div>

        <div className="info-item">
          <Phone size={16} />
          <div>
            <small>Phone</small>
            <p>{address.phone || "—"}</p>
          </div>
        </div>
      </div>

      <div className="card-section">
        <h4>Services</h4>

        <div className="services-list">
          {(order.services || []).map((service, index) => (
            <div
              key={service.serviceId || index}
              className="service-row"
            >
              <div>
                <h5>{service.title || "Service"}</h5>
                <span>Qty: {service.quantity || 0}</span>
              </div>

              <strong>
                ₹
                {(
                  Number(service.price || 0) *
                  Number(service.quantity || 0)
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          {(!order.services || order.services.length === 0) && (
            <p className="no-services">No service details available.</p>
          )}
        </div>
      </div>

      <div className="card-section address-card">
        <h4>Delivery Address</h4>

        <div className="address-item">
          <User size={15} />
          <span>{address.fullName || "—"}</span>
        </div>

        <div className="address-item">
          <Phone size={15} />
          <span>{address.phone || "—"}</span>
        </div>

        <div className="address-item address-full">
          <MapPin size={15} />
          <span>
            {[
              address.addressLine,
              address.city,
              address.state,
              address.pincode,
            ]
              .filter(Boolean)
              .join(", ") || "Address not provided"}
          </span>
        </div>
      </div>

      <div className="order-total">
        <span>Total Amount</span>
        <h2>
          ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
        </h2>
      </div>

      {!readOnly && (
        <>
          {currentStatus === "PENDING" && (
            <div className="order-actions">
              <button
                className="btn btn-danger"
                disabled={loading}
                onClick={() => handleStatusUpdate("CANCELLED")}
              >
                {loading ? "Processing..." : "Reject"}
              </button>

              <button
                className="btn btn-success"
                disabled={loading}
                onClick={() => handleStatusUpdate("CONFIRMED")}
              >
                {loading ? "Processing..." : "Accept"}
              </button>
            </div>
          )}

          {currentStatus === "CONFIRMED" && (
            <div className="order-actions">
              <button
                className="btn btn-primary full-width"
                disabled={loading}
                onClick={() => handleStatusUpdate("IN_PROGRESS")}
              >
                {loading ? "Starting..." : "Start Service"}
              </button>
            </div>
          )}

          {currentStatus === "IN_PROGRESS" && (
            <div className="order-actions">
              <button
                className="btn btn-success full-width"
                disabled={loading}
                onClick={() => handleStatusUpdate("COMPLETED")}
              >
                {loading ? "Completing..." : "Mark Completed"}
              </button>
            </div>
          )}

          {currentStatus === "COMPLETED" && (
            <div className="completed-banner">
              This order has been completed.
            </div>
          )}

          {currentStatus === "CANCELLED" && (
            <div className="cancelled-banner">
              This order has been cancelled.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BarberOrderCard;

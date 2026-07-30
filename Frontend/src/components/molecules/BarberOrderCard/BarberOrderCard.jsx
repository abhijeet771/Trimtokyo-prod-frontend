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

const BarberOrderCard = ({ order }) => {
  const [currentStatus, setCurrentStatus] =
    useState(order.status);

  const [loading, setLoading] =
    useState(false);

  const handleStatusUpdate = async (
    status
  ) => {
    try {
      setLoading(true);

      await updateOrderStatus(
        order._id,
        status
      );

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

  /* ------------------------------------------------------ */
  /*                  DATE FORMATTER                        */
  /* ------------------------------------------------------ */

  let formattedTime = "Immediate";

  if (order.scheduledAt) {
    const dateObj = new Date(
      order.scheduledAt
    );

    if (!isNaN(dateObj.getTime())) {
      formattedTime =
        dateObj.toLocaleString();
    }
  }

  /* ------------------------------------------------------ */
  /*                 AUTO CONFIRM                           */
  /* ------------------------------------------------------ */

  const isAutoConfirmed =
    order.status === "CONFIRMED";

  return (
    <div className="barber-order-card">
      {/* ================= HEADER ================= */}

      <div className="order-header">
        <div className="order-header__left">
          <h3>
            Order #
            {order._id.slice(-6)}
          </h3>

          <div className="customer">
            <User size={16} />

            <span>
              {order.userId?.name ||
                "Customer"}
            </span>
          </div>
        </div>

        <div className="order-header__right">
          <span
            className={`status ${currentStatus.toLowerCase()}`}
          >
            {currentStatus.replace(
              "_",
              " "
            )}
          </span>

          {isAutoConfirmed && (
            <span className="auto-badge">
              <BadgeCheck size={14} />
              Auto
            </span>
          )}
        </div>
      </div>

      {/* ================= ORDER INFO ================= */}

      <div className="order-info">
        <div className="info-item">
          <CalendarDays size={17} />

          <div>
            <small>Scheduled</small>

            <p>{formattedTime}</p>
          </div>
        </div>

        <div className="info-item">
          <Phone size={17} />

          <div>
            <small>Phone</small>

            <p>
              {order.deliveryAddress
                ?.phone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= SERVICES ================= */}

      <div className="card-section">
        <h4>Services</h4>

        <div className="services-list">
          {order.services.map(
            (service) => (
              <div
                key={service.serviceId}
                className="service-row"
              >
                <div>
                  <h5>
                    {service.title}
                  </h5>

                  <span>
                    Qty :
                    {" "}
                    {
                      service.quantity
                    }
                  </span>
                </div>

                <strong>
                  ₹
                  {service.price *
                    service.quantity}
                </strong>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================= DELIVERY ================= */}

      <div className="card-section address-card">
        <h4>Delivery Address</h4>

        <div className="address-item">
          <User size={17} />

          <span>
            {
              order
                .deliveryAddress
                ?.fullName
            }
          </span>
        </div>

        <div className="address-item">
          <Phone size={17} />

          <span>
            {
              order
                .deliveryAddress
                ?.phone
            }
          </span>
        </div>

        <div className="address-item address-full">
          <MapPin size={17} />

          <span>
            {
              order
                .deliveryAddress
                ?.addressLine
            }
            ,{" "}
            {
              order
                .deliveryAddress
                ?.city
            }
            ,{" "}
            {
              order
                .deliveryAddress
                ?.state
            }{" "}
            -{" "}
            {
              order
                .deliveryAddress
                ?.pincode
            }
          </span>
        </div>
      </div>

      {/* ================= TOTAL ================= */}

      <div className="order-total">
        <span>Total Amount</span>

        <h2>
          ₹{order.totalAmount}
        </h2>
      </div>
      {/* ================= ACTIONS ================= */}

      {currentStatus === "PENDING" && (
        <div className="order-actions">
          <button
            className="btn btn-danger"
            disabled={loading}
            onClick={() =>
              handleStatusUpdate(
                "CANCELLED"
              )
            }
          >
            {loading
              ? "Processing..."
              : "Reject"}
          </button>

          <button
            className="btn btn-success"
            disabled={loading}
            onClick={() =>
              handleStatusUpdate(
                "CONFIRMED"
              )
            }
          >
            {loading
              ? "Processing..."
              : "Accept"}
          </button>
        </div>
      )}

      {currentStatus ===
        "CONFIRMED" && (
        <div className="order-actions">
          <button
            className="btn btn-primary full-width"
            disabled={loading}
            onClick={() =>
              handleStatusUpdate(
                "IN_PROGRESS"
              )
            }
          >
            {loading
              ? "Starting..."
              : "Start Service"}
          </button>
        </div>
      )}

      {currentStatus ===
        "IN_PROGRESS" && (
        <div className="order-actions">
          <button
            className="btn btn-success full-width"
            disabled={loading}
            onClick={() =>
              handleStatusUpdate(
                "COMPLETED"
              )
            }
          >
            {loading
              ? "Completing..."
              : "Mark Completed"}
          </button>
        </div>
      )}

      {currentStatus ===
        "COMPLETED" && (
        <div className="completed-banner">
          ✅ This order has been
          completed.
        </div>
      )}

      {currentStatus ===
        "CANCELLED" && (
        <div className="cancelled-banner">
          ❌ This order has been
          cancelled.
        </div>
      )}
    </div>
  );
};

export default BarberOrderCard;
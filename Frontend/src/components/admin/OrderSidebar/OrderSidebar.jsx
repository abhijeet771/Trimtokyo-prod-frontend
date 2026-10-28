import React, { useEffect } from "react";
import {
  X,
  ShoppingBag,
  UserRound,
  Scissors,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock3,
  CreditCard,
  IndianRupee,
  Hash,
  CheckCircle2,
  CircleDot,
  PackageCheck,
} from "lucide-react";

import "./OrderSidebar.scss";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "pending",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "confirmed",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "in-progress",
  },
  COMPLETED: {
    label: "Completed",
    className: "completed",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "cancelled",
  },
};

const formatCurrency = (amount) => {
  if (amount == null || !Number.isFinite(Number(amount))) {
    return "N/A";
  }

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (minutes) => {
  if (minutes == null || !Number.isFinite(Number(minutes))) {
    return "N/A";
  }

  const totalMinutes = Number(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours && remainingMinutes) {
    return `${hours} hr ${remainingMinutes} mins`;
  }

  if (hours) {
    return `${hours} hr`;
  }

  return `${remainingMinutes} mins`;
};

const getStatus = (status) => {
  return (
    STATUS_CONFIG[status] || {
      label: status || "Unknown",
      className: "unknown",
    }
  );
};

const getCustomerName = (order) => {
  return (
    order?.userId?.name ||
    order?.userId?.fullName ||
    order?.deliveryAddress?.fullName ||
    order?.userName ||
    "Customer"
  );
};

const getBarberName = (order) => {
  return (
    order?.barberName ||
    order?.barberId?.userId?.name ||
    order?.barberId?.userId?.fullName ||
    order?.barberId?.name ||
    "Barber"
  );
};

const OrderSidebar = ({ order, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) {
    return null;
  }

  const orderId = order.orderId || order._id;
  const status = getStatus(order.status);

  const services = Array.isArray(order.services)
    ? order.services
    : [];

  const address = order.deliveryAddress || {};

  const scheduledAt = order.scheduledAt;
  const isScheduled =
    order.isScheduled === true;

  const paymentMethod =
    order.paymentMethod === "COD"
      ? "Cash on Delivery (COD)"
      : order.paymentMethod || "N/A";

  const paymentStatus =
    order.paymentStatus || "N/A";

  const customerPhone =
    address.phone || order.phone || "";

  const customerEmail =
    order.userId?.email || order.email || "";

  const customerLocation =
    order.customerLocation;

  const barberLocation =
    order.barberLocation;

  return (
    <div
      className="order-sidebar-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <aside
        className="order-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-sidebar-title"
      >
        <header className="order-sidebar__header">
          <div className="order-sidebar__header-title">
            <span className="order-sidebar__header-icon">
              <ShoppingBag size={21} />
            </span>

            <div>
              <h2 id="order-sidebar-title">
                Order Details
              </h2>
              <p>Review the complete order information</p>
            </div>
          </div>

          <button
            type="button"
            className="order-sidebar__close"
            onClick={onClose}
            aria-label="Close order details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="order-sidebar__content">
          <section className="order-detail-hero">
            <div className="order-detail-hero__top">
              <div className="order-detail-hero__id">
                <span>ORDER ID</span>
                <strong title={String(orderId || "")}>
                  <Hash size={15} />
                  {orderId
                    ? String(orderId).slice(-8).toUpperCase()
                    : "N/A"}
                </strong>
              </div>

              <span
                className={`order-status order-status--${status.className}`}
              >
                <span className="order-status__dot" />
                {status.label}
              </span>
            </div>

            <div className="order-detail-hero__amount">
              <span>Total amount</span>
              <strong>
                <IndianRupee size={23} />
                {order.totalAmount != null
                  ? Number(order.totalAmount).toLocaleString(
                      "en-IN"
                    )
                  : order.amount != null
                    ? Number(order.amount).toLocaleString(
                        "en-IN"
                      )
                    : "N/A"}
              </strong>
            </div>

            <div className="order-detail-hero__created">
              <CalendarDays size={15} />
              <span>
                Placed {formatDateTime(order.createdAt)}
              </span>
            </div>
          </section>

          <section className="order-detail-section">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--blue">
                <UserRound size={17} />
              </span>
              <h3>Customer</h3>
            </div>

            <div className="order-person-card">
              <div className="order-person-card__avatar order-person-card__avatar--customer">
                <UserRound size={23} />
              </div>

              <div className="order-person-card__info">
                <strong>{getCustomerName(order)}</strong>

                {customerEmail && (
                  <a href={`mailto:${customerEmail}`}>
                    <Mail size={14} />
                    <span>{customerEmail}</span>
                  </a>
                )}

                {customerPhone && (
                  <a href={`tel:${customerPhone}`}>
                    <Phone size={14} />
                    <span>{customerPhone}</span>
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="order-detail-section">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--lavender">
                <Scissors size={17} />
              </span>
              <h3>Barber</h3>
            </div>

            <div className="order-person-card">
              <div className="order-person-card__avatar order-person-card__avatar--barber">
                <Scissors size={22} />
              </div>

              <div className="order-person-card__info">
                <strong>{getBarberName(order)}</strong>
                <span className="order-person-card__subtext">
                  Assigned barber
                </span>
              </div>
            </div>
          </section>

          <section className="order-detail-section">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--orange">
                <PackageCheck size={17} />
              </span>

              <h3>Services</h3>

              <span className="order-detail-section__count">
                {services.length}
              </span>
            </div>

            {services.length > 0 ? (
              <div className="order-service-list">
                {services.map((service, index) => {
                  const quantity = Number(service.quantity || 1);
                  const price = Number(service.price || 0);
                  const lineTotal = price * quantity;

                  return (
                    <article
                      className="order-service-item"
                      key={
                        service.serviceId ||
                        service.title ||
                        index
                      }
                    >
                      <span className="order-service-item__icon">
                        <Scissors size={19} />
                      </span>

                      <div className="order-service-item__details">
                        <strong>
                          {service.title || "Service"}
                        </strong>

                        <span>
                          {quantity} × {formatCurrency(price)}
                        </span>

                        {service.duration != null && (
                          <small>
                            <Clock3 size={12} />
                            {formatDuration(
                              Number(service.duration) *
                                quantity
                            )}
                          </small>
                        )}
                      </div>

                      <strong className="order-service-item__price">
                        {formatCurrency(lineTotal)}
                      </strong>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="order-sidebar__empty">
                No service details available.
              </p>
            )}
          </section>

          <section className="order-detail-section">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--green">
                <CreditCard size={17} />
              </span>
              <h3>Payment Summary</h3>
            </div>

            <div className="order-summary">
              <div className="order-summary__row">
                <span>Services subtotal</span>
                <strong>
                  {formatCurrency(
                    order.totalAmount ?? order.amount
                  )}
                </strong>
              </div>

              <div className="order-summary__row">
                <span>Payment method</span>
                <strong>{paymentMethod}</strong>
              </div>

              <div className="order-summary__row">
                <span>Payment status</span>
                <span
                  className={`order-payment-status order-payment-status--${String(
                    paymentStatus
                  ).toLowerCase()}`}
                >
                  {paymentStatus}
                </span>
              </div>

              <div className="order-summary__total">
                <span>Total amount</span>
                <strong>
                  {formatCurrency(
                    order.totalAmount ?? order.amount
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="order-detail-section">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--blue">
                <CalendarDays size={17} />
              </span>
              <h3>Schedule</h3>
            </div>

            <div className="order-info-card">
              <div className="order-info-card__row">
                <CalendarDays size={17} />
                <div>
                  <span>Appointment date</span>
                  <strong>{formatDate(scheduledAt)}</strong>
                </div>
              </div>

              <div className="order-info-card__row">
                <Clock3 size={17} />
                <div>
                  <span>Appointment time</span>
                  <strong>{formatTime(scheduledAt)}</strong>
                </div>
              </div>

              <div className="order-info-card__row">
                <CircleDot size={17} />
                <div>
                  <span>Booking type</span>
                  <strong>
                    {isScheduled ? "Scheduled" : "Immediate"}
                  </strong>
                </div>
              </div>

              <div className="order-info-card__row">
                <Clock3 size={17} />
                <div>
                  <span>Estimated duration</span>
                  <strong>
                    {formatDuration(order.totalDuration)}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="order-detail-section">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--orange">
                <MapPin size={17} />
              </span>
              <h3>Delivery Address</h3>
            </div>

            <div className="order-address">
              <MapPin size={19} />

              <div>
                <strong>
                  {address.fullName || getCustomerName(order)}
                </strong>

                <p>
                  {[
                    address.addressLine,
                    address.city,
                    address.state,
                    address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Address not available"}
                </p>

                {address.phone && (
                  <span>{address.phone}</span>
                )}
              </div>
            </div>
          </section>

          {(customerLocation || barberLocation) && (
            <section className="order-detail-section">
              <div className="order-detail-section__heading">
                <span className="order-detail-section__icon order-detail-section__icon--green">
                  <MapPin size={17} />
                </span>
                <h3>Location Coordinates</h3>
              </div>

              <div className="order-coordinates">
                {customerLocation && (
                  <div>
                    <span>Customer</span>
                    <strong>
                      {customerLocation.lat}, {customerLocation.lng}
                    </strong>
                  </div>
                )}

                {barberLocation && (
                  <div>
                    <span>Barber</span>
                    <strong>
                      {barberLocation.lat}, {barberLocation.lng}
                    </strong>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="order-detail-section order-detail-section--last">
            <div className="order-detail-section__heading">
              <span className="order-detail-section__icon order-detail-section__icon--green">
                <CheckCircle2 size={17} />
              </span>
              <h3>Order Timeline</h3>
            </div>

            <div className="order-timeline">
              <div className="order-timeline__item order-timeline__item--active">
                <span className="order-timeline__marker" />
                <div>
                  <strong>Order created</strong>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
              </div>

              <div
                className={`order-timeline__item ${
                  order.status === "CONFIRMED" ||
                  order.status === "IN_PROGRESS" ||
                  order.status === "COMPLETED"
                    ? "order-timeline__item--active"
                    : ""
                }`}
              >
                <span className="order-timeline__marker" />
                <div>
                  <strong>{status.label}</strong>
                  <span>
                    Current order status
                  </span>
                </div>
              </div>
            </div>

            <p className="order-sidebar__note">
              Detailed status history is not available from the
              current admin orders API.
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default OrderSidebar;

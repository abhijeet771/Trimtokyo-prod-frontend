import React, { useEffect } from "react";
import {
  X,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  UserRound,
  Receipt,
  CreditCard,
  CheckCircle2,
  CircleX,
  Scissors,
  Hash,
  IndianRupee,
} from "lucide-react";

import "./ViewOrderDialog.scss";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatStatus = (value) => {
  if (!value) return "Unknown";

  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (
    ["completed", "delivered", "paid"].includes(normalized)
  ) {
    return "success";
  }

  if (
    ["cancelled", "canceled", "failed", "rejected"].includes(
      normalized
    )
  ) {
    return "danger";
  }

  if (
    ["pending", "processing", "ongoing", "in progress"].includes(
      normalized
    )
  ) {
    return "warning";
  }

  if (
    ["confirmed", "accepted"].includes(normalized)
  ) {
    return "info";
  }

  return "neutral";
};

const getServiceDetails = (item, index) => {
  const service =
    item?.serviceId && typeof item.serviceId === "object"
      ? item.serviceId
      : item?.service && typeof item.service === "object"
        ? item.service
        : {};

  const serviceName =
    item?.title ||
    item?.serviceName ||
    item?.name ||
    service?.title ||
    service?.serviceName ||
    service?.name ||
    (typeof item?.service === "string" ? item.service : "") ||
    (typeof item?.serviceId === "string" ? "Service" : "") ||
    `Service ${index + 1}`;

  const quantity = Math.max(
    1,
    Number(item?.quantity) || 1
  );

  const unitPrice = Number(
    item?.price ??
      item?.unitPrice ??
      service?.price ??
      0
  );

  const totalPrice = Number(
    item?.totalPrice ??
      item?.subtotal ??
      unitPrice * quantity
  );

  const duration = Number(
    item?.duration ??
      item?.durationMinutes ??
      service?.duration ??
      service?.durationMinutes ??
      0
  );

  return {
    id: item?._id || item?.serviceId?._id || index,
    name: serviceName,
    quantity,
    unitPrice,
    totalPrice,
    duration,
  };
};

const getAddress = (address) => {
  if (!address) return "";

  if (typeof address === "string") return address;

  if (typeof address !== "object") return "";

  return [
    address.fullName,
    address.addressLine1,
    address.addressLine2,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.postalCode || address.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const getLocationText = (location) => {
  if (!location) return "";

  if (typeof location === "string") return location;

  if (typeof location !== "object") return "";

  if (location.address) return location.address;

  if (location.formattedAddress) {
    return location.formattedAddress;
  }

  const coordinates = location.coordinates;

  if (
    Array.isArray(coordinates) &&
    coordinates.length >= 2
  ) {
    return `${coordinates[1]}, ${coordinates[0]}`;
  }

  if (
    location.latitude != null &&
    location.longitude != null
  ) {
    return `${location.latitude}, ${location.longitude}`;
  }

  if (location.lat != null && location.lng != null) {
    return `${location.lat}, ${location.lng}`;
  }

  return "";
};

const ViewOrderDialog = ({ order, onClose }) => {
  useEffect(() => {
    if (!order) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [order, onClose]);

  if (!order) return null;

  const orderId = order._id || order.orderId || "";
  const status = order.status || "Unknown";
  const paymentStatus = order.paymentStatus || "Pending";
  const paymentMethod = order.paymentMethod || "Not specified";

  const scheduledAt = order.scheduledAt || order.scheduledDate;
  const isScheduled =
    order.isScheduled ?? Boolean(scheduledAt);

  const services = Array.isArray(order.services)
    ? order.services.map(getServiceDetails)
    : [];

  const barber =
    order.barberId && typeof order.barberId === "object"
      ? order.barberId
      : order.barber && typeof order.barber === "object"
        ? order.barber
        : {};

  const staff =
    order.staffId && typeof order.staffId === "object"
      ? order.staffId
      : order.staff && typeof order.staff === "object"
        ? order.staff
        : {};

  const salonName =
    order.salonName ||
    order.shopName ||
    order.shop?.name ||
    barber.shopName ||
    barber.salonName ||
    barber.name ||
    "Selected salon";

  const barberName =
    barber.name ||
    barber.fullName ||
    barber.displayName ||
    "Not specified";

  const staffName =
    staff.name ||
    staff.fullName ||
    staff.displayName ||
    "";

  const deliveryAddress = getAddress(order.deliveryAddress);

  const customerLocation = getLocationText(
    order.customerLocation
  );

  const barberLocation = getLocationText(
    order.barberLocation
  );

  const totalDuration = Number(order.totalDuration) || 0;

  const totalAmount = Number(
    order.totalAmount ??
      services.reduce((sum, service) => sum + service.totalPrice, 0)
  );

  const createdAt = order.createdAt || order.createdOn;

  return (
    <div
      className="view-order-dialog__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="view-order-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-order-dialog-title"
      >
        <header className="view-order-dialog__header">
          <div className="view-order-dialog__heading">
            <span className="view-order-dialog__eyebrow">
              ORDER DETAILS
            </span>

            <h2 id="view-order-dialog-title">
              Your booking
            </h2>

            <p>
              Review your order, services and appointment details.
            </p>
          </div>

          <button
            type="button"
            className="view-order-dialog__close"
            onClick={onClose}
            aria-label="Close order details"
          >
            <X size={21} />
          </button>
        </header>

        <div className="view-order-dialog__body">
          <section className="view-order-dialog__order-banner">
            <div className="view-order-dialog__order-reference">
              <span className="view-order-dialog__icon-box">
                <Receipt size={21} />
              </span>

              <div>
                <span className="view-order-dialog__muted">
                  Order reference
                </span>

                <strong>
                  {orderId
                    ? `#${String(orderId).slice(-10).toUpperCase()}`
                    : "Not available"}
                </strong>

                {createdAt && (
                  <span className="view-order-dialog__muted">
                    Placed on {formatDate(createdAt)}
                  </span>
                )}
              </div>
            </div>

            <span
              className={`view-order-dialog__status view-order-dialog__status--${getStatusClass(
                status
              )}`}
            >
              {formatStatus(status)}
            </span>
          </section>

          <div className="view-order-dialog__grid">
            <section className="view-order-dialog__card">
              <div className="view-order-dialog__section-title">
                <CalendarDays size={19} />
                <h3>Appointment</h3>
              </div>

              <div className="view-order-dialog__detail">
                <span>Date</span>
                <strong>
                  {isScheduled
                    ? formatDate(scheduledAt)
                    : "Not scheduled"}
                </strong>
              </div>

              <div className="view-order-dialog__detail">
                <span>Time</span>
                <strong>
                  {isScheduled
                    ? formatTime(scheduledAt)
                    : "To be confirmed"}
                </strong>
              </div>

              <div className="view-order-dialog__detail">
                <span>Booking type</span>
                <strong>
                  {isScheduled ? "Scheduled" : "Unscheduled"}
                </strong>
              </div>

              <div className="view-order-dialog__detail">
                <span>Estimated duration</span>
                <strong>
                  {totalDuration > 0
                    ? `${totalDuration} minutes`
                    : "Not specified"}
                </strong>
              </div>
            </section>

            <section className="view-order-dialog__card">
              <div className="view-order-dialog__section-title">
                <Scissors size={19} />
                <h3>Salon & barber</h3>
              </div>

              <div className="view-order-dialog__detail">
                <span>Salon</span>
                <strong>{salonName}</strong>
              </div>

              <div className="view-order-dialog__detail">
                <span>Barber</span>
                <strong>{barberName}</strong>
              </div>

              {staffName && (
                <div className="view-order-dialog__detail">
                  <span>Staff member</span>
                  <strong>{staffName}</strong>
                </div>
              )}
            </section>
          </div>

          <section className="view-order-dialog__card">
            <div className="view-order-dialog__section-title">
              <Receipt size={19} />
              <h3>Services ordered</h3>

              <span className="view-order-dialog__count">
                {services.length}
              </span>
            </div>

            {services.length > 0 ? (
              <div className="view-order-dialog__services">
                {services.map((service, index) => (
                  <div
                    className="view-order-dialog__service"
                    key={service.id}
                  >
                    <div className="view-order-dialog__service-number">
                      {index + 1}
                    </div>

                    <div className="view-order-dialog__service-info">
                      <strong>{service.name}</strong>

                      <span>
                        {formatCurrency(service.unitPrice)} each
                        {" · "}
                        Qty: {service.quantity}
                        {service.duration > 0 &&
                          ` · ${service.duration} min`}
                      </span>
                    </div>

                    <strong className="view-order-dialog__service-price">
                      {formatCurrency(service.totalPrice)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="view-order-dialog__empty">
                No service details are available for this order.
              </p>
            )}
          </section>

          <div className="view-order-dialog__grid">
            <section className="view-order-dialog__card">
              <div className="view-order-dialog__section-title">
                <MapPin size={19} />
                <h3>Location details</h3>
              </div>

              <div className="view-order-dialog__location">
                <span>Customer address</span>
                <p>
                  {deliveryAddress || "No address provided"}
                </p>
              </div>

              {customerLocation && (
                <div className="view-order-dialog__location">
                  <span>Customer coordinates</span>
                  <p>{customerLocation}</p>
                </div>
              )}

              {barberLocation && (
                <div className="view-order-dialog__location">
                  <span>Salon coordinates</span>
                  <p>{barberLocation}</p>
                </div>
              )}
            </section>

            <section className="view-order-dialog__card">
              <div className="view-order-dialog__section-title">
                <CreditCard size={19} />
                <h3>Payment details</h3>
              </div>

              <div className="view-order-dialog__detail">
                <span>Payment method</span>
                <strong>{formatStatus(paymentMethod)}</strong>
              </div>

              <div className="view-order-dialog__detail">
                <span>Payment status</span>

                <span
                  className={`view-order-dialog__status view-order-dialog__status--${getStatusClass(
                    paymentStatus
                  )}`}
                >
                  {formatStatus(paymentStatus)}
                </span>
              </div>

              <div className="view-order-dialog__payment-note">
                {String(paymentMethod).toUpperCase() === "COD" &&
                String(paymentStatus).toUpperCase() !== "PAID" ? (
                  <>
                    <IndianRupee size={16} />
                    Payment is due at the time of service.
                  </>
                ) : String(paymentStatus).toUpperCase() === "PAID" ? (
                  <>
                    <CheckCircle2 size={16} />
                    Payment has been marked as paid.
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Check your payment status before the appointment.
                  </>
                )}
              </div>
            </section>
          </div>

          <section className="view-order-dialog__total">
            <div>
              <span>Total services</span>
              <strong>{services.length}</strong>
            </div>

            <div>
              <span>Total duration</span>
              <strong>
                {totalDuration > 0
                  ? `${totalDuration} min`
                  : "—"}
              </strong>
            </div>

            <div className="view-order-dialog__grand-total">
              <span>Order total</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>
          </section>

          {order.cancelReason && (
            <section className="view-order-dialog__cancel-note">
              <CircleX size={18} />
              <div>
                <strong>Cancellation reason</strong>
                <p>{order.cancelReason}</p>
              </div>
            </section>
          )}

          {order.notes && (
            <section className="view-order-dialog__notes">
              <strong>Order notes</strong>
              <p>{order.notes}</p>
            </section>
          )}

          {orderId && (
            <div className="view-order-dialog__full-id">
              <Hash size={14} />
              <span>Full order ID: {orderId}</span>
            </div>
          )}
        </div>

        <footer className="view-order-dialog__footer">
          <button
            type="button"
            className="view-order-dialog__done"
            onClick={onClose}
          >
            Close details
          </button>
        </footer>
      </section>
    </div>
  );
};

export default ViewOrderDialog;
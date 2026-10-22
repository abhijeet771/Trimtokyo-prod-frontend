import {CalendarDays, Clock3, IndianRupee, Scissors, ChevronRight, ReceiptText,} from "lucide-react";

import "./UserOrderCard.scss";

const UserOrderCard = ({ order, onViewDetails }) => {
  const scheduledAt = order?.scheduledAt || order?.scheduledDate;

  const appointmentDate = scheduledAt
    ? new Date(scheduledAt)
    : null;

  const formattedDate =
    appointmentDate && !Number.isNaN(appointmentDate.getTime())
      ? appointmentDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Date unavailable";

  const formattedTime =
    appointmentDate && !Number.isNaN(appointmentDate.getTime())
      ? appointmentDate.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : order?.scheduledTime || "";

  const orderId = order?._id || order?.orderId;

  const displayOrderId = orderId
    ? `#${String(orderId).slice(-6).toUpperCase()}`
    : "N/A";

  const totalAmount = Number(order?.totalAmount ?? 0);

  const formattedAmount = totalAmount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  const status = order?.status || "Pending";
  const normalizedStatus = String(status).toLowerCase();

  const statusClass =
    ["completed", "delivered"].includes(normalizedStatus)
      ? "user-order-card__status--completed"
      : ["cancelled", "canceled", "rejected"].includes(
            normalizedStatus
          )
        ? "user-order-card__status--cancelled"
        : ["ongoing", "in progress"].includes(normalizedStatus)
          ? "user-order-card__status--ongoing"
          : "user-order-card__status--pending";

  const barber =
    order?.barberId && typeof order.barberId === "object"
      ? order.barberId
      : order?.barber || {};

  const shopName =
    order?.salonName ||
    order?.shop?.name ||
    order?.shopName ||
    barber?.shopName ||
    barber?.salonName ||
    barber?.name ||
    "TrimTokyo Salon";

  const services = Array.isArray(order?.services)
    ? order.services
    : order?.service
      ? [order.service]
      : [];

  const getServiceName = (service) => {
    if (typeof service === "string") return service;

    return (
      service?.title ||
      service?.serviceName ||
      service?.name ||
      service?.serviceId?.title ||
      service?.serviceId?.serviceName ||
      service?.serviceId?.name ||
      service?.service?.title ||
      service?.service?.name ||
      "Service"
    );
  };

  return (
    <article className="user-order-card">
      <div className="user-order-card__main">
        <div className="user-order-card__shop-icon">
          <Scissors size={22} strokeWidth={1.8} />
        </div>

        <div className="user-order-card__information">
          <div className="user-order-card__top-line">
            <span className="user-order-card__eyebrow">
              Order ID
            </span>

            <span
              className={`user-order-card__status ${statusClass}`}
            >
              {status}
            </span>
          </div>

          <h3 className="user-order-card__shop-name">
            {shopName}
          </h3>

          <p className="user-order-card__id">
            <ReceiptText size={14} />
            {displayOrderId}
          </p>

          <div className="user-order-card__schedule">
            <span>
              <CalendarDays size={15} />
              {formattedDate}
            </span>

            {formattedTime && (
              <span>
                <Clock3 size={15} />
                {formattedTime}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="user-order-card__services">
        <p className="user-order-card__section-title">
          Services
          <span>{services.length}</span>
        </p>

        {services.length > 0 ? (
          <div className="user-order-card__service-list">
            {services.slice(0, 2).map((service, index) => {
              const serviceName = getServiceName(service);

              return (
                <div
                  className="user-order-card__service"
                  key={
                    service?._id ||
                    service?.serviceId?._id ||
                    service?.id ||
                    `${serviceName}-${index}`
                  }
                >
                  <span className="user-order-card__service-icon">
                    <Scissors size={14} />
                  </span>

                  <span className="user-order-card__service-name">
                    {serviceName}
                  </span>
                </div>
              );
            })}

            {services.length > 2 && (
              <span className="user-order-card__more-services">
                +{services.length - 2} more services
              </span>
            )}
          </div>
        ) : (
          <p className="user-order-card__empty-services">
            Service details unavailable
          </p>
        )}
      </div>

      <div className="user-order-card__summary">
        <div className="user-order-card__price-block">
          <span className="user-order-card__price-label">
            Total Amount
          </span>

          <strong className="user-order-card__price">
            <IndianRupee size={17} strokeWidth={2.4} />
            {formattedAmount}
          </strong>

          {order?.paymentStatus && (
            <span className="user-order-card__payment-status">
              {order.paymentStatus}
            </span>
          )}
        </div>

        <button
          type="button"
          className="user-order-card__details-button"
          onClick={() => onViewDetails?.(order)}
        >
          View Details
          <ChevronRight size={17} />
        </button>
      </div>
    </article>
  );
};

export default UserOrderCard;
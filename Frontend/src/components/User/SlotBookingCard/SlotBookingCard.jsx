import {
  CalendarDays,
  Clock3,
  MapPin,
  Scissors,
  ChevronRight,
  CalendarCheck,
  ReceiptText,
} from "lucide-react";

import "./SlotBookingCard.scss";

const formatBookingDate = (booking) => {
  const dateValue =
    booking?.date ||
    booking?.scheduledDate ||
    booking?.scheduledAt;

  if (!dateValue) return "Date unavailable";

  // Avoid timezone shifts when the API returns YYYY-MM-DD.
  if (
    typeof dateValue === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
  ) {
    const [year, month, day] = dateValue.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SlotBookingCard = ({ booking, onViewDetails }) => {
  const formattedDate = formatBookingDate(booking);

  const rawId = booking?._id;

  const bookingId = rawId
    ? `#SBK${String(rawId).slice(-8).toUpperCase()}`
    : booking?.bookingId || "N/A";

  const shopName =
    booking?.barber?.name ||
    booking?.shop?.name ||
    booking?.shopName ||
    booking?.barber?.shopName ||
    "TrimTokyo Salon";

  const location =
    booking?.barber?.address ||
    booking?.shop?.address ||
    booking?.shop?.location ||
    booking?.shopAddress ||
    booking?.location ||
    "";

  const serviceName =
    booking?.service?.name ||
    booking?.service?.serviceName ||
    booking?.serviceName ||
    (typeof booking?.service === "string"
      ? booking.service
      : "") ||
    "Service details unavailable";

  const slotCount = Number(booking?.slotCount ?? 1);

  const status = booking?.status || "upcoming";
  const normalizedStatus = String(status)
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ");

  const statusClass =
    normalizedStatus === "completed"
      ? "slot-booking-card__status--completed"
      : normalizedStatus === "cancelled" ||
          normalizedStatus === "canceled"
        ? "slot-booking-card__status--cancelled"
        : normalizedStatus === "no show" ||
            normalizedStatus === "noshow"
          ? "slot-booking-card__status--no-show"
          : "slot-booking-card__status--pending";

  const scheduledTime =
    booking?.timeSlot ||
    booking?.scheduledTime ||
    booking?.slot?.startTime ||
    "Time unavailable";

  const price = booking?.price ?? booking?.amount;

  return (
    <article className="slot-booking-card">
      {/* Salon and booking information */}
      <div className="slot-booking-card__salon">
        <div className="slot-booking-card__salon-icon">
          <Scissors size={23} strokeWidth={1.8} />
        </div>

        <div className="slot-booking-card__salon-info">
          <div className="slot-booking-card__top-line">
            <span className="slot-booking-card__eyebrow">
              Salon
            </span>

            <span
              className={`slot-booking-card__status ${statusClass}`}
            >
              {status}
            </span>
          </div>

          <h3 className="slot-booking-card__salon-name">
            {shopName}
          </h3>

          {location && (
            <p className="slot-booking-card__location">
              <MapPin size={14} />
              <span>{location}</span>
            </p>
          )}

          <p className="slot-booking-card__booking-id">
            <ReceiptText size={14} />
            Booking ID: {bookingId}
          </p>
        </div>
      </div>

      {/* Booked service */}
      <div className="slot-booking-card__service">
        <p className="slot-booking-card__section-label">
          Service
        </p>

        <div className="slot-booking-card__service-content">
          <span className="slot-booking-card__service-icon">
            <Scissors size={19} />
          </span>

          <div className="slot-booking-card__service-info">
            <span className="slot-booking-card__service-name">
              {serviceName}
            </span>

            <span className="slot-booking-card__slot-count">
              {slotCount} {slotCount === 1 ? "Slot" : "Slots"}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment date and time */}
      <div className="slot-booking-card__schedule">
        <span className="slot-booking-card__schedule-item">
          <CalendarDays size={17} />
          <span>{formattedDate}</span>
        </span>

        <span className="slot-booking-card__schedule-item">
          <Clock3 size={17} />
          <span>{scheduledTime}</span>
        </span>
      </div>

      {/* Price, when available */}
      {price != null && (
        <div className="slot-booking-card__price">
          ₹{Number(price).toLocaleString("en-IN")}
        </div>
      )}

      {/* Booking action */}
      <div className="slot-booking-card__actions">
        <button
          type="button"
          className="slot-booking-card__details-button"
          onClick={() => onViewDetails?.(booking)}
        >
          View Details
          <ChevronRight size={17} />
        </button>

        <span className="slot-booking-card__action-icon">
          <CalendarCheck size={18} />
        </span>
      </div>
    </article>
  );
};

export default SlotBookingCard;
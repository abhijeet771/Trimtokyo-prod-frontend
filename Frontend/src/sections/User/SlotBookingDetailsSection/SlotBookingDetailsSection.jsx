
import { useEffect, useState } from "react";
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock3,
  Scissors,
  CheckCircle2,
  X,
  Store,
} from "lucide-react";

import useSlotBooking from "../../../hooks/user/useSlotBooking";
import "./SlotBookingDetailsSection.scss";

const getServiceName = (service) =>
  service?.title ||
  service?.name ||
  service?.serviceName ||
  "Selected service";

const getServiceId = (service) =>
  service?._id || service?.serviceId || service?.id || "";

const getShopName = (shop) =>
  shop?.name || shop?.salonName || shop?.barberName || "Selected shop";

const getBarberProfileId = (shop, service) =>
  shop?.barberProfileId ||
  shop?.barberId ||
  shop?._id ||
  shop?.id ||
  service?.barberProfileId ||
  service?.barberId ||
  "";

const getSlotId = (slot) => {
  if (!slot) return "";
  if (typeof slot === "string") return "";
  return slot?._id || slot?.slotId || slot?.id || "";
};

const getSlotLabel = (slot) => {
  if (!slot) return "";
  if (typeof slot === "string") return slot;

  return (
    slot?.label ||
    slot?.timeSlot ||
    slot?.time ||
    [slot?.startTime, slot?.endTime].filter(Boolean).join(" - ")
  );
};

const getServicePrice = (service) => {
  const price =
    service?.price ?? service?.servicePrice ?? service?.amount;

  if (price === undefined || price === null || price === "") {
    return null;
  }

  const amount = Number(price);
  return Number.isFinite(amount) ? amount : null;
};

const formatDateLabel = (date) => {
  if (!date) return "Select a date";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const SlotBookingDetailsSection = ({
  selectedDate = "",
  selectedSlot = null,
  selectedService = null,
  selectedShop = null,
  bookingDraft = null,
  onBookAppointment,
}) => {
  const { bookAppointment, creating, error, clearMessages } =
    useSlotBooking();

  const service = selectedService || bookingDraft?.service || null;
  const shop = selectedShop || bookingDraft?.shop || null;

  const date = selectedDate || bookingDraft?.date || "";

  const slot =
    selectedSlot ||
    bookingDraft?.slot ||
    null;

  const slotId =
    bookingDraft?.slotId ||
    getSlotId(slot);

  const serviceId = getServiceId(service);

  const barberProfileId = getBarberProfileId(shop, service);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const serviceName = getServiceName(service);
  const slotLabel = getSlotLabel(slot);
  const servicePrice = getServicePrice(service);

  const formattedPrice =
    servicePrice === null
      ? "Price unavailable"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(servicePrice);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      submit: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!date || !slot || !service) {
      nextErrors.appointment =
        "Please select a service, date, and time slot first.";
    }

    if (!serviceId) {
      nextErrors.appointment =
        "The selected service ID is missing. Please select the service again.";
    }

    if (!barberProfileId) {
      nextErrors.appointment =
        "The barber profile could not be identified. Please select the salon and service again.";
    }

    if (!slotId) {
      nextErrors.appointment =
        "The selected time slot ID is missing. Please choose an available slot again.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    clearMessages();

    /*
     * The booking API needs real MongoDB IDs.
     * Keep customer notes/address in the payload only if your backend schema
     * supports them; unknown fields may be ignored or rejected by validation.
     */
    const bookingPayload = {
      slotId: String(slotId),
      serviceId: String(serviceId),
      barberProfileId: String(barberProfileId),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
      date,
      timeSlot: slotLabel,
    };

    try {
      let result;

      if (onBookAppointment) {
        // Allows the parent to own the booking API call if already integrated.
        result = await onBookAppointment({
          ...bookingPayload,
          service,
          shop,
          slot,
          price: servicePrice,
        });
      } else {
        result = await bookAppointment(bookingPayload);
      }

      if (result?.success === false) {
        throw new Error(
          result.message || "Unable to book your appointment."
        );
      }

      const savedBooking =
        result?.booking ||
        result?.data?.booking ||
        result?.data?.data ||
        result?.data ||
        result ||
        null;

      setConfirmedBooking(savedBooking);
      setShowConfirmation(true);
    } catch (submitError) {
      setErrors({
        submit:
          submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to book your appointment. Please try again.",
      });
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <section className="slot-booking-details">
        <div className="slot-booking-details__heading">
          <span className="slot-booking-details__step">3</span>

          <div>
            <h2>Your Details</h2>
            <p>Enter your contact details to book your appointment.</p>
          </div>
        </div>

        <div className="slot-booking-details__layout">
          <form
            className="slot-booking-details__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="slot-booking-details__form-grid">
              <div className="slot-booking-details__field">
                <label htmlFor="slot-booking-name">Full Name *</label>

                <div className="slot-booking-details__input-wrap">
                  <UserRound size={18} />

                  <input
                    id="slot-booking-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={updateField}
                    autoComplete="name"
                    required
                  />
                </div>

                {errors.name && (
                  <span className="slot-booking-details__error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="slot-booking-details__field">
                <label htmlFor="slot-booking-phone">
                  Mobile Number *
                </label>

                <div className="slot-booking-details__input-wrap">
                  <Phone size={18} />

                  <input
                    id="slot-booking-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        phone: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      }))
                    }
                    autoComplete="tel"
                    required
                  />
                </div>

                {errors.phone && (
                  <span className="slot-booking-details__error">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="slot-booking-details__field">
                <label htmlFor="slot-booking-email">
                  Email Address
                </label>

                <div className="slot-booking-details__input-wrap">
                  <Mail size={18} />

                  <input
                    id="slot-booking-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={updateField}
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <span className="slot-booking-details__error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="slot-booking-details__field">
                <label htmlFor="slot-booking-address">
                  Address <span>(Optional)</span>
                </label>

                <div className="slot-booking-details__input-wrap">
                  <MapPin size={18} />

                  <input
                    id="slot-booking-address"
                    name="address"
                    type="text"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={updateField}
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div className="slot-booking-details__field slot-booking-details__field--full">
                <label htmlFor="slot-booking-notes">
                  Additional Notes <span>(Optional)</span>
                </label>

                <textarea
                  id="slot-booking-notes"
                  name="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={updateField}
                />
              </div>
            </div>

            {errors.appointment && (
              <p
                className="slot-booking-details__error slot-booking-details__form-error"
                role="alert"
              >
                {errors.appointment}
              </p>
            )}

            {errors.submit && (
              <p
                className="slot-booking-details__error slot-booking-details__form-error"
                role="alert"
              >
                {errors.submit}
              </p>
            )}

            {error && !errors.submit && (
              <p
                className="slot-booking-details__error slot-booking-details__form-error"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="slot-booking-details__submit"
              disabled={creating}
            >
              <CalendarDays size={18} />
              {creating ? "Booking..." : "Book Appointment"}
            </button>
          </form>

          <aside className="slot-booking-details__summary">
            <h3>Appointment Details</h3>

            <div className="slot-booking-details__summary-item">
              <span className="slot-booking-details__summary-icon">
                <Scissors size={18} />
              </span>

              <div>
                <small>Selected Service</small>
                <strong>{serviceName}</strong>
              </div>
            </div>

            <div className="slot-booking-details__summary-item">
              <span className="slot-booking-details__summary-icon">
                <Store size={18} />
              </span>

              <div>
                <small>Salon / Barber</small>
                <strong>{getShopName(shop)}</strong>
              </div>
            </div>

            <div className="slot-booking-details__summary-item">
              <span className="slot-booking-details__summary-icon">
                <CalendarDays size={18} />
              </span>

              <div>
                <small>Appointment Date</small>
                <strong>{formatDateLabel(date)}</strong>
              </div>
            </div>

            <div className="slot-booking-details__summary-item">
              <span className="slot-booking-details__summary-icon">
                <Clock3 size={18} />
              </span>

              <div>
                <small>Time Slot</small>
                <strong>{slotLabel || "Select a time slot"}</strong>
              </div>
            </div>

            <div className="slot-booking-details__summary-price">
              <span>Service Price</span>
              <strong>{formattedPrice}</strong>
            </div>

            <p className="slot-booking-details__summary-note">
              Please check your selected service, date, and time before
              booking.
            </p>
          </aside>
        </div>
      </section>

      {showConfirmation && (
        <div
          className="slot-booking-confirmation__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirmation();
            }
          }}
        >
          <section
            className="slot-booking-confirmation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="slot-booking-confirmation-title"
          >
            <button
              type="button"
              className="slot-booking-confirmation__close"
              onClick={closeConfirmation}
              aria-label="Close confirmation"
            >
              <X size={20} />
            </button>

            <div className="slot-booking-confirmation__icon">
              <CheckCircle2 size={36} />
            </div>

            <span className="slot-booking-confirmation__eyebrow">
              APPOINTMENT CONFIRMED
            </span>

            <h2 id="slot-booking-confirmation-title">
              Your appointment is booked!
            </h2>

            <p className="slot-booking-confirmation__description">
              Your booking request was submitted successfully.
            </p>

            <div className="slot-booking-confirmation__reference">
              <span>Service</span>
              <strong>{serviceName}</strong>
            </div>

            <div className="slot-booking-confirmation__details">
              <div>
                <span>Date</span>
                <strong>{formatDateLabel(date)}</strong>
              </div>

              <div>
                <span>Time</span>
                <strong>{slotLabel || "—"}</strong>
              </div>

              <div>
                <span>Customer</span>
                <strong>{formData.name}</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>{formattedPrice}</strong>
              </div>
            </div>

            {confirmedBooking?._id && (
              <div className="slot-booking-confirmation__reference">
                <span>Booking Reference</span>
                <strong>{confirmedBooking._id}</strong>
              </div>
            )}

            <button
              type="button"
              className="slot-booking-confirmation__done"
              onClick={closeConfirmation}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default SlotBookingDetailsSection;

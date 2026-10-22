import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Store,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

import { getSlots } from "../../../services/timeslot.service";
import "./AppointmentsSection.scss";

const DEBUG = true;

const debugLog = (...args) => {
  if (DEBUG) console.log("[AppointmentsSection]", ...args);
};

const debugError = (...args) => {
  if (DEBUG) console.error("[AppointmentsSection]", ...args);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getServiceName = (service) =>
  service?.title ||
  service?.name ||
  service?.serviceName ||
  "Selected Service";

const getShopName = (shop) =>
  shop?.name ||
  shop?.salonName ||
  shop?.barberName ||
  "Selected Shop";

const getServicePrice = (service) => {
  const price =
    service?.price ?? service?.servicePrice ?? service?.amount;

  if (price === undefined || price === null || price === "") {
    return null;
  }

  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) ? numericPrice : null;
};

const getServiceDuration = (service) => {
  const duration =
    service?.duration ??
    service?.durationMinutes ??
    service?.serviceDuration;

  if (duration === undefined || duration === null || duration === "") {
    return null;
  }

  if (typeof duration === "string" && /[a-z]/i.test(duration)) {
    return duration;
  }

  const numericDuration = Number(duration);

  return Number.isFinite(numericDuration)
    ? `${numericDuration} min`
    : String(duration);
};

const getServiceImage = (service) =>
  service?.imageUrl || service?.image || service?.url || "";

const getSlotId = (slot) => {
  if (!slot || typeof slot !== "object") return "";

  return String(slot._id ?? slot.slotId ?? slot.id ?? "");
};

const formatTime = (value) => {
  if (!value) return "";

  if (
    typeof value === "string" &&
    /\b(AM|PM)\b/i.test(value)
  ) {
    return value;
  }

  const timeMatch =
    typeof value === "string" &&
    value.match(/T?(\d{1,2}):(\d{2})(?::\d{2})?/);

  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);

    if (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    ) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  return String(value);
};

const getSlotValue = (slot) => {
  if (!slot) return "";

  if (typeof slot === "string") return slot;

  if (slot.label || slot.timeSlot || slot.time) {
    return slot.label || slot.timeSlot || slot.time;
  }

  const start =
    slot.startTime ||
    slot.start ||
    slot.from ||
    slot.startAt;

  const end =
    slot.endTime ||
    slot.end ||
    slot.to ||
    slot.endAt;

  if (start && end) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }

  return start ? formatTime(start) : "Available time";
};

const extractSlots = (response) => {
  const data = response?.data ?? response;

  const candidates = [
    data?.slots,
    data?.data?.slots,
    data?.data?.data?.slots,
    data?.availableSlots,
    data?.data?.availableSlots,
    data?.data,
    data,
  ];

  const result = candidates.find(Array.isArray) || [];

  debugLog("Response extraction:", {
    responseData: data,
    extractedCount: result.length,
    extractedSlots: result,
  });

  return result;
};

const isSlotUnavailable = (slot) => {
  const status = String(slot?.status || "").toLowerCase();

  const unavailable =
    slot?.isBooked === true ||
    slot?.booked === true ||
    slot?.isAvailable === false ||
    slot?.available === false ||
    ["booked", "unavailable", "blocked", "cancelled"].includes(status);

  if (unavailable) {
    debugLog("Slot filtered out:", {
      slotId: getSlotId(slot),
      status: slot?.status,
      isBooked: slot?.isBooked,
      booked: slot?.booked,
      isAvailable: slot?.isAvailable,
      available: slot?.available,
    });
  }

  return unavailable;
};

// This ID must match the Auth user ID stored in TimeSlot.barberId.
// The current booking draft may contain a profile ID instead.
const getBarberId = (shop, service) =>
  shop?.barberUserId ||
  service?.barberUserId ||
  shop?.authUserId ||
  service?.authUserId ||
  shop?.barberId ||
  service?.barberId ||
  shop?.barberProfileId ||
  service?.barberProfileId ||
  shop?._id ||
  shop?.id ||
  "";

const AppointmentsSection = ({
  onContinue,
  bookingDraft = null,
}) => {
  const service = bookingDraft?.service || null;
  const shop = bookingDraft?.shop || null;

  const barberId = getBarberId(shop, service);

  const [selectedDate, setSelectedDate] = useState(
    () => bookingDraft?.date || formatDate(new Date())
  );

  const [selectedSlot, setSelectedSlot] = useState(
    () => bookingDraft?.slot || null
  );

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    if (!bookingDraft) return;

    if (bookingDraft.date) {
      setSelectedDate(bookingDraft.date);
    }

    if (bookingDraft.slot) {
      setSelectedSlot(bookingDraft.slot);
    }
  }, [bookingDraft]);

  useEffect(() => {
    let active = true;

    const loadSlots = async () => {
      debugLog("Starting availability request:", {
        selectedDate,
        barberId,
        shop,
        service,
        retryCount,
      });

      if (!selectedDate || !barberId) {
        debugError("Cannot fetch slots: missing date or barber ID.", {
          selectedDate,
          barberId,
          shop,
          service,
        });

        setSlots([]);
        setSelectedSlot(null);
        setSlotsError(
          !barberId
            ? "The barber ID could not be identified. Please return to the salon and select the service again."
            : ""
        );
        setSlotsLoading(false);
        return;
      }

      try {
        setSlotsLoading(true);
        setSlotsError("");

        debugLog("Calling getSlots with:", {
          date: selectedDate,
          barberId: String(barberId),
        });

        const response = await getSlots(
          selectedDate,
          String(barberId)
        );

        debugLog("Raw API response:", response);

        if (!active) return;

        const fetchedSlots = extractSlots(response);

        debugLog("Slots before filtering:", fetchedSlots);

        const available = fetchedSlots.filter(
          (slot) => !isSlotUnavailable(slot)
        );

        debugLog("Slots after filtering:", {
          count: available.length,
          slots: available,
        });

        setSlots(fetchedSlots);

        setSelectedSlot((previous) => {
          if (!previous) return null;

          const previousId = getSlotId(previous);
          const previousLabel = getSlotValue(previous);

          const matchingSlot = available.find((slot) => {
            if (previousId && getSlotId(slot)) {
              return getSlotId(slot) === previousId;
            }

            return getSlotValue(slot) === previousLabel;
          });

          debugLog("Previous selection reconciliation:", {
            previousId,
            previousLabel,
            matchingSlot,
          });

          return matchingSlot || null;
        });
      } catch (error) {
        if (!active) return;

        debugError("Availability request failed:", {
          message: error?.message,
          responseStatus: error?.response?.status,
          responseData: error?.response?.data,
          error,
        });

        setSlots([]);
        setSelectedSlot(null);
        setSlotsError(
          error?.response?.data?.message ||
            "Unable to load available time slots. Please try again."
        );
      } finally {
        if (active) setSlotsLoading(false);
      }
    };

    loadSlots();

    return () => {
      active = false;
    };
  }, [
    selectedDate,
    barberId,
    retryCount,
    shop,
    service,
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(
    currentWeekStart.getDate() - currentWeekStart.getDay()
  );

  const displayedWeekStart = new Date(currentWeekStart);
  displayedWeekStart.setDate(
    displayedWeekStart.getDate() + weekOffset * 7
  );

  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(displayedWeekStart);
    date.setDate(displayedWeekStart.getDate() + index);
    return date;
  });

  const monthLabel = dates[0].toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const availableSlots = useMemo(
    () => slots.filter((slot) => !isSlotUnavailable(slot)),
    [slots]
  );

  const handlePreviousWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset((previous) => previous - 1);
    }
  };

  const handleNextWeek = () => {
    setWeekOffset((previous) => previous + 1);
  };

  const handleDateSelect = (date) => {
    const nextDate = formatDate(date);

    debugLog("Date selected:", nextDate);

    setSelectedDate(nextDate);
    setSelectedSlot(null);
    setSlots([]);
    setSlotsError("");
  };

  const handleSlotSelect = (slot) => {
    debugLog("Slot selected:", slot);

    if (isSlotUnavailable(slot) || !getSlotId(slot)) {
      debugError("Cannot select slot:", {
        slot,
        slotId: getSlotId(slot),
      });
      return;
    }

    setSelectedSlot(slot);
  };

  const handleRetry = () => {
    debugLog("Retry requested.");
    setRetryCount((count) => count + 1);
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot || !getSlotId(selectedSlot)) {
      debugError("Cannot continue: date or slot is missing.", {
        selectedDate,
        selectedSlot,
      });
      return;
    }

    const payload = {
      date: selectedDate,
      slot: selectedSlot,
      slotId: getSlotId(selectedSlot),
      service,
      shop,
    };

    debugLog("Continuing with booking:", payload);

    onContinue?.(payload);
  };

  const formattedSelectedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "";

  const servicePrice = getServicePrice(service);
  const serviceDuration = getServiceDuration(service);
  const serviceImage = getServiceImage(service);
  const selectedSlotId = getSlotId(selectedSlot);

  return (
    <section className="appointments-section">
      <div className="appointments-section__heading">
        <div className="appointments-section__step">
          <CalendarDays size={19} />
        </div>

        <div>
          <h2>Book Your Appointment</h2>
          <p>
            {service
              ? "Choose your preferred date and an available time."
              : "Select a date and time for your appointment."}
          </p>
        </div>
      </div>

      {service && (
        <div className="appointments-section__service-summary">
          <div className="appointments-section__service-image">
            {serviceImage ? (
              <img src={serviceImage} alt={getServiceName(service)} />
            ) : (
              <Scissors size={25} />
            )}
          </div>

          <div className="appointments-section__service-info">
            <span className="appointments-section__summary-label">
              YOUR SELECTED SERVICE
            </span>

            <h3>{getServiceName(service)}</h3>

            <div className="appointments-section__shop-name">
              <Store size={14} />
              <span>{getShopName(shop)}</span>
            </div>

            <div className="appointments-section__service-meta">
              {serviceDuration && (
                <span>
                  <Clock3 size={14} />
                  {serviceDuration}
                </span>
              )}

              {servicePrice !== null && (
                <span>
                  <IndianRupee size={14} />
                  {servicePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="appointments-section__selected-check">
            <CheckCircle2 size={21} />
          </div>
        </div>
      )}

      <div className="appointments-section__calendar">
        <div className="appointments-section__calendar-header">
          <h3>{monthLabel}</h3>

          <div className="appointments-section__week-controls">
            <button
              type="button"
              onClick={handlePreviousWeek}
              disabled={weekOffset <= 0}
              aria-label="Previous week"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={handleNextWeek}
              aria-label="Next week"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="appointments-section__dates">
          {dates.map((date) => {
            const dateValue = formatDate(date);
            const isPast = date < today;
            const isSelected = dateValue === selectedDate;

            return (
              <button
                key={dateValue}
                type="button"
                className={`appointments-section__date ${
                  isSelected ? "is-selected" : ""
                }`}
                onClick={() => handleDateSelect(date)}
                disabled={isPast}
              >
                <span>
                  {date.toLocaleDateString("en-IN", {
                    weekday: "short",
                  })}
                </span>

                <strong>{date.getDate()}</strong>
              </button>
            );
          })}
        </div>

        <div className="appointments-section__slots-heading">
          <div>
            <h3>Available Time Slots</h3>
            <p>
              {formattedSelectedDate
                ? `Choose a time for ${formattedSelectedDate}`
                : "Choose your preferred time"}
            </p>
          </div>

          <Clock3 size={20} />
        </div>

        {slotsLoading ? (
          <div className="appointments-section__empty-slots" role="status">
            Loading available times...
          </div>
        ) : slotsError ? (
          <div className="appointments-section__empty-slots" role="alert">
            <p>{slotsError}</p>
            <button type="button" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="appointments-section__slots">
            {availableSlots.map((slot, index) => {
              const slotId = getSlotId(slot);
              const slotLabel = getSlotValue(slot);
              const isSelected = selectedSlotId === slotId;

              return (
                <button
                  key={slotId || `${slotLabel}-${index}`}
                  type="button"
                  className={`appointments-section__slot ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slotId}
                  aria-pressed={isSelected}
                >
                  <Clock3 size={14} />
                  <span>{slotLabel}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="appointments-section__empty-slots">
            No available time slots for this date. Please choose another date.
          </div>
        )}

        <div className="appointments-section__note">
          <CalendarDays size={17} />
          <span>
            Your appointment details will be reviewed before confirmation.
          </span>
        </div>

        <div className="appointments-section__selection">
          <div className="appointments-section__selection-info">
            <span>
              <strong>Date:</strong>{" "}
              {formattedSelectedDate || "Not selected"}
            </span>

            <span>
              <strong>Time:</strong>{" "}
              {selectedSlot ? getSlotValue(selectedSlot) : "Not selected"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={
              !selectedDate ||
              !selectedSlot ||
              !selectedSlotId ||
              slotsLoading
            }
          >
            Continue to Details
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AppointmentsSection;


import { useMemo } from "react";
import {
  Clock3,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import "./SlugTimingSection.scss";

const WEEK_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const getTodayKey = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase();

const formatTime = (value) => {
  if (!value) return "";

  const text = String(value).trim();

  // Preserve times already formatted by the backend.
  if (/[ap]m/i.test(text)) return text;

  const match = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (!match) return text;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return text;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getDaySchedule = (hours, dayKey) => {
  if (!hours || typeof hours !== "object") return null;

  const schedule =
    hours[dayKey] ||
    hours[dayKey.charAt(0).toUpperCase() + dayKey.slice(1)];

  if (!schedule) return null;

  if (typeof schedule === "string") {
    const value = schedule.trim();

    if (/closed/i.test(value)) {
      return { closed: true, label: "Closed" };
    }

    return { closed: false, label: value };
  }

  if (schedule.closed === true || schedule.isClosed === true) {
    return { closed: true, label: "Closed" };
  }

  const openingTime =
    schedule.openingTime ||
    schedule.open ||
    schedule.startTime;

  const closingTime =
    schedule.closingTime ||
    schedule.close ||
    schedule.endTime;

  if (!openingTime || !closingTime) {
    return { closed: false, label: "Hours unavailable" };
  }

  return {
    closed: false,
    label: `${formatTime(openingTime)} – ${formatTime(closingTime)}`,
  };
};

const SlugTimingSection = ({
  openingTime,
  closingTime,
  workingHours,
  hours,
  isOpen,
}) => {
  const todayKey = getTodayKey();

  const weeklyHours = useMemo(() => {
    const source = workingHours || hours;

    if (source && typeof source === "object" && !Array.isArray(source)) {
      return source;
    }

    return null;
  }, [workingHours, hours]);

  const hasWeeklySchedule = Boolean(
    weeklyHours &&
      WEEK_DAYS.some((day) => getDaySchedule(weeklyHours, day.key))
  );

  const todaySchedule = hasWeeklySchedule
    ? getDaySchedule(weeklyHours, todayKey)
    : null;

  const fallbackHours =
    openingTime && closingTime
      ? `${formatTime(openingTime)} – ${formatTime(closingTime)}`
      : "Hours not available";

  const isClosedToday = todaySchedule?.closed === true;

  return (
    <section className="slug-timing" id="salon-hours">
      <div className="slug-timing__header">
        <div className="slug-timing__heading">
          <span className="slug-timing__heading-icon">
            <Clock3 size={20} />
          </span>

          <div>
            <h2>Opening Hours</h2>
            <p>Plan your visit around our salon schedule.</p>
          </div>
        </div>

        {typeof isOpen === "boolean" && (
          <span
            className={`slug-timing__status ${
              isOpen
                ? "slug-timing__status--open"
                : "slug-timing__status--closed"
            }`}
          >
            <span />
            {isOpen ? "Open now" : "Currently closed"}
          </span>
        )}
      </div>

      <div className="slug-timing__content">
        <div className="slug-timing__today">
          <span className="slug-timing__today-icon">
            <CalendarDays size={21} />
          </span>

          <div className="slug-timing__today-info">
            <span className="slug-timing__eyebrow">TODAY</span>
            <strong>
              {WEEK_DAYS.find((day) => day.key === todayKey)?.label}
            </strong>
            <span className="slug-timing__today-hours">
              {todaySchedule?.label || fallbackHours}
            </span>
          </div>

          {todaySchedule && (
            <span
              className={`slug-timing__today-indicator ${
                isClosedToday
                  ? "slug-timing__today-indicator--closed"
                  : ""
              }`}
            >
              {isClosedToday ? (
                <XCircle size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
            </span>
          )}
        </div>

        {hasWeeklySchedule ? (
          <div className="slug-timing__week">
            <h3>Weekly Schedule</h3>

            <div className="slug-timing__days">
              {WEEK_DAYS.map((day) => {
                const schedule = getDaySchedule(weeklyHours, day.key);
                const isToday = day.key === todayKey;

                return (
                  <div
                    className={`slug-timing__day ${
                      isToday ? "slug-timing__day--today" : ""
                    }`}
                    key={day.key}
                  >
                    <span className="slug-timing__day-name">
                      {day.label}
                      {isToday && (
                        <span className="slug-timing__today-tag">
                          Today
                        </span>
                      )}
                    </span>

                    <span
                      className={`slug-timing__day-hours ${
                        schedule?.closed
                          ? "slug-timing__day-hours--closed"
                          : ""
                      }`}
                    >
                      {schedule?.label || "Hours unavailable"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="slug-timing__fallback">
            <Clock3 size={17} />
            <div>
              <strong>Regular hours</strong>
              <p>{fallbackHours}</p>
              <span>
                A full weekly schedule has not been provided.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SlugTimingSection;

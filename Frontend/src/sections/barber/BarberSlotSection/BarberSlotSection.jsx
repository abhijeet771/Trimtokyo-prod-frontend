import { useState } from "react";

import { useCreateSlots } from "../../../hooks/barber/useTimeSlots";
import BarberGeneratedSlots from "./BarberGeneratedSlots";
import BarberUpcomingBookings from "./BarberUpcomingBookings";
import "./BarberSlotSection.scss";

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addDaysToDate = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);

  return getLocalDateString(date);
};

const getInclusiveDays = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const BarberSlotSection = () => {
  const [activeTab, setActiveTab] = useState("generate");

  const today = getLocalDateString();

  const [form, setForm] = useState({
    startDate: today,
    endDate: "",
    startTime: "",
    endTime: "",
    duration: 30,
  });

  const [selectedPreset, setSelectedPreset] = useState("custom");
  const [generationSummary, setGenerationSummary] = useState(null);

  const { generateSlots, loading: creating,
    error, success, resetMessages,
  } = useCreateSlots();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "duration" ? Number(value) : value,
    }));

    if (name === "startDate" || name === "endDate") {
      setSelectedPreset("custom");
    }

    setGenerationSummary(null);
    resetMessages();
  };

  const handlePresetChange = (days) => {
    const startDate = form.startDate || today;

    setForm((previous) => ({
      ...previous,
      startDate,
      endDate: addDaysToDate(startDate, days - 1),
    }));

    setSelectedPreset(String(days));
    setGenerationSummary(null);
    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    setGenerationSummary(null);

    if ( !form.startDate || !form.endDate ||
      !form.startTime || !form.endTime
    ) {
      return;
    }

    if (form.startDate < today) {
      return;
    }

    if (form.endDate < form.startDate) {
      return;
    }

    const totalDays = getInclusiveDays(
      form.startDate,
      form.endDate
    );

    if (totalDays > 90) {
      return;
    }

    if (form.startTime >= form.endTime) {
      return;
    }

    try {
      const result = await generateSlots({
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: Number(form.duration),
      });

      if (result?.success === false) {
        return;
      }

      // Read generation summary returned by the backend.
      const summary = result?.data?.summary;

      if (summary) {
        setGenerationSummary(summary);
      }

      // Keep the selected dates and duration for convenience.
      // Clear only the time fields after successful generation.
      setForm((previous) => ({
        ...previous,
        startTime: "",
        endTime: "",
      }));

      setActiveTab("generated");
    } catch {
      // The hook stores the API error for display.
    }
  };

  return (
    <div className="slot-section">
      {/* HEADER */}
      <div className="slot-section-header">
        <div>
          <h2>Slot Management</h2>
          <p>
            Generate availability and manage your bookings.
          </p>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="slot-tabs">
        <button type="button"
          className={activeTab === "generate" ? "active" : ""}
          onClick={() => setActiveTab("generate")}>
          Generate Slots
        </button>

        <button
          type="button" className={activeTab === "generated" ? "active" : ""}
          onClick={() => setActiveTab("generated")}>
          Generated Slots
        </button>

        <button
          type="button"
          className={activeTab === "bookings" ? "active" : ""}
          onClick={() => setActiveTab("bookings")}
        >
          Upcoming Bookings
        </button>
      </div>

      {/* GENERATE SLOTS TAB */}
      {activeTab === "generate" && (
        <div className="slot-tab-content">
          <div className="slot-form-card">
            <h3>Create Availability Slots</h3>

            <p className="slot-form-description">
              Set your availability for multiple dates at once.
              All days, including weekends, are included.
            </p>

            <form className="form" onSubmit={handleSubmit}>
              {/* DATE RANGE PRESETS */}
              <div className="form-group slot-range-group">
                <label>Quick Date Range</label>

                <div className="slot-range-presets">
                  {[10, 15, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      className={ selectedPreset === String(days) ? "active" : ""}
                      onClick={() => handlePresetChange(days)}
                    >
                      {days} Days
                    </button>
                  ))}

                  <button
                    type="button"
                    className={
                      selectedPreset === "custom" ? "active" : ""
                    }
                    onClick={() => {
                      setSelectedPreset("custom");
                      setGenerationSummary(null);
                      resetMessages();
                    }}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* START DATE */}
              <div className="form-group">
                <label htmlFor="slot-start-date">
                  Start Date
                </label>

                <input
                  id="slot-start-date"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              {/* END DATE */}
              <div className="form-group">
                <label htmlFor="slot-end-date">
                  End Date
                </label>

                <input
                  id="slot-end-date"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || today}
                  max={
                    form.startDate ? addDaysToDate(form.startDate, 89) : undefined
                  }
                  required
                />
              </div>

              {/* SELECTED DATE RANGE INFO */}
              {form.startDate && form.endDate && (
                <div className="slot-range-info">
                  <span>
                    <strong>
                      {form.endDate >= form.startDate
                        ? getInclusiveDays(
                            form.startDate,
                            form.endDate
                          )
                        : 0}
                    </strong>{" "}
                    calendar days selected
                  </span>

                  <span>
                    Weekdays and weekends included
                  </span>
                </div>
              )}

              {/* START TIME */}
              <div className="form-group">
                <label htmlFor="slot-start-time">
                  Start Time
                </label>

                <input
                  id="slot-start-time"
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* END TIME */}
              <div className="form-group">
                <label htmlFor="slot-end-time">
                  End Time
                </label>

                <input
                  id="slot-end-time"
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  min={form.startTime || undefined}
                  required
                />
              </div>

              {/* SLOT DURATION */}
              <div className="form-group">
                <label htmlFor="slot-duration">
                  Slot Duration
                </label>

                <select
                  id="slot-duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>

              {/* VALIDATION MESSAGE */}
              {form.startDate &&
                form.endDate &&
                form.endDate < form.startDate && (
                  <p className="slot-error" role="alert">
                    End date must be on or after start date.
                  </p>
                )}

              {form.startDate &&
                form.endDate >= form.startDate &&
                getInclusiveDays(
                  form.startDate,
                  form.endDate
                ) > 90 && (
                  <p className="slot-error" role="alert">
                    You can generate availability for a maximum
                    of 90 days at a time.
                  </p>
                )}

              {form.startTime &&
                form.endTime &&
                form.startTime >= form.endTime && (
                  <p className="slot-error" role="alert">
                    End time must be later than start time.
                  </p>
                )}

              {/* API ERROR */}
              {error && (
                <p className="slot-error" role="alert">
                  {error}
                </p>
              )}

              {/* SUCCESS MESSAGE */}
              {success && (
                <p className="slot-success" role="status">
                  {success}
                </p>
              )}

              {/* GENERATE BUTTON */}
              <button
                type="submit"
                className="submit-btn"
                disabled={
                  creating ||
                  !form.startDate ||
                  !form.endDate ||
                  !form.startTime ||
                  !form.endTime ||
                  form.startDate < today ||
                  form.endDate < form.startDate ||
                  getInclusiveDays(
                    form.startDate,
                    form.endDate
                  ) > 90 ||
                  form.startTime >= form.endTime
                }
              >
                {creating
                  ? "Generating Availability..."
                  : "Generate Slots"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GENERATED SLOTS TAB */}
      {activeTab === "generated" && (
        <div className="slot-tab-content">
          <BarberGeneratedSlots />
        </div>
      )}

      {/* UPCOMING BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="slot-tab-content">
          <BarberUpcomingBookings />
        </div>
      )}
    </div>
  );
};

export default BarberSlotSection;
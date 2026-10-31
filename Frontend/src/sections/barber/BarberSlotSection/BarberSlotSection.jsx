
import { useState } from "react";

import { useCreateSlots } from "../../../hooks/barber/useTimeSlots";

import BarberGeneratedSlots from "./BarberGeneratedSlots";
import BarberUpcomingBookings from "./BarberUpcomingBookings";

import "./BarberSlotSection.scss";

const BarberSlotSection = () => {
  const [activeTab, setActiveTab] = useState("generate");

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: 30,
  });

  const {
    generateSlots,
    loading: creating,
    error,
    success,
    resetMessages,
  } = useCreateSlots();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "duration" ? Number(value) : value,
    }));

    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    if (!form.date || !form.startTime || !form.endTime) {
      return;
    }

    if (form.startTime >= form.endTime) {
      return;
    }

    try {
      const result = await generateSlots({
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: Number(form.duration),
      });

      // Support common API response shapes.
      if (result?.success === false) {
        return;
      }

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
        <button
          type="button"
          className={activeTab === "generate" ? "active" : ""}
          onClick={() => setActiveTab("generate")}
        >
          Generate Slots
        </button>

        <button
          type="button"
          className={activeTab === "generated" ? "active" : ""}
          onClick={() => setActiveTab("generated")}
        >
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

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="slot-date">Date</label>
                <input
                  id="slot-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                />
              </div>

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

              {error && (
                <p className="slot-error" role="alert">
                  {error}
                </p>
              )}

              {success && (
                <p className="slot-success" role="status">
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={creating}
              >
                {creating ? "Creating..." : "Generate Slots"}
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

      {/* UPCOMING BOOKINGS TAB — LEFT UNCHANGED */}
      {activeTab === "bookings" && (
        <div className="slot-tab-content">
          <BarberUpcomingBookings />
        </div>
      )}
    </div>
  );
};

export default BarberSlotSection;

import { useState, useEffect } from "react";
import api from "../../services/api";
import "./SlotSection.scss";

const SlotSection = () => {
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    duration: 30,
  });

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const formatDate = (date) =>
    new Date(date).toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setForm({
        ...form,
        date: formatDate(value),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.date || !form.startTime || !form.endTime) {
        alert("Please fill all fields");
        return;
      }

      console.log("🔥 Creating slots with:", form);

      setLoading(true);

      await api.post("/api/v1/timeslots/availability", form);

      alert("Slots generated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating slots");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingLoading(true);

      const res = await api.get("/api/v1/timeslots/barber-bookings");

      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="slot-section">
      <h3>Create Availability Slots</h3>

      <div className="form">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Slot Duration</label>
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Generate Slots"}
        </button>
      </div>

      <div className="bookings-card">
        <h3>Upcoming Bookings</h3>

        {bookingLoading && <p>Loading bookings...</p>}

        {!bookingLoading && bookings.length === 0 && (
          <p>No bookings yet</p>
        )}

        {!bookingLoading &&
          bookings.map((b) => (
            <div key={b._id} className="booking-item">
              <p><strong>{b.date}</strong></p>
              <p>{b.startTime} - {b.endTime}</p>

              <p><strong>Service:</strong> {b.serviceName || "N/A"}</p>
              <p><strong>Phone:</strong> {b.phone || "N/A"}</p>

              <p>Name: {b.userId?.name || "N/A"}</p>
              <p>Email: {b.userId?.email || "N/A"}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SlotSection;
import React, { useEffect } from "react";
import useAdminSlots from "../../hooks/useAdminSlots"; 
import "./AdminSlotSection.scss";

const AdminSlotSection = () => {
  const { bookings, loading, fetchBookings } = useAdminSlots();

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="admin-slot-section">
      <h2>All Bookings</h2>

      {loading && <p>Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p>No bookings found</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Barber</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.date}</td>

                  <td>
                    {b.startTime} - {b.endTime}
                  </td>

                  <td>{b.barberId?.name || "N/A"}</td>

                  <td>{b.userId?.name || "N/A"}</td>

                  <td>{b.userId?.email || "N/A"}</td>

                  <td>{b.phone || "N/A"}</td>

                  <td>{b.serviceId?.title || "N/A"}</td>

                  <td>
                    ₹{b.serviceId?.price ?? "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSlotSection;
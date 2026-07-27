import { useState, useEffect } from "react";
import SideBarSection from "../sections/SideBarSection/SideBarSection";
import { getBookings } from "../services/api";

import "./Bookings.scss";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await getBookings({
        page,
        limit: 10,
      });

      // safer handling (avoid crash if undefined)
      setBookings(res?.data?.bookings || []);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  return (
    <div className="bookings">
      {/* SIDEBAR */}
      <SideBarSection />

      {/* CONTENT */}
      <div className="bookings__content">
        <h2 className="bookings__title">Booking History</h2>

        {loading ? (
          <p className="bookings__loading">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="bookings__empty">No bookings found</p>
        ) : (
          <>
            <div className="bookings__grid">
              {bookings.map((b) => (
                <div className="booking-card" key={b._id}>
                  
                  {/* HEADER */}
                  <div className="booking-card__header">
                    <img
                      src={b?.barber?.image || "/placeholder.png"}
                      alt={b?.barber?.name || "Barber"}
                    />
                    <div>
                      <h4>{b?.barber?.name || "Unknown Barber"}</h4>
                      <p>⭐ {b?.barber?.rating ?? 0}</p>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="booking-card__body">
                    <p className="service">
                      {b?.service?.name || "Service"}
                    </p>
                    <p className="price">₹{b?.price ?? 0}</p>
                  </div>

                  {/* META */}
                  <div className="booking-card__meta">
                    <p>{b?.date || "-"}</p>
                    <p>{b?.timeSlot || "-"}</p>
                  </div>

                  {/* STATUS */}
                  <div className="booking-card__status">
                    <span className={`status ${b?.status || "upcoming"}`}>
                      {b?.status || "upcoming"}
                    </span>
                  </div>

                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
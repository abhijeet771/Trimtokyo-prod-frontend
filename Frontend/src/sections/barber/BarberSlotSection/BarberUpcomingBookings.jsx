import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, CalendarDays } from "lucide-react";

import useBarberUpcomingBookings from "../../../hooks/barber/useBarberUpcomingBookings";
import "./BarberUpcomingBookings.scss";

const PAGE_SIZE = 3;

const BarberUpcomingBookings = () => {
  const {bookings,loading,error,refreshBookings,clearError,  } = useBarberUpcomingBookings();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const formatDate = (date) => {
    if (!date) return "—";

    // Backend stores dates as YYYY-MM-DD strings.
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(String(date))
      ? new Date(`${date}T00:00:00`)
      : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return bookings;

    return bookings.filter((booking) => {
      const customerName =
        booking.userId?.name ||
        booking.user?.name ||
        booking.customerName ||
        "";

      const customerEmail =
        booking.userId?.email ||
        booking.user?.email ||
        "";

      const values = [
        customerName,
        customerEmail,
        booking.phone,
        booking.serviceName,
        booking.serviceId?.title,
        booking.date,
        booking.startTime,
        booking.endTime,
        booking.status,
      ];

      return values.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }, [bookings, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getStatusClass = (status) => {
    switch (String(status || "BOOKED").toUpperCase()) {
      case "AVAILABLE":
        return "available";
      case "BLOCKED":
        return "blocked";
      case "CANCELLED":
        return "cancelled";
      case "COMPLETED":
        return "completed";
      default:
        return "booked";
    }
  };

  const handleRefresh = async () => {
    if (clearError) clearError();
    await refreshBookings();
  };

  return (
    <section className="barber-upcoming-bookings">
      <div className="barber-upcoming-bookings__header">
        <div>
          <h3>Upcoming Bookings</h3>
          <p>View your customer appointments and booking details.</p>
        </div>

        <button
          type="button"
          className="barber-upcoming-bookings__refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={15} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="barber-upcoming-bookings__summary">
        <div className="barber-upcoming-bookings__summary-icon">
          <CalendarDays size={20} />
        </div>

        <div>
          <span>Total bookings</span>
          <strong>{bookings.length}</strong>
        </div>
      </div>

      <div className="barber-upcoming-bookings__toolbar">
        <label className="barber-upcoming-bookings__search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search customer, service, date..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {error && (
        <div className="barber-upcoming-bookings__error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="barber-upcoming-bookings__state">
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="barber-upcoming-bookings__empty">
          <CalendarDays size={32} />
          <h4>No bookings found</h4>
          <p>
            {bookings.length === 0
              ? "Your customer bookings will appear here."
              : "Try searching with different details."}
          </p>
        </div>
      ) : (
        <>
          <div className="barber-upcoming-bookings__table-wrap">
            <table className="barber-upcoming-bookings__table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBookings.map((booking) => {
                  const customer =
                    booking.userId?.name ||
                    booking.user?.name ||
                    booking.customerName ||
                    "N/A";

                  const phone =
                    booking.phone ||
                    booking.userId?.phone ||
                    booking.user?.phone ||
                    "N/A";

                  const serviceName =
                    booking.serviceName ||
                    booking.serviceId?.title ||
                    "N/A";

                  const status = String(
                    booking.status || "BOOKED"
                  ).toUpperCase();

                  return (
                    <tr key={booking._id || booking.id}>
                      <td>
                        <div className="barber-upcoming-bookings__customer">
                          <span className="barber-upcoming-bookings__avatar">
                            {customer.charAt(0).toUpperCase()}
                          </span>

                          <div>
                            <strong>{customer}</strong>

                            {(booking.userId?.email ||
                              booking.user?.email) && (
                              <small>
                                {booking.userId?.email ||
                                  booking.user?.email}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>{phone}</td>
                      <td>{serviceName}</td>
                      <td>{formatDate(booking.date)}</td>

                      <td>
                        {booking.startTime || "—"} –{" "}
                        {booking.endTime || "—"}
                      </td>

                      <td>
                        <span
                          className={`barber-upcoming-bookings__status ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="barber-upcoming-bookings__pagination">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(
                currentPage * PAGE_SIZE,
                filteredBookings.length
              )}{" "}
              of {filteredBookings.length}
            </span>

            <div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default BarberUpcomingBookings;
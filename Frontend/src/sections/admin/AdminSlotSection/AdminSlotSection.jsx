import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Scissors, Users, Search, RefreshCw, IndianRupee, CalendarCheck,} from "lucide-react";

import useAdminSlots from "../../../hooks/useAdminSlots";
import "./AdminSlotSection.scss";

const AdminSlotSection = () => {
  const { bookings = [], loading, fetchBookings } = useAdminSlots();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookingDate = (booking) => {
    if (!booking?.date) return null;

    const date = new Date(booking.date);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const bookingDate = getBookingDate(booking);

      const bookingDateKey = bookingDate
        ? `${bookingDate.getFullYear()}-${String(
            bookingDate.getMonth() + 1
          ).padStart(2, "0")}-${String(bookingDate.getDate()).padStart(2, "0")}`
        : "";

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && bookingDateKey === todayKey) ||
        (dateFilter === "upcoming" &&
          bookingDateKey > todayKey);

      const searchableValues = [
        booking.barberId?.name,
        booking.userId?.name,
        booking.userId?.email,
        booking.phone,
        booking.serviceId?.title,
        booking.date,
        booking.startTime,
        booking.endTime,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      return matchesDate && matchesSearch;
    });
  }, [bookings, searchTerm, dateFilter, todayKey]);

  const todayBookings = bookings.filter((booking) => {
    const date = getBookingDate(booking);
    if (!date) return false;

    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return dateKey === todayKey;
  }).length;

  const totalRevenue = bookings.reduce((total, booking) => {
    const price = Number(booking.serviceId?.price);
    return total + (Number.isFinite(price) ? price : 0);
  }, 0);

  const formatDate = (value) => {
    const date = getBookingDate({ date: value });

    if (!date) return value || "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  return (
    <section className="admin-slot-section">
      <div className="booking-hero">
        <div className="booking-hero__content">
          <span className="booking-hero__eyebrow">
            <CalendarCheck size={15} />
            BOOKING MANAGEMENT
          </span>

          <h1>All Bookings</h1>

          <p>
            View customer appointments, barber schedules, and service
            booking details in one place.
          </p>
        </div>

        <div className="booking-hero__illustration">
          <div className="booking-hero__icon">
            <CalendarDays size={42} />
          </div>
          <span className="booking-hero__bubble booking-hero__bubble--one" />
          <span className="booking-hero__bubble booking-hero__bubble--two" />
        </div>
      </div>

      <div className="booking-stats">
        <article className="booking-stat booking-stat--lavender">
          <div className="booking-stat__icon">
            <CalendarDays size={22} />
          </div>
          <div>
            <span className="booking-stat__label">Total Bookings</span>
            <strong>{bookings.length}</strong>
            <small>All fetched appointments</small>
          </div>
        </article>

        <article className="booking-stat booking-stat--orange">
          <div className="booking-stat__icon">
            <Clock3 size={22} />
          </div>
          <div>
            <span className="booking-stat__label">Today's Bookings</span>
            <strong>{todayBookings}</strong>
            <small>Appointments scheduled today</small>
          </div>
        </article>

        <article className="booking-stat booking-stat--blue">
          <div className="booking-stat__icon">
            <Scissors size={22} />
          </div>
          <div>
            <span className="booking-stat__label">Services Booked</span>
            <strong>
              {
                new Set(
                  bookings
                    .map((booking) => booking.serviceId?.title)
                    .filter(Boolean)
                ).size
              }
            </strong>
            <small>Unique services in bookings</small>
          </div>
        </article>

        <article className="booking-stat booking-stat--green">
          <div className="booking-stat__icon">
            <IndianRupee size={22} />
          </div>
          <div>
            <span className="booking-stat__label">
              Booking Value
            </span>
            <strong>
              {totalRevenue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
            <small>Sum of listed service prices</small>
          </div>
        </article>
      </div>

      <div className="booking-panel">
        <div className="booking-panel__heading">
          <div>
            <h2>Appointment Records</h2>
            <p>Search and review your booking details.</p>
          </div>

          <button
            type="button"
            className="booking-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "booking-refresh__spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="booking-toolbar">
          <div className="booking-search">
            <Search size={18} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customer, barber, service..."
              aria-label="Search bookings"
            />
          </div>

          <div className="booking-filter">
            <CalendarDays size={17} />
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              aria-label="Filter bookings by date"
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div className="booking-results">
          Showing <strong>{filteredBookings.length}</strong> of{" "}
          <strong>{bookings.length}</strong> bookings
        </div>

        {loading ? (
          <div className="booking-state">
            <div className="booking-state__spinner" />
            <h3>Loading bookings</h3>
            <p>Please wait while appointment records are fetched.</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="booking-state">
            <div className="booking-state__empty-icon">
              <CalendarDays size={30} />
            </div>
            <h3>
              {bookings.length === 0
                ? "No bookings found"
                : "No matching bookings"}
            </h3>
            <p>
              {bookings.length === 0
                ? "Bookings will appear here when records are available."
                : "Try changing your search term or date filter."}
            </p>

            {(searchTerm || dateFilter !== "all") && (
              <button
                type="button"
                className="booking-clear"
                onClick={() => {
                  setSearchTerm("");
                  setDateFilter("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="booking-table-container">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Barber</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="booking-date">
                        <CalendarDays size={15} />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                    </td>

                    <td>
                      <span className="booking-time">
                        <Clock3 size={14} />
                        {booking.startTime || "N/A"} -{" "}
                        {booking.endTime || "N/A"}
                      </span>
                    </td>

                    <td>
                      <div className="booking-person">
                        <span className="booking-avatar booking-avatar--barber">
                          <Scissors size={15} />
                        </span>
                        <span>{booking.barberId?.name || "N/A"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="booking-person">
                        <span className="booking-avatar booking-avatar--user">
                          <Users size={15} />
                        </span>
                        <span>{booking.userId?.name || "N/A"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="booking-contact">
                        <span>{booking.userId?.email || "N/A"}</span>
                        <small>{booking.phone || "N/A"}</small>
                      </div>
                    </td>

                    <td>
                      <span className="booking-service">
                        {booking.serviceId?.title || "N/A"}
                      </span>
                    </td>

                    <td>
                      <strong className="booking-price">
                        {booking.serviceId?.price != null
                          ? `₹${Number(
                              booking.serviceId.price
                            ).toLocaleString("en-IN")}`
                          : "N/A"}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminSlotSection;
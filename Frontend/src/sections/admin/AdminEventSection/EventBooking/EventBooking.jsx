
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
} from "lucide-react";

import initialBookings from "./EventBooking.js";
import EventBookingDialog from "./EventBookingDialog.jsx";
import "./EventBooking.scss";

const ITEMS_PER_PAGE = 10;

const EVENT_TYPES = [
  "Marriage / Wedding",
  "Mundan",
  "Upanayanam",
  "Party",
  "Corporate",
  "Other",
];

const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function EventBooking() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        [
          booking.bookingId,
          booking.customerName,
          booking.phoneNumber,
          booking.eventType,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesType =
        eventTypeFilter === "All" ||
        booking.eventType === eventTypeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [bookings, searchTerm, eventTypeFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedBookings = filteredBookings.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const firstItem =
    filteredBookings.length === 0
      ? 0
      : (safePage - 1) * ITEMS_PER_PAGE + 1;

  const lastItem = Math.min(
    safePage * ITEMS_PER_PAGE,
    filteredBookings.length
  );

  const openDialog = (mode, booking = null) => {
    setDialogMode(mode);
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleSaveBooking = (formData) => {
    if (dialogMode === "edit" && selectedBooking) {
      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, ...formData }
            : booking
        )
      );
    } else {
      const nextId =
        bookings.reduce(
          (maximum, booking) =>
            Math.max(maximum, Number(booking.id) || 0),
          0
        ) + 1;

      const newBooking = {
        ...formData,
        id: nextId,
        bookingId: `EVT-${String(nextId).padStart(3, "0")}`,
        createdAt: new Date().toISOString(),
      };

      setBookings((previous) => [newBooking, ...previous]);
      setCurrentPage(1);
    }

    closeDialog();
  };

  const handleDeleteBooking = (bookingToDelete) => {
    if (!bookingToDelete) return;

    setBookings((previous) =>
      previous.filter(
        (booking) => booking.id !== bookingToDelete.id
      )
    );

    setCurrentPage(1);
    closeDialog();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setEventTypeFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - safePage) <= 1
  );

  return (
    <section className="event-booking">
      <div className="event-booking__toolbar">
        <div className="event-booking__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search booking ID, customer, phone..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search event bookings"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="event-booking__filters">
          <select
            aria-label="Filter by event type"
            value={eventTypeFilter}
            onChange={(event) => {
              setEventTypeFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Event Types</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by booking status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="event-booking__add-button"
            onClick={() => openDialog("add")}
          >
            <Plus size={18} />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      <div className="event-booking__table-card">
        <div className="event-booking__table-wrapper">
          <table className="event-booking__table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Event Type</th>
                <th>Event Date</th>
                <th>Status</th>
                <th className="event-booking__actions-heading">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <span className="event-booking__booking-id">
                        {booking.bookingId}
                      </span>
                    </td>

                    <td>
                      <div className="event-booking__customer">
                        <span className="event-booking__customer-avatar">
                          {(booking.customerName || "?")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div className="event-booking__customer-details">
                          <strong>{booking.customerName}</strong>
                          <span>{booking.phoneNumber}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="event-booking__event-type">
                        {booking.eventType}
                      </span>
                    </td>

                    <td>
                      <span className="event-booking__date">
                        <CalendarDays size={15} />
                        {formatDate(booking.eventDate)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`event-booking__status event-booking__status--${(
                          booking.status || "pending"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <span className="event-booking__status-dot" />
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="event-booking__actions">
                        <button
                          type="button"
                          className="event-booking__action-button event-booking__action-button--view"
                          onClick={() => openDialog("view", booking)}
                          aria-label={`View ${booking.bookingId}`}
                          title="View booking"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="event-booking__action-button event-booking__action-button--edit"
                          onClick={() => openDialog("edit", booking)}
                          aria-label={`Edit ${booking.bookingId}`}
                          title="Edit booking"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="event-booking__action-button event-booking__action-button--delete"
                          onClick={() => openDialog("delete", booking)}
                          aria-label={`Delete ${booking.bookingId}`}
                          title="Delete booking"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="event-booking__empty">
                      <div className="event-booking__empty-icon">
                        <CalendarDays size={24} />
                      </div>

                      <h3>No bookings found</h3>

                      <p>
                        Try changing your search or filters, or create a
                        new event booking.
                      </p>

                      {searchTerm ||
                      eventTypeFilter !== "All" ||
                      statusFilter !== "All" ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                        >
                          Clear filters
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openDialog("add")}
                        >
                          <Plus size={16} />
                          Add Booking
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="event-booking__pagination">
          <p>
            Showing <strong>{firstItem}–{lastItem}</strong> of{" "}
            <strong>{filteredBookings.length}</strong> bookings
          </p>

          <div className="event-booking__pagination-controls">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={safePage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            {pageNumbers.reduce((items, page, index, pages) => {
              if (index > 0 && page - pages[index - 1] > 1) {
                items.push(
                  <span
                    key={`ellipsis-${page}`}
                    className="event-booking__pagination-ellipsis"
                  >
                    …
                  </span>
                );
              }

              items.push(
                <button
                  type="button"
                  key={page}
                  className={
                    safePage === page
                      ? "event-booking__page-button event-booking__page-button--active"
                      : "event-booking__page-button"
                  }
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={
                    safePage === page ? "page" : undefined
                  }
                >
                  {page}
                </button>
              );

              return items;
            }, [])}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={safePage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <EventBookingDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        bookingData={selectedBooking}
        onClose={closeDialog}
        onSave={handleSaveBooking}
        onConfirmDelete={handleDeleteBooking}
      />
    </section>
  );
}

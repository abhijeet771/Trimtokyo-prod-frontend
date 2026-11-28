import React, { useEffect, useState } from "react";
import {  Search,  Plus,  Eye,  Pencil,  Trash2,
  ChevronLeft,  ChevronRight,  X,  CalendarDays,} from "lucide-react";

import useEventBooking from "../../../../hooks/admin/useEventBooking";
import EventBookingDialog from "./EventBookingDialog.jsx";
import "./EventBooking.scss";

const ITEMS_PER_PAGE = 10;

const BOOKING_STATUSES = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Pending";

  return status.charAt(0) + status.slice(1).toLowerCase();
};

export default function EventBooking() {
  /* ============================================================
     EVENT BOOKING HOOK
  ============================================================ */

  const {
    bookings,
    categories,

    page,
    limit,
    total,
    totalPages,

    search,
    status,
    eventCategory,

    setPage,

    loading,
    categoriesLoading,
    creating,
    updating,
    statusUpdating,
    deleting,

    fetchBookings,
    fetchCategories,
    createBooking,
    updateBooking,
    changeBookingStatus,
    removeBooking,
  } = useEventBooking(1, ITEMS_PER_PAGE);

  /* ============================================================
     LOCAL UI STATE
  ============================================================ */

  const [searchTerm, setSearchTerm] = useState(search);
  const [eventTypeFilter, setEventTypeFilter] = useState(eventCategory || "All");
  const [statusFilter, setStatusFilter] = useState(status || "All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedBooking, setSelectedBooking] = useState(null);

  /* ============================================================
     FETCH BOOKINGS
  ============================================================ */

  useEffect(() => {
    fetchBookings({
      page,
      limit: ITEMS_PER_PAGE,
      search: searchTerm,
      status: statusFilter === "All" ? "" : statusFilter,
      eventCategory:
        eventTypeFilter === "All" ? "" : eventTypeFilter,
    }).catch(() => {});
  }, [
    page,
    searchTerm,
    statusFilter,
    eventTypeFilter,
    fetchBookings,
  ]);

  /* ============================================================
     OPEN DIALOG
  ============================================================ */

  const openDialog = (mode, booking = null) => {
    setDialogMode(mode);
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  /* ============================================================
     LOAD CATEGORIES FOR ADD / EDIT
  ============================================================ */

  useEffect(() => {
    if (
      dialogOpen &&
      (dialogMode === "add" || dialogMode === "edit")
    ) {
      fetchCategories().catch(() => {});
    }
  }, [dialogOpen, dialogMode, fetchCategories]);

  /* ============================================================
     CREATE / UPDATE BOOKING
  ============================================================ */

  const handleSaveBooking = async (formData) => {
    try {
      if (dialogMode === "edit" && selectedBooking) {
        await updateBooking(selectedBooking._id, formData);
      } else {
        await createBooking(formData);
      }

      closeDialog();

      setPage(1);

      await fetchBookings({
        page: 1,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        status: statusFilter === "All" ? "" : statusFilter,
        eventCategory:
          eventTypeFilter === "All" ? "" : eventTypeFilter,
      });
    } catch (error) {
      // Hook handles the error toast.
    }
  };

  /* ============================================================
     DELETE BOOKING
  ============================================================ */

  const handleDeleteBooking = async (bookingToDelete) => {
    if (!bookingToDelete?._id) return;

    try {
      await removeBooking(bookingToDelete._id);

      closeDialog();

      // Refresh current page. If it became empty, go to previous page.
      const remainingBookings = bookings.length - 1;

      const nextPage =
        remainingBookings === 0 && page > 1
          ? page - 1
          : page;

      setPage(nextPage);

      await fetchBookings({
        page: nextPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        status: statusFilter === "All" ? "" : statusFilter,
        eventCategory:
          eventTypeFilter === "All" ? "" : eventTypeFilter,
      });
    } catch (error) {
      // Hook handles the error toast.
    }
  };

  /* ============================================================
     CHANGE BOOKING STATUS
  ============================================================ */

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await changeBookingStatus(bookingId, newStatus);

      await fetchBookings({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        status: statusFilter === "All" ? "" : statusFilter,
        eventCategory:
          eventTypeFilter === "All" ? "" : eventTypeFilter,
      });
    } catch (error) {
      // Hook handles the error toast.
    }
  };

  /* ============================================================
     CLEAR FILTERS
  ============================================================ */

  const clearFilters = () => {
    setSearchTerm("");
    setEventTypeFilter("All");
    setStatusFilter("All");
    setPage(1);
  };

  /* ============================================================
     PAGINATION
  ============================================================ */

  const safePage = Math.min(page, Math.max(1, totalPages));

  const firstItem = total === 0 ? 0 : (safePage - 1) * limit + 1;

  const lastItem = Math.min(safePage * limit, total);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (pageNumber) =>
      pageNumber === 1 ||
      pageNumber === totalPages ||
      Math.abs(pageNumber - safePage) <= 1
  );

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section className="event-booking">

      {/* TOOLBAR */}

      <div className="event-booking__toolbar">

        <div className="event-booking__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search booking ID, customer, phone..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            aria-label="Search event bookings"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setPage(1);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="event-booking__filters">

          {/* EVENT CATEGORY FILTER */}

          <select
            aria-label="Filter by event type"
            value={eventTypeFilter}
            onChange={(event) => {
              setEventTypeFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Event Types</option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* STATUS FILTER */}

          <select
            aria-label="Filter by booking status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Statuses</option>

            {BOOKING_STATUSES.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* ADD BOOKING */}

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

      {/* TABLE */}

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

              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="event-booking__empty">
                      <p>Loading event bookings...</p>
                    </div>
                  </td>
                </tr>
              ) : bookings.length > 0 ? (

                bookings.map((booking) => {

                  const categoryName =
                    typeof booking.eventCategory === "object"
                      ? booking.eventCategory?.name
                      : "—";

                  const bookingStatus = (
                    booking.status || "PENDING"
                  ).toUpperCase();

                  return (
                    <tr key={booking._id}>

                      {/* BOOKING ID */}

                      <td>
                        <span className="event-booking__booking-id">
                          {booking._id}
                        </span>
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        <div className="event-booking__customer">

                          <span className="event-booking__customer-avatar">
                            {(booking.customerName || "?")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <div className="event-booking__customer-details">
                            <strong>
                              {booking.customerName}
                            </strong>

                            <span>
                              {booking.phone}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* EVENT CATEGORY */}

                      <td>
                        <span className="event-booking__event-type">
                          {categoryName || "—"}
                        </span>
                      </td>

                      {/* EVENT DATE */}

                      <td>
                        <span className="event-booking__date">
                          <CalendarDays size={15} />
                          {formatDate(booking.eventDate)}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`event-booking__status event-booking__status--${bookingStatus.toLowerCase()}`}
                        >
                          <span className="event-booking__status-dot" />

                          {formatStatus(bookingStatus)}
                        </span>

                        <select
                          aria-label={`Change status for ${booking.customerName}`}
                          value={bookingStatus}
                          disabled={statusUpdating}
                          onChange={(event) =>
                            handleStatusChange(
                              booking._id,
                              event.target.value
                            )
                          }
                          style={{
                            display: "block",
                            marginTop: "6px",
                            maxWidth: "135px",
                          }}
                        >
                          {BOOKING_STATUSES.map((item) => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="event-booking__actions">

                          <button
                            type="button"
                            className="event-booking__action-button event-booking__action-button--view"
                            onClick={() =>
                              openDialog("view", booking)
                            }
                            aria-label="View booking"
                            title="View booking"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="event-booking__action-button event-booking__action-button--edit"
                            onClick={() =>
                              openDialog("edit", booking)
                            }
                            aria-label="Edit booking"
                            title="Edit booking"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="event-booking__action-button event-booking__action-button--delete"
                            onClick={() =>
                              openDialog("delete", booking)
                            }
                            aria-label="Delete booking"
                            title="Delete booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })

              ) : (

                /* EMPTY STATE */

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

        {/* PAGINATION */}

        <div className="event-booking__pagination">

          <p>
            Showing <strong>{firstItem}–{lastItem}</strong> of{" "}
            <strong>{total}</strong> bookings
          </p>

          <div className="event-booking__pagination-controls">

            <button
              type="button"
              onClick={() =>
                setPage((previous) => Math.max(1, previous - 1))
              }
              disabled={safePage <= 1 || loading}
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            {pageNumbers.reduce((items, pageNumber, index, pages) => {

              if (
                index > 0 &&
                pageNumber - pages[index - 1] > 1
              ) {
                items.push(
                  <span
                    key={`ellipsis-${pageNumber}`}
                    className="event-booking__pagination-ellipsis"
                  >
                    …
                  </span>
                );
              }

              items.push(
                <button
                  type="button"
                  key={pageNumber}
                  className={
                    safePage === pageNumber
                      ? "event-booking__page-button event-booking__page-button--active"
                      : "event-booking__page-button"
                  }
                  onClick={() => setPage(pageNumber)}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={
                    safePage === pageNumber ? "page" : undefined
                  }
                  disabled={loading}
                >
                  {pageNumber}
                </button>
              );

              return items;
            }, [])}

            <button
              type="button"
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              disabled={safePage >= totalPages || loading}
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>

          </div>
        </div>
      </div>

      {/* EVENT BOOKING DIALOG */}

      <EventBookingDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        bookingData={selectedBooking}
        categories={categories}
        categoriesLoading={categoriesLoading}
        isSaving={creating || updating || deleting}
        onClose={closeDialog}
        onSave={handleSaveBooking}
        onConfirmDelete={handleDeleteBooking}
      />
    </section>
  );
}
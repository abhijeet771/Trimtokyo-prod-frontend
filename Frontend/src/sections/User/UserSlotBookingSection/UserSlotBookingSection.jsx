import { useMemo, useState } from "react";
import {  Search,  SlidersHorizontal,CalendarDays,  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";

import SlotBookingCard from "../../../components/User/SlotBookingCard/SlotBookingCard";
import "./UserSlotBookingSection.scss";

const FILTER_OPTIONS = [
  { label: "All Bookings", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No Show", value: "no-show" },
];

const getBookingStatus = (booking) =>
  String(booking?.status || "pending").toLowerCase().trim();

const isNoShow = (status) =>
  ["no show", "no-show", "noshow", "no_show"].includes(status);

const UserSlotBookingSection = ({
  bookings = [],
  loading = false,
  onViewDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState(5);

  const getFilterCount = (filter) => {
    if (filter === "all") return bookings.length;

    return bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      if (filter === "no-show") return isNoShow(status);

      return status === filter;
    }).length;
  };

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "no-show" && isNoShow(status)) ||
        status === activeFilter;

      const shopName =
        booking?.shop?.name ||
        booking?.shopName ||
        booking?.barber?.shopName ||
        "";

      const serviceName =
        booking?.service?.name ||
        booking?.service?.serviceName ||
        booking?.serviceName ||
        (typeof booking?.service === "string"
          ? booking.service
          : "");

      const bookingId = booking?._id || booking?.bookingId || "";

      const scheduledDate = booking?.scheduledDate
        ? new Date(booking.scheduledDate).toLocaleDateString("en-IN")
        : "";

      const searchableText = [
        shopName,
        serviceName,
        bookingId,
        status,
        scheduledDate,
        booking?.scheduledTime || "",
        booking?.shop?.address || "",
        booking?.shop?.location || "",
        booking?.location || "",
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!query || searchableText.includes(query));
    });

    return [...result].sort((a, b) => {
      const dateA = new Date(a?.scheduledDate || 0).getTime();
      const dateB = new Date(b?.scheduledDate || 0).getTime();

      if (sortOrder === "oldest") return dateA - dateB;

      if (sortOrder === "status") {
        return getBookingStatus(a).localeCompare(getBookingStatus(b));
      }

      return dateB - dateA;
    });
  }, [bookings, activeFilter, searchQuery, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / bookingsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * bookingsPerPage;

  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + bookingsPerPage
  );

  const firstBooking = filteredBookings.length ? startIndex + 1 : 0;

  const lastBooking = Math.min(
    startIndex + bookingsPerPage,
    filteredBookings.length
  );

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )
    .filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        Math.abs(page - safePage) <= 1
    )
    .reduce((result, page, index, visiblePages) => {
      if (
        index > 0 &&
        page - visiblePages[index - 1] > 1
      ) {
        result.push("ellipsis");
      }

      result.push(page);
      return result;
    }, []);

  return (
    <section className="user-slot-booking-section">
      {/* Page heading */}
      <header className="user-slot-booking-section__header">
        <div className="user-slot-booking-section__heading">
          <span className="user-slot-booking-section__eyebrow">
            MY BOOKINGS
          </span>

          <h1>Slot Booking History</h1>

          <p>
            View your past slot bookings, appointment details,
            and service history.
          </p>
        </div>
      </header>

      {/* Bubble filters and search */}
      <div className="user-slot-booking-section__toolbar">
        <div
          className="user-slot-booking-section__filters"
          aria-label="Filter booking history"
        >
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`user-slot-booking-section__filter ${
                activeFilter === filter.value
                  ? "user-slot-booking-section__filter--active"
                  : ""
              }`}
              onClick={() => handleFilterChange(filter.value)}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}

              <span className="user-slot-booking-section__filter-count">
                {getFilterCount(filter.value)}
              </span>
            </button>
          ))}
        </div>

        <div className="user-slot-booking-section__controls">
          <label className="user-slot-booking-section__search">
            <Search size={18} />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by shop, date or service..."
              aria-label="Search booking history"
            />
          </label>

          <label className="user-slot-booking-section__sort">
            <SlidersHorizontal size={17} />

            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort bookings"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="status">Status</option>
            </select>
          </label>
        </div>
      </div>

      {/* Booking history */}
      <div className="user-slot-booking-section__list">
        {loading ? (
          <div className="user-slot-booking-section__state">
            <span className="user-slot-booking-section__loader" />

            <h3>Loading booking history</h3>

            <p>
              Please wait while we retrieve your bookings.
            </p>
          </div>
        ) : paginatedBookings.length > 0 ? (
          paginatedBookings.map((booking) => (
            <SlotBookingCard
              key={booking._id || booking.bookingId}
              booking={booking}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="user-slot-booking-section__state">
            <span className="user-slot-booking-section__empty-icon">
              <CalendarCheck size={28} />
            </span>

            <h3>
              {searchQuery
                ? "No matching bookings"
                : activeFilter === "all"
                  ? "No booking history yet"
                  : `No ${FILTER_OPTIONS.find(
                      (filter) => filter.value === activeFilter
                    )?.label.toLowerCase()} found`}
            </h3>

            <p>
              {searchQuery
                ? "Try another search term or change your filters."
                : "Your past appointments will appear here when booking records are available."}
            </p>

            {(searchQuery || activeFilter !== "all") && (
              <button
                type="button"
                className="user-slot-booking-section__reset-button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredBookings.length > 0 && (
        <footer className="user-slot-booking-section__pagination">
          <p className="user-slot-booking-section__pagination-info">
            <CalendarDays size={15} />

            Showing <strong>{firstBooking}–{lastBooking}</strong>
            {" "}of <strong>{filteredBookings.length}</strong> bookings
          </p>

          <div className="user-slot-booking-section__page-controls">
            <button
              type="button"
              className="user-slot-booking-section__page-button"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="user-slot-booking-section__ellipsis"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={`user-slot-booking-section__page-button ${
                    safePage === page
                      ? "user-slot-booking-section__page-button--active"
                      : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={safePage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              className="user-slot-booking-section__page-button"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <label className="user-slot-booking-section__page-size">
            <span>Rows per page</span>

            <select
              value={bookingsPerPage}
              onChange={(event) => {
                setBookingsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              aria-label="Bookings per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </footer>
      )}
    </section>
  );
};

export default UserSlotBookingSection;

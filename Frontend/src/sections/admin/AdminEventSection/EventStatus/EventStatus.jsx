import React, { useMemo, useState } from "react";
import {
  Clock3,
  CircleCheck,
  CheckCheck,
  CircleX,
  Search,
  ChevronLeft,
  ChevronRight,
  PieChart as PieChartIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import initialBookings from "../EventBooking/EventBooking.js";

import {
  EVENT_STATUS_CONFIG,
  getEventStatusStats,
} from "./EventStatus.js";

import "./EventStatus.scss";


const PAGE_SIZE = 5;

const STATUS_ICONS = {
  Pending: Clock3,
  Confirmed: CircleCheck,
  Completed: CheckCheck,
  Cancelled: CircleX,
};

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

const formatCreatedAt = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="event-status__tooltip">
      <span
        className="event-status__tooltip-dot"
        style={{ background: item.color }}
      />
      <span>{item.name}</span>
      <strong>{item.value}</strong>
      <span className="event-status__tooltip-percentage">
        ({item.percentage}%)
      </span>
    </div>
  );
};

export default function EventStatus() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const statusStats = useMemo(
    () => getEventStatusStats(bookings),
    [bookings]
  );

  const totalBookings = bookings.length;

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

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedBookings = filteredBookings.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const firstItem =
    filteredBookings.length === 0
      ? 0
      : (safePage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    safePage * PAGE_SIZE,
    filteredBookings.length
  );

  const chartData = statusStats.map((item) => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
    color: item.color,
  }));

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - safePage) <= 1
  );

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  return (
    <section className="event-status">
      {/* Four status KPI cards */}
      <div className="event-status__stats">
        {EVENT_STATUS_CONFIG.map((status) => {
          const Icon = STATUS_ICONS[status.key];
          const stat = statusStats.find(
            (item) => item.key === status.key
          );

          return (
            <button
              type="button"
              key={status.key}
              className={`event-status__stat-card event-status__stat-card--${status.key.toLowerCase()} ${
                statusFilter === status.key
                  ? "event-status__stat-card--selected"
                  : ""
              }`}
              onClick={() => {
                setStatusFilter((previous) =>
                  previous === status.key ? "All" : status.key
                );
                setCurrentPage(1);
              }}
              aria-pressed={statusFilter === status.key}
            >
              <div className="event-status__stat-top">
                <span className="event-status__stat-icon">
                  <Icon size={22} />
                </span>

                <span className="event-status__stat-percentage">
                  {stat?.percentage ?? 0}%
                </span>
              </div>

              <div className="event-status__stat-details">
                <span>{status.label}</span>
                <strong>{stat?.count ?? 0}</strong>
                <p>{status.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Booking status pie chart */}
      <article className="event-status__chart-card">
        <div className="event-status__chart-header">
          <span className="event-status__chart-icon">
            <PieChartIcon size={20} />
          </span>

          <div>
            <h3>Bookings by Status</h3>
            <p>Distribution of event bookings across statuses</p>
          </div>
        </div>

        <div className="event-status__chart-content">
          <div className="event-status__pie-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="59%"
                  outerRadius="82%"
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="event-status__pie-center">
              <strong>{totalBookings}</strong>
              <span>Total Bookings</span>
            </div>
          </div>

          <div className="event-status__legend">
            {statusStats.map((item) => (
              <button
                type="button"
                className={`event-status__legend-item ${
                  statusFilter === item.key
                    ? "event-status__legend-item--selected"
                    : ""
                }`}
                key={item.key}
                onClick={() => {
                  setStatusFilter((previous) =>
                    previous === item.key ? "All" : item.key
                  );
                  setCurrentPage(1);
                }}
              >
                <span
                  className="event-status__legend-dot"
                  style={{ backgroundColor: item.color }}
                />

                <span className="event-status__legend-name">
                  {item.label}
                </span>

                <strong>{item.count}</strong>

                <span className="event-status__legend-percentage">
                  {item.percentage}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </article>

      {/* Booking table */}
      <div className="event-status__table-section">
        <div className="event-status__toolbar">
          <div className="event-status__search">
            <Search size={18} />

            <input
              type="search"
              value={searchTerm}
              placeholder="Search booking ID, customer or event..."
              aria-label="Search bookings"
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="event-status__filter"
            value={statusFilter}
            aria-label="Filter by booking status"
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>

            {EVENT_STATUS_CONFIG.map((status) => (
              <option key={status.key} value={status.key}>
                {status.label}
              </option>
            ))}
          </select>

          {(searchTerm || statusFilter !== "All") && (
            <button
              type="button"
              className="event-status__clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        <div className="event-status__table-card">
          <div className="event-status__table-wrapper">
            <table className="event-status__table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBookings.length > 0 ? (
                  paginatedBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <span className="event-status__booking-id">
                          {booking.bookingId}
                        </span>
                      </td>

                      <td>
                        <div className="event-status__customer">
                          <span className="event-status__avatar">
                            {(booking.customerName || "?")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <div>
                            <strong>{booking.customerName}</strong>
                            <span>{booking.phoneNumber}</span>
                          </div>
                        </div>
                      </td>

                      <td>{booking.eventType}</td>

                      <td>{formatDate(booking.eventDate)}</td>

                      <td>
                        <span
                          className={`event-status__badge event-status__badge--${(
                            booking.status || "pending"
                          ).toLowerCase()}`}
                        >
                          <span />
                          {booking.status}
                        </span>
                      </td>

                      <td className="event-status__created-at">
                        {formatCreatedAt(booking.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="event-status__empty">
                        <Search size={24} />
                        <strong>No bookings found</strong>
                        <span>
                          Try changing the search or status filter.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination: five records per page */}
          <div className="event-status__pagination">
            <p>
              Showing <strong>{firstItem}–{lastItem}</strong> of{" "}
              <strong>{filteredBookings.length}</strong> bookings
            </p>

            <div className="event-status__pagination-controls">
              <button
                type="button"
                aria-label="Previous page"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
              >
                <ChevronLeft size={17} />
              </button>

              {pageNumbers.reduce((items, page, index, pages) => {
                if (
                  index > 0 &&
                  page - pages[index - 1] > 1
                ) {
                  items.push(
                    <span
                      key={`ellipsis-${page}`}
                      className="event-status__ellipsis"
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
                        ? "event-status__page event-status__page--active"
                        : "event-status__page"
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
                aria-label="Next page"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import {  Search,  SlidersHorizontal,  RotateCcw,  ChevronLeft,  ChevronRight,  Ticket,  CalendarDays,  Trash2,
  Pencil,  X,  Save,  AlertCircle,} from "lucide-react";

import {  SUPPORT_TICKET_TABLE_TEXT,  SUPPORT_TICKET_STATUS_OPTIONS,  SUPPORT_TICKET_PRIORITY_OPTIONS,
  SUPPORT_TICKET_PAGE_SIZE,  SUPPORT_TICKET_STATUS_LABELS,  SUPPORT_TICKET_PRIORITY_LABELS,  formatSupportTicketDate,
} from "../../constants/barberSupportTicketsTable";

import useBarberSupport from "../../hooks/barber/useBarberSupport";
import useBarberSupportStats from "../../hooks/barber/useBarberSupportStats";

import "./BarberSupportTicketsTable.scss";

const BarberSupportTicketsTable = () => {
  const { tickets, pagination, params, loading, actionLoading,
    error, updateParams, fetchTickets, updateTicket, deleteTicket,
  } = useBarberSupport({
    page: 1,
    limit: SUPPORT_TICKET_PAGE_SIZE,
  });

  const { refreshStats } = useBarberSupportStats();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [editingTicket, setEditingTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({
        search,
        status: statusFilter,
        priority: priorityFilter,
        limit: SUPPORT_TICKET_PAGE_SIZE,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    statusFilter,
    priorityFilter,
    updateParams,
  ]);

  const totalPages = pagination.totalPages || 0;
  const currentPage = pagination.page || params.page || 1;
  const totalTickets = pagination.total || 0;

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");

    updateParams({
      page: 1,
      search: "",
      status: "ALL",
      priority: "ALL",
      limit: SUPPORT_TICKET_PAGE_SIZE,
    });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  const handleEdit = (ticket) => {
    setMessage("");
    setMessageType("");

    setEditingTicket({
      _id: ticket._id,
      title: ticket.title || "",
      category: ticket.category || "",
      description: ticket.description || "",
      priority: ticket.priority || "MEDIUM",
      status: ticket.status || "OPEN",
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editingTicket) return;

    try {
      setMessage("");
      setMessageType("");

      await updateTicket(editingTicket._id, {
        title: editingTicket.title,
        category: editingTicket.category,
        description: editingTicket.description,
        priority: editingTicket.priority,
        status: editingTicket.status,
      });

      await refreshStats();

      setEditingTicket(null);
      setMessageType("success");
      setMessage("Support ticket updated successfully.");
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.message ||
          "Failed to update support ticket."
      );
    }
  };

  const handleDelete = async (ticket) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${ticket.title}"?`
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setMessageType("");

      await deleteTicket(ticket._id);
      await refreshStats();

      setMessageType("success");
      setMessage("Support ticket deleted successfully.");
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.message ||
          "Failed to delete support ticket."
      );
    }
  };

  const formatStatus = (status) =>
    SUPPORT_TICKET_STATUS_LABELS[status] ||
    status?.replace(/_/g, " ") ||
    "Unknown";

  const formatPriority = (priority) =>
    SUPPORT_TICKET_PRIORITY_LABELS[priority] ||
    priority ||
    "Medium";

  return (
    <section className="barber-support-tickets">
      {/* Heading */}
      <header className="barber-support-tickets__header">
        <div className="barber-support-tickets__header-icon">
          <Ticket size={25} />
        </div>

        <div>
          <h2>{SUPPORT_TICKET_TABLE_TEXT.title}</h2>
          <p>{SUPPORT_TICKET_TABLE_TEXT.subtitle}</p>
        </div>
      </header>

      {/* Search */}
      <div className="barber-support-tickets__search">
        <Search size={21} />

        <input
          type="search"
          value={search}
          placeholder={
            SUPPORT_TICKET_TABLE_TEXT.searchPlaceholder
          }
          aria-label="Search support tickets"
          onChange={(event) => setSearch(event.target.value)}
        />

        {search && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="barber-support-tickets__filters">
        <label className="barber-support-tickets__filter">
          <span>
            <SlidersHorizontal size={15} />
            {SUPPORT_TICKET_TABLE_TEXT.statusLabel}
          </span>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            {SUPPORT_TICKET_STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={
                  option.value === "all"
                    ? "ALL"
                    : option.value
                }
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="barber-support-tickets__filter">
          <span>
            <SlidersHorizontal size={15} />
            {SUPPORT_TICKET_TABLE_TEXT.priorityLabel}
          </span>

          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
          >
            {SUPPORT_TICKET_PRIORITY_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={
                  option.value === "all"
                    ? "ALL"
                    : option.value
                }
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="barber-support-tickets__reset"
          onClick={resetFilters}
        >
          <RotateCcw size={15} />
          {SUPPORT_TICKET_TABLE_TEXT.reset}
        </button>
      </div>

      {/* Feedback */}
      {(message || error) && (
        <div
          className={`barber-support-tickets__message barber-support-tickets__message--${
            messageType || "error"
          }`}
          role="status"
        >
          <AlertCircle size={17} />
          <span>{message || error}</span>
        </div>
      )}

      {/* Results */}
      <div className="barber-support-tickets__results">
        <span>
          <strong>{totalTickets}</strong>{" "}
          {totalTickets === 1 ? "ticket" : "tickets"} found
        </span>

        <span>
          {totalTickets > 0
            ? `Page ${safePage} of ${totalPages}`
            : "Page 0 of 0"}
        </span>
      </div>

      {/* Table */}
      <div className="barber-support-tickets__table-wrapper">
        <table className="barber-support-tickets__table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Issue Category</th>
              <th>Date Raised</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="barber-support-tickets__empty"
                >
                  Loading support tickets...
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>
                    <div className="barber-support-tickets__ticket-id">
                      #{String(ticket._id).slice(-8).toUpperCase()}
                    </div>

                    <div className="barber-support-tickets__ticket-title">
                      {ticket.title}
                    </div>
                  </td>

                  <td>
                    <span className="barber-support-tickets__category">
                      {ticket.category}
                    </span>
                  </td>

                  <td>
                    <span className="barber-support-tickets__date">
                      <CalendarDays size={15} />
                      {formatSupportTicketDate(
                        ticket.createdAt
                      )}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`barber-support-tickets__priority barber-support-tickets__priority--${ticket.priority?.toLowerCase()}`}
                    >
                      <span className="barber-support-tickets__dot" />
                      {formatPriority(ticket.priority)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`barber-support-tickets__status barber-support-tickets__status--${ticket.status?.toLowerCase()}`}
                    >
                      {formatStatus(ticket.status)}
                    </span>
                  </td>

                  <td>
                    <div className="barber-support-tickets__actions">
                      <button
                        type="button"
                        aria-label="Edit ticket"
                        title="Edit ticket"
                        disabled={actionLoading}
                        onClick={() => handleEdit(ticket)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label="Delete ticket"
                        title="Delete ticket"
                        disabled={actionLoading}
                        onClick={() => handleDelete(ticket)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="barber-support-tickets__empty"
                >
                  <Ticket size={31} />

                  <strong>
                    {SUPPORT_TICKET_TABLE_TEXT.emptyTitle}
                  </strong>

                  <span>
                    {SUPPORT_TICKET_TABLE_TEXT.emptyDescription}
                  </span>

                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalTickets > 0 && totalPages > 1 && (
        <footer className="barber-support-tickets__pagination">
          <span className="barber-support-tickets__pagination-info">
            Showing {(safePage - 1) * SUPPORT_TICKET_PAGE_SIZE + 1}–
            {Math.min(
              safePage * SUPPORT_TICKET_PAGE_SIZE,
              totalTickets
            )}{" "}
            of {totalTickets} tickets
          </span>

          <div className="barber-support-tickets__pagination-controls">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage === 1 || loading}
              onClick={() => handlePageChange(safePage - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                className={safePage === page ? "is-active" : ""}
                aria-label={`Page ${page}`}
                aria-current={
                  safePage === page ? "page" : undefined
                }
                disabled={loading}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              aria-label="Next page"
              disabled={safePage === totalPages || loading}
              onClick={() => handlePageChange(safePage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      )}

      {/* Edit Ticket Dialog */}
      {editingTicket && (
        <div
          className="barber-support-tickets__modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingTicket(null);
            }
          }}
        >
          <form
            className="barber-support-tickets__edit-modal"
            onSubmit={handleSave}
          >
            <div className="barber-support-tickets__edit-header">
              <h3>Edit Support Ticket</h3>

              <button
                type="button"
                aria-label="Close edit dialog"
                onClick={() => setEditingTicket(null)}
              >
                <X size={20} />
              </button>
            </div>

            <label>
              Ticket Title
              <input
                value={editingTicket.title}
                maxLength={150}
                required
                onChange={(event) =>
                  setEditingTicket((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Category
              <input
                value={editingTicket.category}
                maxLength={100}
                required
                onChange={(event) =>
                  setEditingTicket((previous) => ({
                    ...previous,
                    category: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Description
              <textarea
                value={editingTicket.description}
                maxLength={5000}
                rows={4}
                required
                onChange={(event) =>
                  setEditingTicket((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Priority
              <select
                value={editingTicket.priority}
                onChange={(event) =>
                  setEditingTicket((previous) => ({
                    ...previous,
                    priority: event.target.value,
                  }))
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>

            <label>
              Status
              <select
                value={editingTicket.status}
                onChange={(event) =>
                  setEditingTicket((previous) => ({
                    ...previous,
                    status: event.target.value,
                  }))
                }
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </label>

            <div className="barber-support-tickets__edit-actions">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setEditingTicket(null)}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={actionLoading}
              >
                <Save size={16} />
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default BarberSupportTicketsTable;

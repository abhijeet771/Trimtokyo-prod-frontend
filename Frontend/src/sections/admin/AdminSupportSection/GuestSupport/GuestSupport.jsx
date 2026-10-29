import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import "./GuestSupport.scss";
import useAdminGuestSupport from "../../../../hooks/admin/useAdminGuestSupport.js";

const PAGE_SIZE = 5;

const GuestSupport = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const {
    tickets = [],
    pagination = {},
    loading,
    detailsLoading,
    actionLoading,
    error,
    fetchTickets,
    fetchSummary,
    fetchTicketById,
    updateTicket,
    clearSelectedTicket,
    selectedTicket: apiSelectedTicket,
  } = useAdminGuestSupport();

  useEffect(() => {
    fetchTickets({
      page,
      limit: PAGE_SIZE,
      search: search.trim(),
      ...(statusFilter !== "all" ? { status: statusFilter.toUpperCase() } : {}),
    });
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (apiSelectedTicket) {
      setSelectedTicket(apiSelectedTicket);
    }
  }, [apiSelectedTicket]);

  const totalTickets =
    pagination.total ??
    pagination.totalTickets ??
    tickets.length;

  const totalPages = Math.max(
    1,
    pagination.totalPages ??
      Math.ceil(totalTickets / PAGE_SIZE)
  );

  const currentPage = pagination.page ?? page;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);

    if (fetchTicketById && ticket._id) {
      await fetchTicketById(ticket._id);
    }
  };

  const handleResolve = async (ticketId) => {
    const result = await updateTicket(ticketId, {
      status: "RESOLVED",
    });

    if (result?.success) {
      setSelectedTicket((previous) =>
        previous?._id === ticketId
          ? { ...previous, status: "RESOLVED" }
          : previous
      );

      await fetchTickets({
        page,
        limit: PAGE_SIZE,
        search: search.trim(),
        ...(statusFilter !== "all" ? { status: statusFilter.toUpperCase() } : {}),
      });

      await fetchSummary();
    }
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    clearSelectedTicket?.();
  };

  const formatStatus = (status) =>
    (status || "PENDING")
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

  const getTicketId = (ticket) =>
    ticket.ticketId || ticket._id?.slice(-8)?.toUpperCase() || "—";

  const isResolved = (status) =>
    status?.toUpperCase() === "RESOLVED";

  return (
    <section className="guest-support">
      <header className="guest-support__header">
        <div className="guest-support__title-group">
          <div className="guest-support__icon">
            <MessageCircle size={22} />
          </div>

          <div>
            <h3>Guest Support Requests</h3>
            <p>View and manage support requests submitted by guests.</p>
          </div>
        </div>

        <div className="guest-support__count">
          {totalTickets} Requests
        </div>
      </header>

      <div className="guest-support__toolbar">
        <div className="guest-support__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search name, email, title or ticket ID..."
            value={search}
            onChange={handleSearchChange}
            aria-label="Search guest support requests"
          />
        </div>

        <select
          className="guest-support__filter"
          value={statusFilter}
          onChange={handleStatusChange}
          aria-label="Filter by ticket status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {error && (
        <div className="guest-support__error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="guest-support__table-wrapper">
        <table className="guest-support__table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Guest Details</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="guest-support__empty">
                    <LoaderCircle size={25} className="guest-support__spinner" />
                    <strong>Loading support requests...</strong>
                  </div>
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => {
                const resolved = isResolved(ticket.status);

                return (
                  <tr key={ticket._id}>
                    <td>
                      <span className="guest-support__ticket-id">
                        {getTicketId(ticket)}
                      </span>
                    </td>

                    <td>
                      <div className="guest-support__guest">
                        <strong>{ticket.fullName || ticket.name || "—"}</strong>
                        <span>{ticket.email || "—"}</span>
                        <span>{ticket.phone || "—"}</span>
                      </div>
                    </td>

                    <td className="guest-support__subject">
                      {ticket.title || "—"}
                    </td>

                    <td>
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`guest-support__status guest-support__status--${(
                          ticket.status || "pending"
                        ).toLowerCase()}`}
                      >
                        {resolved ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}
                        {formatStatus(ticket.status)}
                      </span>
                    </td>

                    <td>
                      <div className="guest-support__actions">
                        <button
                          type="button"
                          className="guest-support__action guest-support__action--view"
                          onClick={() => handleViewTicket(ticket)}
                          title="View ticket"
                          aria-label={`View ticket ${getTicketId(ticket)}`}
                        >
                          <Eye size={17} />
                        </button>

                        {!resolved && ticket.status?.toUpperCase() !== "CLOSED" && (
                          <button
                            type="button"
                            className="guest-support__action guest-support__action--resolve"
                            onClick={() => handleResolve(ticket._id)}
                            disabled={actionLoading}
                            title="Mark as resolved"
                            aria-label="Mark ticket as resolved"
                          >
                            <CheckCircle2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="guest-support__empty">
                    <MessageCircle size={30} />
                    <strong>No guest support requests</strong>
                    <span>
                      {search || statusFilter !== "all"
                        ? "Try changing your search or status filter."
                        : "Guest requests will appear here when submitted."}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalTickets > 0 && (
        <div className="guest-support__pagination">
          <span className="guest-support__pagination-info">
            Page {currentPage} of {totalPages} · {totalTickets} requests
          </span>

          <div className="guest-support__pagination-actions">
            <button
              type="button"
              className="guest-support__page-button"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={page <= 1 || loading}
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="guest-support__page-number">
              {currentPage}
            </span>

            <button
              type="button"
              className="guest-support__page-button"
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              disabled={page >= totalPages || loading}
              aria-label="Next page"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div
          className="guest-support__modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <section
            className="guest-support__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-support-modal-title"
          >
            <header className="guest-support__modal-header">
              <div>
                <span>GUEST SUPPORT</span>
                <h3 id="guest-support-modal-title">
                  {selectedTicket.title || "Support Request"}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </header>

            <div className="guest-support__modal-body">
              {detailsLoading && (
                <p>Loading ticket details...</p>
              )}

              <div>
                <span>Ticket ID</span>
                <strong>{getTicketId(selectedTicket)}</strong>
              </div>

              <div>
                <span>Guest Name</span>
                <strong>
                  {selectedTicket.fullName || selectedTicket.name || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedTicket.email || "—"}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{selectedTicket.phone || "—"}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{formatStatus(selectedTicket.status)}</strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {selectedTicket.createdAt
                    ? new Date(selectedTicket.createdAt).toLocaleString()
                    : "—"}
                </strong>
              </div>

              <div className="guest-support__modal-description">
                <span>Message</span>
                <p>
                  {selectedTicket.message ||
                    selectedTicket.description ||
                    "No message provided."}
                </p>
              </div>

              {selectedTicket.adminResponse && (
                <div className="guest-support__modal-description">
                  <span>Admin Response</span>
                  <p>{selectedTicket.adminResponse}</p>
                </div>
              )}
            </div>

            <footer className="guest-support__modal-footer">
              <button
                type="button"
                className="guest-support__close-button"
                onClick={handleCloseModal}
              >
                Close
              </button>

              {!isResolved(selectedTicket.status) &&
                selectedTicket.status?.toUpperCase() !== "CLOSED" && (
                  <button
                    type="button"
                    className="guest-support__resolve-button"
                    onClick={() => handleResolve(selectedTicket._id)}
                    disabled={actionLoading}
                  >
                    <CheckCircle2 size={17} />
                    {actionLoading ? "Updating..." : "Mark as Resolved"}
                  </button>
                )}
            </footer>
          </section>
        </div>
      )}
    </section>
  );
};

export default GuestSupport;
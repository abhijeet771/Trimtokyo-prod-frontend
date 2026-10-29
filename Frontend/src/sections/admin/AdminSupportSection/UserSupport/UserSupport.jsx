import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import "./UserSupport.scss";
import useAdminUserSupport from "../../../../hooks/admin/useAdminUserSupport.js";

const PAGE_SIZE = 5;

const UserSupport = () => {
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
  } = useAdminUserSupport();

  const loadTickets = useCallback(() => {
    return fetchTickets({
      page,
      limit: PAGE_SIZE,
      search: search.trim(),
      ...(statusFilter !== "all"
        ? { status: statusFilter.toUpperCase() }
        : {}),
    });
  }, [fetchTickets, page, search, statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const totalTickets = Number(pagination.total) || 0;

  const totalPages = Math.max(
    1,
    Number(pagination.totalPages) ||
      Math.ceil(totalTickets / PAGE_SIZE)
  );

  const currentPage = Number(pagination.page) || page;

  const getUserDetails = (ticket) => {
    const user =
      ticket.userId && typeof ticket.userId === "object"
        ? ticket.userId
        : {};

    return {
      name: user.name || user.fullName || ticket.userName || ticket.name || "—",
      email: user.email || ticket.email || "—",
      phone: user.phone || ticket.phone || "",
    };
  };

  const getTicketId = (ticket) =>
    ticket.ticketId ||
    ticket._id?.slice(-8)?.toUpperCase() ||
    "—";

  const getStatus = (status) =>
    (status || "PENDING").toUpperCase();

  const formatStatus = (status) =>
    getStatus(status)
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);

    if (ticket._id) {
      await fetchTicketById(ticket._id);
    }
  };

  const handleResolve = async (ticketId) => {
    const result = await updateTicket(ticketId, {
      status: "RESOLVED",
    });

    if (!result?.success) {
      return;
    }

    setSelectedTicket((previous) =>
      previous?._id === ticketId
        ? { ...previous, status: "RESOLVED" }
        : previous
    );

    await loadTickets();
    await fetchSummary();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    clearSelectedTicket?.();
  };

  return (
    <section className="user-support">
      <header className="user-support__header">
        <div className="user-support__title-group">
          <div className="user-support__icon">
            <Users size={22} />
          </div>

          <div>
            <h3>User Support Requests</h3>
            <p>
              Review and manage support requests submitted by users.
            </p>
          </div>
        </div>

        <div className="user-support__count">
          {totalTickets} Requests
        </div>
      </header>

      <div className="user-support__toolbar">
        <div className="user-support__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search user, email, subject or ticket ID..."
            value={search}
            onChange={handleSearchChange}
            aria-label="Search user support requests"
          />
        </div>

        <select
          className="user-support__filter"
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
        <div className="user-support__error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="user-support__table-wrapper">
        <table className="user-support__table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User Details</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="user-support__empty">
                    <LoaderCircle
                      size={25}
                      className="user-support__spinner"
                    />
                    <strong>Loading support requests...</strong>
                  </div>
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => {
                const status = getStatus(ticket.status);
                const resolved = status === "RESOLVED";
                const closed = status === "CLOSED";
                const user = getUserDetails(ticket);

                return (
                  <tr key={ticket._id}>
                    <td>
                      <span className="user-support__ticket-id">
                        {getTicketId(ticket)}
                      </span>
                    </td>

                    <td>
                      <div className="user-support__user">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                        {user.phone && <span>{user.phone}</span>}
                      </div>
                    </td>

                    <td className="user-support__subject">
                      {ticket.subject || ticket.title || "—"}
                    </td>

                    <td>{ticket.category || "—"}</td>

                    <td>
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`user-support__status user-support__status--${status.toLowerCase()}`}
                      >
                        {resolved ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}

                        {formatStatus(status)}
                      </span>
                    </td>

                    <td>
                      <div className="user-support__actions">
                        <button
                          type="button"
                          className="user-support__action user-support__action--view"
                          onClick={() => handleViewTicket(ticket)}
                          title="View ticket"
                          aria-label={`View ticket ${getTicketId(ticket)}`}
                        >
                          <Eye size={17} />
                        </button>

                        {!resolved && !closed && (
                          <button
                            type="button"
                            className="user-support__action user-support__action--resolve"
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
                <td colSpan={7}>
                  <div className="user-support__empty">
                    <MessageCircle size={30} />
                    <strong>No user support requests</strong>
                    <span>
                      {search || statusFilter !== "all"
                        ? "Try changing your search or status filter."
                        : "User support tickets will appear here when submitted."}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalTickets > 0 && (
        <div className="user-support__pagination">
          <span className="user-support__pagination-info">
            Page {currentPage} of {totalPages} · {totalTickets} requests
          </span>

          <div className="user-support__pagination-actions">
            <button
              type="button"
              className="user-support__page-button"
              onClick={() =>
                setPage((previous) => Math.max(1, previous - 1))
              }
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="user-support__page-number">
              {currentPage}
            </span>

            <button
              type="button"
              className="user-support__page-button"
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div
          className="user-support__modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="user-support__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-support-modal-title"
          >
            <header className="user-support__modal-header">
              <div>
                <span>USER SUPPORT</span>
                <h3 id="user-support-modal-title">
                  {selectedTicket.subject ||
                    selectedTicket.title ||
                    "Support Request"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close ticket details"
              >
                <X size={20} />
              </button>
            </header>

            <div className="user-support__modal-body">
              {detailsLoading && (
                <p>Loading ticket details...</p>
              )}

              {(() => {
                const user = getUserDetails(selectedTicket);

                return (
                  <>
                    <div>
                      <span>Ticket ID</span>
                      <strong>{getTicketId(selectedTicket)}</strong>
                    </div>

                    <div>
                      <span>User Name</span>
                      <strong>{user.name}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{user.email}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{user.phone || "—"}</strong>
                    </div>
                  </>
                );
              })()}

              <div>
                <span>Category</span>
                <strong>{selectedTicket.category || "—"}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{formatStatus(selectedTicket.status)}</strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {selectedTicket.createdAt
                    ? new Date(selectedTicket.createdAt).toLocaleString("en-IN")
                    : "—"}
                </strong>
              </div>

              <div className="user-support__modal-description">
                <span>Message</span>
                <p>
                  {selectedTicket.message ||
                    selectedTicket.description ||
                    "No message provided."}
                </p>
              </div>

              {selectedTicket.adminResponse && (
                <div className="user-support__modal-description">
                  <span>Admin Response</span>
                  <p>{selectedTicket.adminResponse}</p>
                </div>
              )}
            </div>

            <footer className="user-support__modal-footer">
              <button
                type="button"
                className="user-support__close-button"
                onClick={closeModal}
              >
                Close
              </button>

              {!["RESOLVED", "CLOSED"].includes(
                getStatus(selectedTicket.status)
              ) && (
                <button
                  type="button"
                  className="user-support__resolve-button"
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

export default UserSupport;
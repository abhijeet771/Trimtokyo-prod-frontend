
import React, { useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Scissors,
  X,
  Trash2,
  RefreshCw,
} from "lucide-react";

import useAdminBarberSupport from "../../../../hooks/admin/useAdminBarberSupport.js";
import "./BarberSupport.scss";

const BarberSupport = () => {
  const {
    tickets,
    pagination,
    stats,
    params,
    loading,
    actionLoading,
    error,
    setError,
    updateParams,
    fetchTickets,
    fetchStats,
    fetchTicketById,
    updateTicket,
    deleteTicket,
  } = useAdminBarberSupport();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const barberDetails = (ticket) => {
    const barber = ticket?.barberId;
    const account = barber?.userId;

    return {
      name: account?.name || "—",
      email: account?.email || "—",
      phone: barber?.phone || account?.phone || "—",
      shopName: barber?.shopName || "—",
      city: barber?.city || "—",
    };
  };

  const getTicketId = (ticket) =>
    ticket?._id ? String(ticket._id).slice(-8).toUpperCase() : "—";

  const getStatusLabel = (status) =>
    ({
      OPEN: "Open",
      IN_PROGRESS: "In Progress",
      RESOLVED: "Resolved",
    })[status] || status || "—";

  const getStatusClass = (status) =>
    (status || "OPEN").toLowerCase().replace("_", "-");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setDetailsLoading(true);
    setError("");

    try {
      const detailedTicket = await fetchTicketById(ticket._id);
      setSelectedTicket(detailedTicket);
    } catch {
      // The hook exposes the API error.
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      await updateTicket(ticketId, { status: "RESOLVED" });

      setSelectedTicket((previous) =>
        previous?._id === ticketId
          ? { ...previous, status: "RESOLVED" }
          : previous
      );
    } catch {
      // The hook exposes the API error.
    }
  };

  const handleDelete = async (ticketId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this support ticket?"
      )
    ) {
      return;
    }

    try {
      await deleteTicket(ticketId);

      setSelectedTicket((previous) =>
        previous?._id === ticketId ? null : previous
      );
    } catch {
      // The hook exposes the API error.
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      fetchTickets().catch(() => {}),
      fetchStats().catch(() => {}),
    ]);
  };

  return (
    <section className="barber-support">
      <header className="barber-support__header">
        <div className="barber-support__title-group">
          <div className="barber-support__icon">
            <Scissors size={22} />
          </div>

          <div>
            <h3>Barber Support Requests</h3>
            <p>
              Review and manage support requests submitted by barbers.
            </p>
          </div>
        </div>

        <div className="barber-support__count">
          {stats.totalTickets ?? pagination.total} Requests
        </div>
      </header>

      <div className="barber-support__summary">
        <div>
          <span>Total Tickets</span>
          <strong>{stats.totalTickets ?? 0}</strong>
        </div>
        <div>
          <span>Open</span>
          <strong>{stats.openTickets ?? 0}</strong>
        </div>
        <div>
          <span>In Progress</span>
          <strong>{stats.inProgressTickets ?? 0}</strong>
        </div>
        <div>
          <span>Resolved</span>
          <strong>{stats.resolvedTickets ?? 0}</strong>
        </div>
      </div>

      <div className="barber-support__toolbar">
        <div className="barber-support__search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search barber, shop, email or ticket..."
            value={params.search}
            onChange={(event) =>
              updateParams({ search: event.target.value })
            }
            aria-label="Search barber support requests"
          />
        </div>

        <select
          className="barber-support__filter"
          value={params.status}
          onChange={(event) =>
            updateParams({ status: event.target.value })
          }
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select
          className="barber-support__filter"
          value={params.priority}
          onChange={(event) =>
            updateParams({ priority: event.target.value })
          }
          aria-label="Filter by priority"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <button
          type="button"
          className="barber-support__refresh"
          onClick={handleRefresh}
          disabled={loading || actionLoading}
          title="Refresh tickets"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {error && (
        <div className="barber-support__error" role="alert">
          {error}
        </div>
      )}

      <div className="barber-support__table-wrapper">
        <table className="barber-support__table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Barber Details</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="barber-support__empty">
                    Loading barber support tickets...
                  </div>
                </td>
              </tr>
            ) : tickets.length ? (
              tickets.map((ticket) => {
                const barber = barberDetails(ticket);
                const isResolved = ticket.status === "RESOLVED";

                return (
                  <tr key={ticket._id}>
                    <td>
                      <span className="barber-support__ticket-id">
                        #{getTicketId(ticket)}
                      </span>
                    </td>

                    <td>
                      <div className="barber-support__barber">
                        <strong>{barber.name}</strong>
                        <span>{barber.shopName}</span>
                        <span>{barber.email}</span>
                      </div>
                    </td>

                    <td className="barber-support__subject">
                      {ticket.title || "—"}
                    </td>

                    <td>{ticket.category || "—"}</td>
                    <td>{ticket.priority || "MEDIUM"}</td>
                    <td>{formatDate(ticket.createdAt)}</td>

                    <td>
                      <span
                        className={`barber-support__status barber-support__status--${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {isResolved ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>

                    <td>
                      <div className="barber-support__actions">
                        <button
                          type="button"
                          className="barber-support__action barber-support__action--view"
                          onClick={() => handleViewTicket(ticket)}
                          title="View ticket"
                          aria-label="View ticket"
                        >
                          <Eye size={17} />
                        </button>

                        {!isResolved && (
                          <button
                            type="button"
                            className="barber-support__action barber-support__action--resolve"
                            onClick={() => handleResolve(ticket._id)}
                            disabled={actionLoading}
                            title="Mark as resolved"
                            aria-label="Resolve ticket"
                          >
                            <CheckCircle2 size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="barber-support__action"
                          onClick={() => handleDelete(ticket._id)}
                          disabled={actionLoading}
                          title="Delete ticket"
                          aria-label="Delete ticket"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8}>
                  <div className="barber-support__empty">
                    <MessageCircle size={30} />
                    <strong>No barber support requests</strong>
                    <span>
                      No tickets match the current search and filters.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && pagination.totalPages > 0 && (
        <div className="barber-support__pagination">
          <span>
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} tickets
          </span>

          <div>
            <button
              type="button"
              disabled={params.page <= 1 || loading}
              onClick={() =>
                updateParams({ page: params.page - 1 })
              }
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                params.page >= pagination.totalPages || loading
              }
              onClick={() =>
                updateParams({ page: params.page + 1 })
              }
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedTicket && (
        <div
          className="barber-support__modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTicket(null);
            }
          }}
        >
          <section
            className="barber-support__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="barber-support-modal-title"
          >
            <header className="barber-support__modal-header">
              <div>
                <span>BARBER SUPPORT</span>
                <h3 id="barber-support-modal-title">
                  {selectedTicket.title || "Support Request"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                aria-label="Close ticket details"
              >
                <X size={20} />
              </button>
            </header>

            <div className="barber-support__modal-body">
              {detailsLoading ? (
                <p>Loading ticket details...</p>
              ) : (
                <>
                  {(() => {
                    const barber = barberDetails(selectedTicket);

                    return (
                      <>
                        <div>
                          <span>Ticket ID</span>
                          <strong>#{getTicketId(selectedTicket)}</strong>
                        </div>
                        <div>
                          <span>Barber Name</span>
                          <strong>{barber.name}</strong>
                        </div>
                        <div>
                          <span>Shop Name</span>
                          <strong>{barber.shopName}</strong>
                        </div>
                        <div>
                          <span>Email</span>
                          <strong>{barber.email}</strong>
                        </div>
                        <div>
                          <span>Phone</span>
                          <strong>{barber.phone}</strong>
                        </div>
                        <div>
                          <span>City</span>
                          <strong>{barber.city}</strong>
                        </div>
                      </>
                    );
                  })()}

                  <div>
                    <span>Category</span>
                    <strong>{selectedTicket.category || "—"}</strong>
                  </div>
                  <div>
                    <span>Priority</span>
                    <strong>{selectedTicket.priority || "MEDIUM"}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{getStatusLabel(selectedTicket.status)}</strong>
                  </div>
                  <div>
                    <span>Created</span>
                    <strong>{formatDate(selectedTicket.createdAt)}</strong>
                  </div>

                  <div className="barber-support__modal-description">
                    <span>Description</span>
                    <p>
                      {selectedTicket.description ||
                        "No description provided."}
                    </p>
                  </div>
                </>
              )}
            </div>

            <footer className="barber-support__modal-footer">
              <button
                type="button"
                className="barber-support__close-button"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>

              {selectedTicket.status !== "RESOLVED" && (
                <button
                  type="button"
                  className="barber-support__resolve-button"
                  disabled={actionLoading || detailsLoading}
                  onClick={() => handleResolve(selectedTicket._id)}
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

export default BarberSupport;

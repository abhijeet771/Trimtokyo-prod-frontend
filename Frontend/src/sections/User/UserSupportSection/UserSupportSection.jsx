import React, { useEffect, useState } from "react";
import {
  Send,
  MessageCircle,
  Clock3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import "./UserSupportSection.scss";
import useUserSupport from "../../../hooks/user/useUserSupport.js";

const PAGE_SIZE = 5;

const INITIAL_FORM = {
  subject: "",
  category: "Booking",
  message: "",
};

const UserSupportSection = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [page, setPage] = useState(1);

  const {
    tickets = [],
    pagination = {},
    loading,
    submitting,
    error,
    success,
    fetchMyTickets,
    submitTicket,
    resetMessages,
  } = useUserSupport();

  useEffect(() => {
    fetchMyTickets({ page, limit: PAGE_SIZE });
  }, [fetchMyTickets, page]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    const result = await submitTicket({
      subject: form.subject.trim(),
      category: form.category,
      message: form.message.trim(),
    });

    if (result.success) {
      setForm(INITIAL_FORM);
      setPage(1);
    }
  };

  const totalTickets = Number(pagination.total) || 0;
  const totalPages = Math.max(
    1,
    Number(pagination.totalPages) ||
      Math.ceil(totalTickets / PAGE_SIZE)
  );

  const getStatus = (status) =>
    (status || "PENDING").toUpperCase();

  const formatStatus = (status) =>
    getStatus(status)
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

  const getTicketId = (ticket) =>
    ticket.ticketId ||
    ticket._id?.slice(-8)?.toUpperCase() ||
    "—";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN")
      : "—";

  return (
    <section className="user-support">
      <header className="user-support__header">
        <div>
          <span className="user-support__eyebrow">
            YOUR PERSONAL GROOMING SPACE
          </span>
          <h1>Help &amp; Support</h1>
          <p>Submit an issue and track your support requests.</p>
        </div>

        <MessageCircle size={28} />
      </header>

      {/* Create Support Request */}
      <div className="user-support__card">
        <h2>Create Support Request</h2>
        <p className="user-support__subtitle">
          Tell us how we can help you.
        </p>

        {success && (
          <div
            className="user-support__feedback user-support__feedback--success"
            role="status"
          >
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div
            className="user-support__feedback user-support__feedback--error"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-support__form">
          <div className="user-support__row">
            <div className="user-support__field">
              <label htmlFor="support-subject">Subject</label>
              <input
                id="support-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter issue subject"
                maxLength={150}
                required
                disabled={submitting}
              />
            </div>

            <div className="user-support__field">
              <label htmlFor="support-category">Category</label>
              <select
                id="support-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Booking">Booking</option>
                <option value="Payment">Payment</option>
                <option value="Services">Services</option>
                <option value="Barber">Barber</option>
                <option value="Account">Account</option>
                <option value="Cancellation">Cancellation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="user-support__field">
            <label htmlFor="support-message">Message</label>
            <textarea
              id="support-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue..."
              rows={4}
              maxLength={5000}
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="user-support__submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoaderCircle
                  size={16}
                  className="user-support__spinner"
                />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>

      {/* Support Request History */}
      <div className="user-support__card user-support__history">
        <div className="user-support__table-header">
          <div>
            <h2>My Support Requests</h2>
            <p className="user-support__subtitle">
              View the status of your submitted requests.
            </p>
          </div>

          <span className="user-support__count">
            {totalTickets} Requests
          </span>
        </div>

        <div className="user-support__table-wrapper">
          <table className="user-support__table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="user-support__empty">
                    <LoaderCircle
                      size={22}
                      className="user-support__spinner"
                    />
                    <span>Loading support requests...</span>
                  </td>
                </tr>
              ) : tickets.length > 0 ? (
                tickets.map((ticket) => {
                  const status = getStatus(ticket.status);

                  return (
                    <tr key={ticket._id}>
                      <td>{getTicketId(ticket)}</td>
                      <td>{ticket.subject || "—"}</td>
                      <td>{ticket.category || "—"}</td>
                      <td>{formatDate(ticket.createdAt)}</td>

                      <td>
                        <span
                          className={`user-support__status user-support__status--${status.toLowerCase()}`}
                        >
                          {status === "RESOLVED" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock3 size={14} />
                          )}

                          {formatStatus(status)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="user-support__empty">
                    <MessageCircle size={22} />
                    <span>No support requests yet.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalTickets > 0 && (
          <div className="user-support__pagination">
            <span className="user-support__pagination-info">
              Page {pagination.page || page} of {totalPages}
              {" · "}
              {totalTickets} requests
            </span>

            <div className="user-support__pagination-actions">
              <button
                type="button"
                className="user-support__page-button"
                onClick={() =>
                  setPage((previous) => Math.max(1, previous - 1))
                }
                disabled={page <= 1}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="user-support__page-number">
                {pagination.page || page}
              </span>

              <button
                type="button"
                className="user-support__page-button"
                onClick={() =>
                  setPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserSupportSection;
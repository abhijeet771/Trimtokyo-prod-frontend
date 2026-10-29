import React, { useMemo, useState } from "react";
import {  Search,  CalendarDays,  Users,MapPin,  Phone,FileText,  Check,
  X,
  Trash2,
  RefreshCw,
} from "lucide-react";

import useAdminEventRequests from "../../../../hooks/admin/useAdminEventRequests.js";
import "./EventRequest.scss";

const EventRequest = () => {
  const {
    eventRequests,
    loading,
    actionLoading,
    error,
    fetchEventRequests,
    approveEventRequest,
    rejectEventRequest,
    removeEventRequest,
  } = useAdminEventRequests();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionError, setActionError] = useState("");

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return eventRequests.filter((request) => {
      const matchesSearch = [
        request.eventName,
        request.totalMembers,
        request.description,
        request.address,
        request.phone,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      );

      const matchesStatus =
        statusFilter === "ALL" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [eventRequests, searchTerm, statusFilter]);

  const handleStatusChange = async (id, status) => {
    setActionError("");

    try {
      if (status === "APPROVED") {
        await approveEventRequest(id);
      } else {
        await rejectEventRequest(id);
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${status.toLowerCase()} event request.`
      );
    }
  };

  const handleDelete = async (request) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the event request "${request.eventName}"?`
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await removeEventRequest(request._id);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete event request."
      );
    }
  };

  const handleRefresh = async () => {
    setActionError("");

    try {
      await fetchEventRequests();
    } catch {
      // The hook exposes the fetch error.
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="event-requests">
      <div className="event-requests__header">
        <div>
          <span className="event-requests__eyebrow">
            TRIMTOKYO ADMIN
          </span>

          <h2>Events Request</h2>

          <p>
            Review and manage event enquiries submitted through
            your website.
          </p>
        </div>

        <button
          type="button"
          className="event-requests__refresh"
          onClick={handleRefresh}
          disabled={loading || actionLoading}
          aria-label="Refresh event requests"
          title="Refresh"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="event-requests__toolbar">
        <div className="event-requests__search">
          <Search size={19} />

          <input
            type="search"
            placeholder="Search event, address, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search event requests"
          />
        </div>

        <select
          className="event-requests__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {(error || actionError) && (
        <div className="event-requests__error" role="alert">
          {actionError || error}
        </div>
      )}

      <div className="event-requests__table-wrapper">
        <table className="event-requests__table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Total Members</th>
              <th>Description</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="event-requests__message">
                  Loading event requests...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="event-requests__message">
                  No event requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>
                    <div className="event-requests__event-name">
                      <CalendarDays size={17} />
                      <span>{request.eventName}</span>
                    </div>
                  </td>

                  <td>
                    <div className="event-requests__members">
                      <Users size={16} />
                      <span>{request.totalMembers}</span>
                    </div>
                  </td>

                  <td>
                    <div
                      className="event-requests__description"
                      title={request.description || ""}
                    >
                      {request.description || "—"}
                    </div>
                  </td>

                  <td>
                    <div className="event-requests__detail">
                      <MapPin size={16} />
                      <span>{request.address}</span>
                    </div>
                  </td>

                  <td>
                    <div className="event-requests__detail">
                      <Phone size={16} />
                      <span>{request.phone}</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`event-requests__status event-requests__status--${(
                        request.status || "PENDING"
                      ).toLowerCase()}`}
                    >
                      <span className="event-requests__status-dot" />
                      {request.status || "PENDING"}
                    </span>
                  </td>

                  <td>
                    <div className="event-requests__actions">
                      {request.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            className="event-requests__action event-requests__action--approve"
                            onClick={() =>
                              handleStatusChange(
                                request._id,
                                "APPROVED"
                              )
                            }
                            disabled={actionLoading}
                            title="Approve request"
                            aria-label={`Approve ${request.eventName}`}
                          >
                            <Check size={17} />
                          </button>

                          <button
                            type="button"
                            className="event-requests__action event-requests__action--reject"
                            onClick={() =>
                              handleStatusChange(
                                request._id,
                                "REJECTED"
                              )
                            }
                            disabled={actionLoading}
                            title="Reject request"
                            aria-label={`Reject ${request.eventName}`}
                          >
                            <X size={17} />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        className="event-requests__action event-requests__action--delete"
                        onClick={() => handleDelete(request)}
                        disabled={actionLoading}
                        title="Delete request"
                        aria-label={`Delete ${request.eventName}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="event-requests__footer">
        <span>
          Showing {filteredRequests.length} of {eventRequests.length}{" "}
          requests
        </span>

        <span>
          <FileText size={15} />
          Event enquiry management
        </span>
      </div>
    </section>
  );
};

export default EventRequest;

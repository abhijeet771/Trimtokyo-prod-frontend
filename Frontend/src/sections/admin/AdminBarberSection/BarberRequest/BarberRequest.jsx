
import React, { useEffect, useState } from "react";
import { Eye, Check, X, Trash2, Search, RefreshCw } from "lucide-react";
import useAdminBarberRequests from "../../../../hooks/admin/useAdminBarberRequests.js";
import "./BarberRequest.scss";

const BarberRequest = () => {
  const {
    barberRequests = [],
    loading,
    error,
    fetchBarberRequests,
    approveRequest,
    rejectRequest,
    removeRequest,
  } = useAdminBarberRequests();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchBarberRequests(status === "ALL" ? "" : status);
  }, [status, fetchBarberRequests]);

  const requests = barberRequests.filter((item) => {
    const term = search.toLowerCase();

    return (
      (status === "ALL" || item.status === status) &&
      [item.shopName, item.ownerName, item.mobileNumber, item.city]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );
  });

  const handleAction = async (action, request) => {
    const actionName = {
      approveRequest: "approve",
      rejectRequest: "reject",
      removeRequest: "delete",
    }[action];

    if (!window.confirm(`${actionName} application for ${request.shopName}?`)) {
      return;
    }

    try {
      await ({
        approveRequest,
        rejectRequest,
        removeRequest,
      }[action])(request._id);

      if (selected?._id === request._id) setSelected(null);

      await fetchBarberRequests(status === "ALL" ? "" : status);
    } catch (err) {
      window.alert(err?.message || `Unable to ${actionName} application.`);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

  return (
    <section className="barber-requests">
      <div className="barber-requests__header">
        <div>
          <h2>Barber Requests</h2>
          <p>Review and manage barber shop applications.</p>
        </div>

        <button
          className="br-btn br-btn--light"
          onClick={() => fetchBarberRequests(status === "ALL" ? "" : status)}
          disabled={loading}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="barber-requests__toolbar">
        <label className="br-search">
          <Search size={16} />
          <input
            placeholder="Search shop, owner, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && <p className="br-error">{error}</p>}

      <div className="barber-requests__table-wrap">
        <table className="barber-requests__table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Owner</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="br-empty">Loading requests...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="6" className="br-empty">No barber requests found.</td></tr>
            ) : (
              requests.map((item) => (
                <tr key={item._id}>
                  <td>{item.shopName}</td>
                  <td>{item.ownerName}</td>
                  <td>{item.mobileNumber}</td>
                  <td>{item.city}</td>
                  <td>
                    <span className={`br-status br-status--${item.status?.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="br-actions">
                      <button
                        className="br-btn br-btn--view"
                        onClick={() => setSelected(item)}
                      >
                        <Eye size={14} /> View
                      </button>

                      {item.status === "PENDING" && (
                        <>
                          <button
                            className="br-icon br-icon--approve"
                            title="Approve"
                            onClick={() => handleAction("approveRequest", item)}
                          >
                            <Check size={15} />
                          </button>

                          <button
                            className="br-icon br-icon--reject"
                            title="Reject"
                            onClick={() => handleAction("rejectRequest", item)}
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}

                      <button
                        className="br-icon br-icon--delete"
                        title="Delete"
                        onClick={() => handleAction("removeRequest", item)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="br-overlay" onClick={() => setSelected(null)}>
          <div className="br-modal" onClick={(e) => e.stopPropagation()}>
            <div className="br-modal__header">
              <h3>Barber Application</h3>
              <button onClick={() => setSelected(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="br-details">
              <p><strong>Shop:</strong> {selected.shopName}</p>
              <p><strong>Owner:</strong> {selected.ownerName}</p>
              <p><strong>Phone:</strong> {selected.mobileNumber}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>City:</strong> {selected.city}</p>
              <p><strong>Address:</strong> {selected.shopAddress}</p>
              <p><strong>Description:</strong> {selected.description || "Not provided"}</p>
              <p><strong>Applied:</strong> {formatDate(selected.createdAt)}</p>
              <p><strong>Status:</strong> {selected.status}</p>
            </div>

            {selected.status === "PENDING" && (
              <div className="br-modal__actions">
                <button
                  className="br-btn br-btn--approve"
                  onClick={() => handleAction("approveRequest", selected)}
                >
                  <Check size={15} /> Approve
                </button>
                <button
                  className="br-btn br-btn--reject"
                  onClick={() => handleAction("rejectRequest", selected)}
                >
                  <X size={15} /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BarberRequest;

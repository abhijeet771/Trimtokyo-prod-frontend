
import React, { useMemo, useState } from "react";
import useAdminReferrals from "../../../hooks/admin/useAdminRefferals.js";
import "./AdminReferralSection.scss";

const AdminReferralSection = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reviewNotes, setReviewNotes] = useState({});

  const {
    referrals,
    total,
    loading,
    stats,
    statsLoading,
    statsError,
    reviewingId,
    error,
    successMessage,
    setStatusFilter,
    reviewReferralRequest,
    fetchReferrals,
    fetchReferralStats,
  } = useAdminReferrals();

  /* ----------------------------------------------------------
     STATUS NORMALIZATION
  ---------------------------------------------------------- */

  const getStatus = (referral) => referral.status || "pending";

  const getUserName = (referral) => {
    const user = referral.referredUserId;

    return user && typeof user === "object"
      ? user.name || "Unknown User"
      : "Unknown User";
  };

  const getUserEmail = (referral) => {
    const user = referral.referredUserId;

    return user && typeof user === "object"
      ? user.email || user.phone || "—"
      : "—";
  };

  const getReferrerName = (referral) => {
    const referrer = referral.referrerId;

    return referrer && typeof referrer === "object"
      ? referrer.name || "Unknown Referrer"
      : "Unknown Referrer";
  };

  const getDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* ----------------------------------------------------------
     KPI COUNTS - FROM ADMIN STATS API
  ---------------------------------------------------------- */

  const kpis = [
    {
      label: "Total Requests",
      value: stats?.totalRequests ?? 0,
      type: "total",
      symbol: "↗",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      type: "pending",
      symbol: "◷",
    },
    {
      label: "Approved",
      value: stats?.approved ?? 0,
      type: "accepted",
      symbol: "✓",
    },
    {
      label: "Declined",
      value: stats?.declined ?? 0,
      type: "declined",
      symbol: "×",
    },
  ];

  /* ----------------------------------------------------------
     FILTER AND SEARCH
  ---------------------------------------------------------- */

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return referrals.filter((referral) => {
      const status = getStatus(referral);

      const matchesStatus =
        filter === "all" || status === filter;

      const searchableValues = [
        getUserName(referral),
        getUserEmail(referral),
        getReferrerName(referral),
        referral.referralCode || "",
        referral.status || "",
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value).toLowerCase().includes(query)
      );

      return matchesStatus && matchesSearch;
    });
  }, [referrals, filter, search]);

  /* ----------------------------------------------------------
     REFRESH LIST AND STATS
  ---------------------------------------------------------- */

  const handleRefresh = async () => {
    await Promise.all([
      fetchReferrals(filter),
      fetchReferralStats(),
    ]);
  };

  /* ----------------------------------------------------------
     FILTER CHANGE
  ---------------------------------------------------------- */

  const handleFilterChange = (event) => {
    const nextFilter = event.target.value;

    setFilter(nextFilter);
    setStatusFilter(nextFilter);
  };

  /* ----------------------------------------------------------
     APPROVE OR DECLINE
  ---------------------------------------------------------- */

  const handleAction = async (referralId, status) => {
    const success = await reviewReferralRequest(
      referralId,
      status,
      reviewNotes[referralId] || ""
    );

    if (success) {
      setReviewNotes((current) => {
        const updated = { ...current };
        delete updated[referralId];
        return updated;
      });
    }
  };

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */

  return (
    <section className="admin-referral">
      <header className="admin-referral__header">
        <div>
          <h2>Referral Requests</h2>
          <p>Review and manage user referral requests.</p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || statsLoading}
        >
          {loading || statsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="admin-referral__error" role="alert">
          {error}
        </div>
      )}

      {statsError && (
        <div className="admin-referral__error" role="alert">
          {statsError}
        </div>
      )}

      {successMessage && (
        <div
          className="admin-referral__success"
          role="status"
        >
          {successMessage}
        </div>
      )}

      {/* KPI CARDS */}

      <div className="admin-referral__kpis">
        {kpis.map((kpi) => (
          <article
            className={`admin-referral__kpi admin-referral__kpi--${kpi.type}`}
            key={kpi.type}
          >
            <div
              className="admin-referral__kpi-icon"
              aria-hidden="true"
            >
              {kpi.symbol}
            </div>

            <div className="admin-referral__kpi-info">
              <span>{kpi.label}</span>
              <strong>
                {statsLoading ? "—" : kpi.value}
              </strong>
            </div>
          </article>
        ))}
      </div>

      {/* REFERRAL TABLE */}

      <div className="admin-referral__table-card">
        <div className="admin-referral__table-header">
          <h3>
            Referral Requests ({filteredRequests.length})
          </h3>

          <div className="admin-referral__toolbar">
            <input
              type="search"
              placeholder="Search referrals..."
              aria-label="Search referrals"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter referrals by status"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        <div className="admin-referral__table-wrapper">
          <table className="admin-referral__table">
            <thead>
              <tr>
                <th>Referred User</th>
                <th>Referred By</th>
                <th>Referral Code</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && referrals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="admin-referral__empty"
                  >
                    Loading referral requests...
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  const status = getStatus(request);
                  const userName = getUserName(request);
                  const isReviewing = reviewingId === request._id;

                  return (
                    <tr key={request._id}>
                      <td>
                        <div className="admin-referral__user">
                          <strong>{userName}</strong>
                          <span>{getUserEmail(request)}</span>
                        </div>
                      </td>

                      <td>{getReferrerName(request)}</td>

                      <td>
                        <span className="admin-referral__code">
                          {request.referralCode || "—"}
                        </span>
                      </td>

                      <td>{getDate(request.createdAt)}</td>

                      <td>
                        <span
                          className={`admin-referral__status admin-referral__status--${
                            status === "approved" ? "accepted" : status
                          }`}
                        >
                          {status === "approved"
                            ? "Approved"
                            : status.charAt(0).toUpperCase() +
                              status.slice(1)}
                        </span>
                      </td>

                      <td>
                        {status === "pending" ? (
                          <div className="admin-referral__actions">
                            <button
                              type="button"
                              className="admin-referral__accept"
                              disabled={isReviewing}
                              onClick={() =>
                                handleAction(request._id, "approved")
                              }
                            >
                              {isReviewing ? "Saving..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              className="admin-referral__decline"
                              disabled={isReviewing}
                              onClick={() =>
                                handleAction(request._id, "declined")
                              }
                            >
                              {isReviewing ? "Saving..." : "Decline"}
                            </button>
                          </div>
                        ) : (
                          <span className="admin-referral__completed">
                            {status === "approved"
                              ? "Approved"
                              : "Declined"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="admin-referral__empty"
                  >
                    No referral requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminReferralSection;

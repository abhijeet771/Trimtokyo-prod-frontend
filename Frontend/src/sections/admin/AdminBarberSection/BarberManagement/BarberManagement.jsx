
import React, { useMemo, useState } from "react";
import useAdminBarbers from "../../../../hooks/admin/useAdminBarbers.js";
import "./BarberManagement.scss";

const AdminBarberSection = () => {
  const {
    barbers = [],
    loading,
    error,
    refreshBarbers,
  } = useAdminBarbers();

  const [searchTerm, setSearchTerm] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [selectedBarber, setSelectedBarber] = useState(null);

  const getUser = (barber) =>
    barber?.userId && typeof barber.userId === "object"
      ? barber.userId
      : {};

  const getBarberName = (barber) => {
    const user = getUser(barber);

    return (
      user.name ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      barber.shopName ||
      "Unnamed barber"
    );
  };

  const getBarberEmail = (barber) => getUser(barber).email || "—";

  const getStatus = (barber) =>
    String(barber?.status || "PENDING").toUpperCase();

  const barberStats = useMemo(() => {
    const list = Array.isArray(barbers) ? barbers : [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: list.length,
      approved: list.filter(
        (barber) => getStatus(barber) === "APPROVED"
      ).length,
      pending: list.filter(
        (barber) => getStatus(barber) === "PENDING"
      ).length,
      newThisMonth: list.filter((barber) => {
        if (!barber.createdAt) return false;

        const createdAt = new Date(barber.createdAt);

        return createdAt >= monthStart && createdAt <= now;
      }).length,
    };
  }, [barbers]);

  const filteredBarbers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return barbers.filter((barber) => {
      const name = getBarberName(barber);
      const email = getBarberEmail(barber);
      const status = getStatus(barber);

      const matchesSearch =
        !query ||
        [name, email, barber.shopName, barber.phone, barber.city]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        approvalFilter === "all" ||
        status === approvalFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [barbers, searchTerm, approvalFilter]);

  const getInitials = (name) => {
    if (!name) return "B";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "barber-status--approved";
      case "REJECTED":
        return "barber-status--rejected";
      default:
        return "barber-status--pending";
    }
  };

  const kpiCards = [
    {
      label: "Total Barbers",
      value: barberStats.total,
      hint: "Total barber profiles",
      type: "total",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="9"
            cy="8"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M2.8 20v-1.5A5.5 5.5 0 0 1 8.3 13H10M16 11v8M12 15h8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Approved Barbers",
      value: barberStats.approved,
      hint: "Approved to operate",
      type: "approved",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m7.5 12 3 3 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Pending Approval",
      value: barberStats.pending,
      hint: "Awaiting approval",
      type: "pending",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 7v5l3 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "New This Month",
      value: barberStats.newThisMonth,
      hint: "Registered this month",
      type: "new",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const closeDialog = () => setSelectedBarber(null);

  return (
    <section className="admin-barber-section">
      <div className="admin-barber-section__heading">
        <div>
          <p className="admin-barber-section__eyebrow">
            BARBER MANAGEMENT
          </p>
          <h1>Barbers</h1>
          <p className="admin-barber-section__subtitle">
            View barber profiles, contact details, and approval status.
          </p>
        </div>

        <button
          type="button"
          className="admin-barber-refresh"
          onClick={() => refreshBarbers()}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="admin-barber-section__kpis">
        {kpiCards.map((card) => (
          <article
            className={`barber-kpi-card barber-kpi-card--${card.type}`}
            key={card.type}
          >
            <div className="barber-kpi-card__top">
              <span className="barber-kpi-card__label">
                {card.label}
              </span>
              <span className="barber-kpi-card__icon">
                {card.icon}
              </span>
            </div>

            <strong className="barber-kpi-card__value">
              {loading ? "—" : card.value.toLocaleString("en-IN")}
            </strong>

            <span className="barber-kpi-card__hint">
              {card.hint}
            </span>
          </article>
        ))}
      </div>

      <div className="admin-barber-table">
        <div className="admin-barber-table__header">
          <div>
            <h2>Barbers List</h2>
            <p>
              {loading
                ? "Loading barber profiles..."
                : `${filteredBarbers.length} ${
                    filteredBarbers.length === 1
                      ? "barber"
                      : "barbers"
                  } shown`}
            </p>
          </div>

          <div className="admin-barber-table__controls">
            <label className="admin-barber-table__search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, email or phone..."
                aria-label="Search barber profiles"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="admin-barber-table__clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <select
              className="admin-barber-table__filter"
              value={approvalFilter}
              onChange={(event) => setApprovalFilter(event.target.value)}
              aria-label="Filter by approval status"
            >
              <option value="all">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="admin-barber-table__state">
            <span className="admin-barber-table__spinner" />
            Loading barbers...
          </div>
        )}

        {!loading && error && (
          <div className="admin-barber-table__state admin-barber-table__state--error">
            {typeof error === "string"
              ? error
              : "Failed to load barbers. Please try again."}
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredBarbers.length === 0 ? (
              <div className="admin-barber-table__empty">
                <strong>
                  {searchTerm || approvalFilter !== "all"
                    ? "No matching barbers"
                    : "No barbers found"}
                </strong>
                <span>
                  Try changing your search term or status filter.
                </span>
              </div>
            ) : (
              <div className="admin-barber-table__scroll">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Barber / Shop</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Joined At</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBarbers.map((barber, index) => {
                      const name = getBarberName(barber);
                      const status = getStatus(barber);

                      return (
                        <tr key={barber._id || barber.id || index}>
                          <td>{index + 1}</td>

                          <td>
                            <div className="admin-barber-table__person">
                              {barber.profileImage ? (
                                <img
                                  className="admin-barber-table__avatar admin-barber-table__avatar--image"
                                  src={barber.profileImage}
                                  alt={name}
                                />
                              ) : (
                                <span className="admin-barber-table__avatar">
                                  {getInitials(name)}
                                </span>
                              )}

                              <span className="admin-barber-table__name">
                                {name}
                                <small>{barber.shopName || "—"}</small>
                              </span>
                            </div>
                          </td>

                          <td className="admin-barber-table__email">
                            {getBarberEmail(barber)}
                          </td>

                          <td>{barber.phone || "—"}</td>

                          <td>
                            <span
                              className={`barber-status ${getStatusClass(status)}`}
                            >
                              <span className="barber-status__dot" />
                              {status}
                            </span>
                          </td>

                          <td>{formatDate(barber.createdAt)}</td>

                          <td>
                            <button
                              type="button"
                              className="admin-barber-view-button"
                              onClick={() => setSelectedBarber(barber)}
                            >
                              View details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {selectedBarber && (
        <div
          className="barber-view-dialog__overlay"
          onClick={closeDialog}
          role="presentation"
        >
          <section
            className="barber-view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="barber-view-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="barber-view-dialog__header">
              <div>
                <p className="admin-barber-section__eyebrow">
                  BARBER PROFILE
                </p>
                <h2 id="barber-view-dialog-title">Barber details</h2>
              </div>

              <button
                type="button"
                className="barber-view-dialog__close"
                onClick={closeDialog}
                aria-label="Close details"
              >
                ×
              </button>
            </header>

            <div className="barber-view-dialog__profile">
              {selectedBarber.profileImage ? (
                <img
                  src={selectedBarber.profileImage}
                  alt={getBarberName(selectedBarber)}
                />
              ) : (
                <span className="admin-barber-table__avatar">
                  {getInitials(getBarberName(selectedBarber))}
                </span>
              )}

              <div>
                <h3>{getBarberName(selectedBarber)}</h3>
                <p>{selectedBarber.shopName || "Shop name unavailable"}</p>
                <span
                  className={`barber-status ${getStatusClass(
                    getStatus(selectedBarber)
                  )}`}
                >
                  {getStatus(selectedBarber)}
                </span>
              </div>
            </div>

            <div className="barber-view-dialog__grid">
              {[
                ["Email", getBarberEmail(selectedBarber)],
                ["Phone", selectedBarber.phone],
                ["Business type", selectedBarber.businessType],
                ["Address", selectedBarber.address],
                ["City", selectedBarber.city],
                ["State", selectedBarber.state],
                ["Registration date", formatDate(selectedBarber.registrationDate)],
                ["Created at", formatDate(selectedBarber.createdAt)],
                ["Phone verified", selectedBarber.isPhoneVerified ? "Yes" : "No"],
                ["KYC verified", selectedBarber.isKycVerified ? "Yes" : "No"],
                ["Active", selectedBarber.isActive ? "Yes" : "No"],
                ["Featured", selectedBarber.isFeatured ? "Yes" : "No"],
                ["Rating", `${selectedBarber.avgRating ?? 0} / 5`],
                ["Total reviews", selectedBarber.totalReviews ?? 0],
              ].map(([label, value]) => (
                <div
                  className="barber-view-dialog__field"
                  key={label}
                >
                  <span>{label}</span>
                  <strong>{value || "—"}</strong>
                </div>
              ))}
            </div>

            {selectedBarber.description && (
              <div className="barber-view-dialog__description">
                <span>Description</span>
                <p>{selectedBarber.description}</p>
              </div>
            )}

            <footer className="barber-view-dialog__footer">
              <button type="button" onClick={closeDialog}>
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminBarberSection;

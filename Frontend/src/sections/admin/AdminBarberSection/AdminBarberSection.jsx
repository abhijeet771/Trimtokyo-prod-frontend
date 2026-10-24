
import React, { useMemo, useState } from "react";
import useGetShop from "../../../hooks/useGetShop";
import "./AdminBarberSection.scss";

const AdminBarberSection = () => {
  const { barbers = [], loading, error } = useGetShop();
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");

  const barberStats = useMemo(() => {
    const list = Array.isArray(barbers) ? barbers : [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: list.length,
      approved: list.filter((barber) => barber.isApproved === true).length,
      pending: list.filter((barber) => barber.isApproved === false).length,
      newThisMonth: list.filter((barber) => {
        if (!barber.createdAt) return false;
        const createdAt = new Date(barber.createdAt);
        return createdAt >= monthStart && createdAt <= now;
      }).length,
    };
  }, [barbers]);

  const filteredBarbers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return (Array.isArray(barbers) ? barbers : []).filter((barber) => {
      const matchesSearch =
        !query ||
        [barber.name, barber.email, barber.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "approved" && barber.isApproved === true) ||
        (approvalFilter === "pending" && barber.isApproved !== true);

      return matchesSearch && matchesApproval;
    });
  }, [barbers, searchTerm, approvalFilter]);

  const getInitials = (name) => {
    if (!name) return "B";

    return String(name)
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

  const kpiCards = [
    {
      label: "Total Barbers",
      value: barberStats.total,
      hint: "Barber records returned by API",
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
      hint: "Joined during this month",
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

  return (
    <section className="admin-barber-section">
      <div className="admin-barber-section__heading">
        <div>
          <p className="admin-barber-section__eyebrow">BARBER MANAGEMENT</p>
          <h1>Barbers</h1>
          <p className="admin-barber-section__subtitle">
            View barber accounts, contact details, and approval status.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="admin-barber-section__kpis">
        {kpiCards.map((card) => (
          <article
            className={`barber-kpi-card barber-kpi-card--${card.type}`}
            key={card.type}
          >
            <div className="barber-kpi-card__top">
              <span className="barber-kpi-card__label">{card.label}</span>
              <span className="barber-kpi-card__icon">{card.icon}</span>
            </div>

            <strong className="barber-kpi-card__value">
              {loading ? "—" : card.value.toLocaleString("en-IN")}
            </strong>

            <span className="barber-kpi-card__hint">{card.hint}</span>
          </article>
        ))}
      </div>

      {/* BARBER TABLE */}
      <div className="admin-barber-table">
        <div className="admin-barber-table__header">
          <div>
            <h2>Barbers List</h2>
            <p>
              {loading
                ? "Loading barber accounts..."
                : `${filteredBarbers.length} ${
                    filteredBarbers.length === 1 ? "barber" : "barbers"
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
                aria-label="Search barbers by name, email or phone"
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
              aria-label="Filter barbers by approval status"
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
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
                <span className="admin-barber-table__empty-icon">
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
                </span>
                <strong>
                  {searchTerm || approvalFilter !== "all"
                    ? "No matching barbers"
                    : "No barbers found"}
                </strong>
                <span>
                  Try changing the search term or approval filter.
                </span>
              </div>
            ) : (
              <div className="admin-barber-table__scroll">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Approval Status</th>
                      <th>Joined At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBarbers.map((barber, index) => (
                      <tr
                        key={
                          barber._id || barber.id || `${barber.phone}-${index}`
                        }
                      >
                        <td>{index + 1}</td>

                        <td>
                          <div className="admin-barber-table__person">
                            <span className="admin-barber-table__avatar">
                              {getInitials(barber.name)}
                            </span>
                            <span className="admin-barber-table__name">
                              {barber.name || "Unnamed barber"}
                            </span>
                          </div>
                        </td>

                        <td className="admin-barber-table__email">
                          {barber.email || "—"}
                        </td>

                        <td>{barber.phone || "—"}</td>

                        <td>
                          <span
                            className={`barber-status ${
                              barber.isApproved === true
                                ? "barber-status--approved"
                                : "barber-status--pending"
                            }`}
                          >
                            <span className="barber-status__dot" />
                            {barber.isApproved === true
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </td>

                        <td>{formatDate(barber.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminBarberSection;

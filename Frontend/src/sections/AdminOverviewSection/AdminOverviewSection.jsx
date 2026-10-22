
import { useEffect } from "react";
import useAdminOverview from "../../hooks/admin/useAdminOverview";
import "./AdminOverviewSection.scss";

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("en-IN")
    : "0";
};

const AdminOverviewSection = () => {
  const {
    overview,
    loading,
    error,
    fetchAdminOverview,
  } = useAdminOverview();

  useEffect(() => {
    fetchAdminOverview();
  }, [fetchAdminOverview]);

  const totalBarbers = Number(overview?.totalBarbers) || 0;
  const totalUsers = Number(overview?.totalUsers) || 0;
  const totalPeople = totalBarbers + totalUsers;

  const barberPercentage =
    totalPeople > 0
      ? (totalBarbers / totalPeople) * 100
      : 0;

  const userPercentage =
    totalPeople > 0
      ? (totalUsers / totalPeople) * 100
      : 0;

  const totalBookings = Number(overview?.totalOrders) || 0;
  const todaysBookings = Number(overview?.todaysOrders) || 0;

  return (
    <section className="admin-hero">
      {/* KPI CARDS */}
      <div className="admin-hero__kpis">
        <article className="overview-kpi overview-kpi--bookings">
          <div className="overview-kpi__top">
            <span className="overview-kpi__label">
              Total Bookings
            </span>

            <span className="overview-kpi__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="3.5"
                  y="5"
                  width="17"
                  height="15"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 3.5V7M16 3.5V7M4 10H20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <p className="overview-kpi__value">
            {loading ? "—" : formatNumber(totalBookings)}
          </p>

          <span className="overview-kpi__hint">
            All-time bookings
          </span>
        </article>

        <article className="overview-kpi overview-kpi--today">
          <div className="overview-kpi__top">
            <span className="overview-kpi__label">
              Today's Bookings
            </span>

            <span className="overview-kpi__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="8.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 7V12L15.5 14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <p className="overview-kpi__value">
            {loading ? "—" : formatNumber(todaysBookings)}
          </p>

          <span className="overview-kpi__hint">
            Bookings for today
          </span>
        </article>

        <article className="overview-kpi overview-kpi--barbers">
          <div className="overview-kpi__top">
            <span className="overview-kpi__label">
              Total Barbers
            </span>

            <span className="overview-kpi__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="9"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M2.8 20V18.5A5.5 5.5 0 0 1 8.3 13H10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16 11V19M12 15H20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <p className="overview-kpi__value">
            {loading ? "—" : formatNumber(totalBarbers)}
          </p>

          <span className="overview-kpi__hint">
            Registered barbers
          </span>
        </article>

        <article className="overview-kpi overview-kpi--users">
          <div className="overview-kpi__top">
            <span className="overview-kpi__label">
              Total Users
            </span>

            <span className="overview-kpi__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="9"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M2.8 20V18.5A5.5 5.5 0 0 1 8.3 13H10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16 7.5A3.5 3.5 0 0 1 16 14.5M16 16.5A5.5 5.5 0 0 1 21.2 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <p className="overview-kpi__value">
            {loading ? "—" : formatNumber(totalUsers)}
          </p>

          <span className="overview-kpi__hint">
            Registered customers
          </span>
        </article>
      </div>

      {error && (
        <p className="admin-hero__error" role="alert">
          {typeof error === "string"
            ? error
            : "Failed to load overview statistics. Please refresh and try again."}
        </p>
      )}

      {/* CHARTS AND ANALYTICS */}
      <div className="admin-hero__analytics">
        {/* PLATFORM DISTRIBUTION */}
        <article className="overview-panel overview-panel--distribution">
          <div className="overview-panel__header">
            <div>
              <h2>Platform Distribution</h2>
              <p>Registered users compared with barbers</p>
            </div>

            <span className="overview-panel__tag">
              Overview
            </span>
          </div>

          {loading ? (
            <div className="overview-panel__loading">
              Loading platform statistics...
            </div>
          ) : (
            <div className="distribution-chart">
              <div className="distribution-chart__visual">
                <div
                  className="distribution-chart__donut"
                  role="img"
                  aria-label={`Platform distribution: ${formatNumber(
                    totalUsers
                  )} users and ${formatNumber(
                    totalBarbers
                  )} barbers`}
                  style={{
                    background:
                      totalPeople > 0
                        ? `conic-gradient(
                            #7cfc00 0% ${barberPercentage}%,
                            #dcebd7 ${barberPercentage}% 100%
                          )`
                        : "#edf1eb",
                  }}
                >
                  <div className="distribution-chart__center">
                    <strong>{formatNumber(totalPeople)}</strong>
                    <span>Total people</span>
                  </div>
                </div>
              </div>

              <div className="distribution-chart__legend">
                <div className="distribution-chart__legend-item">
                  <span className="distribution-chart__dot distribution-chart__dot--barbers" />

                  <div className="distribution-chart__legend-copy">
                    <span>Barbers</span>
                    <strong>{formatNumber(totalBarbers)}</strong>
                  </div>

                  <span className="distribution-chart__percentage">
                    {barberPercentage.toFixed(1)}%
                  </span>
                </div>

                <div className="distribution-chart__legend-item">
                  <span className="distribution-chart__dot distribution-chart__dot--users" />

                  <div className="distribution-chart__legend-copy">
                    <span>Users</span>
                    <strong>{formatNumber(totalUsers)}</strong>
                  </div>

                  <span className="distribution-chart__percentage">
                    {userPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="admin-hero__muted">
              Distribution data is currently unavailable.
            </p>
          )}
        </article>

        {/* BOOKING OVERVIEW */}
        <article className="overview-panel overview-panel--booking">
          <div className="overview-panel__header">
            <div>
              <h2>Booking Overview</h2>
              <p>A quick look at booking activity</p>
            </div>

            <span
              className="overview-panel__icon-badge"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 19V5M4 19H21M8 15V11M13 15V7M18 15V4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="booking-overview__main">
            <span className="booking-overview__label">
              Total bookings created
            </span>

            <strong>
              {loading ? "—" : formatNumber(totalBookings)}
            </strong>

            <span className="booking-overview__description">
              Across the platform
            </span>
          </div>

          <div className="booking-overview__today">
            <div
              className="booking-overview__today-icon"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5L9.2 16.5L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span>Today's bookings</span>
              <strong>
                {loading ? "—" : formatNumber(todaysBookings)}
              </strong>
            </div>
          </div>

          <div className="booking-overview__footer">
            <span className="booking-overview__status-dot" />
            <span>Summary from the Admin Overview API</span>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AdminOverviewSection;


import React, { useMemo, useState } from "react";
import {  Scissors,Users,  Clock,  IndianRupee,
  TrendingUp,  RefreshCw,} from "lucide-react";

import {
  ResponsiveContainer,  AreaChart,  Area,  XAxis,
  YAxis,  CartesianGrid,  Tooltip,
  PieChart,  Pie,  Cell,
} from "recharts";

import useAdminAnalytics from "../../../../../hooks/admin/useAdminAnalytics";

import "./Barber.scss";

/* =========================================
   CONSTANTS
========================================= */

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const STATUS_COLORS = {
  COMPLETED: "#268b16",
  PENDING: "#f5a623",
  CONFIRMED: "#1674e8",
  IN_PROGRESS: "#9333ea",
  CANCELLED: "#ef5350",
};

const STATUS_LABELS = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  CANCELLED: "Cancelled",
};

/* =========================================
   HELPERS
========================================= */

const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateFilters = (range) => {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(
    startDate.getDate() - Number(range) + 1
  );

  return {
    startDate: getLocalDate(startDate),
    endDate: getLocalDate(endDate),
  };
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const formatChartDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

/* =========================================
   TOOLTIP COMPONENTS
========================================= */

const BarberGrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="barber-stats__tooltip">
      <span>{formatChartDate(label)}</span>
      <strong>
        {formatNumber(payload[0].value)} completed orders
      </strong>
    </div>
  );
};

const BookingStatusTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="barber-stats__tooltip">
      <span>{item.name}</span>
      <strong>{formatNumber(item.value)} orders</strong>
    </div>
  );
};

/* =========================================
   MAIN COMPONENT
========================================= */

const Barber = () => {
  const [dateRange, setDateRange] = useState("30");

  const filters = useMemo(
    () => getDateFilters(dateRange),
    [dateRange]
  );

  // Revenue and order analytics
  const {
    analytics: revenueAnalytics,
    loading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenue,
  } = useAdminAnalytics(filters, "revenue");

  // Barber analytics
  const {
    analytics: barberAnalytics,
    loading: barberLoading,
    error: barberError,
    refetch: refetchBarbers,
  } = useAdminAnalytics(filters, "barbers");

  const loading = revenueLoading || barberLoading;

  const error = revenueError || barberError;

  /* =========================================
     SUMMARY DATA
  ========================================= */

  const barberSummary = barberAnalytics?.summary || {};
  const revenueSummary = revenueAnalytics?.summary || {};

  const totalBarbers = barberSummary.totalBarbers || 0;
  const activeBarbers = barberSummary.activeBarbers || 0;
  const pendingApprovals = barberSummary.pendingApprovals || 0;
  const totalRevenue = revenueSummary.totalRevenue || 0;

  /* =========================================
     KPI CARDS
  ========================================= */

  const barberKpis = [
    {
      id: "total",
      title: "Total Barbers",
      value: formatNumber(totalBarbers),
      icon: Scissors,
      color: "green",
      description: "All registered barber profiles",
    },
    {
      id: "active",
      title: "Active Barbers",
      value: formatNumber(activeBarbers),
      icon: Users,
      color: "blue",
      description: "Active and approved barbers",
    },
    {
      id: "pending",
      title: "Pending Approvals",
      value: formatNumber(pendingApprovals),
      icon: Clock,
      color: "purple",
      description: "Applications awaiting approval",
    },
    {
      id: "revenue",
      title: "Barber Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      color: "orange",
      description: "Collected revenue from paid orders",
    },
  ];

  /* =========================================
     CHART DATA
  ========================================= */

  const barberPerformanceData = useMemo(() => {
    return (revenueAnalytics?.completedOrdersTrend || []).map(
      (item) => ({
        ...item,
        date: item.date,
        bookings: item.completedOrders || 0,
      })
    );
  }, [revenueAnalytics]);

  const bookingStatusData = useMemo(() => {
    const statusData = revenueAnalytics?.bookingStatus || [];

    return statusData.map((item) => ({
      name:
        STATUS_LABELS[item.status] ||
        item.status?.replace(/_/g, " ") ||
        "Unknown",
      value: item.count || 0,
      color: STATUS_COLORS[item.status] || "#849084",
      percentage: item.percentage || 0,
    }));
  }, [revenueAnalytics]);

  const totalBookings = bookingStatusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const completedOrders = barberPerformanceData.reduce(
    (sum, item) => sum + item.bookings,
    0
  );

  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = () => {
    refetchRevenue();
    refetchBarbers();
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <section className="barber-stats">

      {/* HEADER */}
      <div className="barber-stats__header">
        <div>
          <span className="barber-stats__eyebrow">
            BUSINESS ANALYTICS
          </span>

          <h2>Barber Analytics</h2>

          <p>
            Monitor barber registrations, approvals, and business
            performance.
          </p>
        </div>

        <div className="barber-stats__header-actions">
          <select
            value={dateRange}
            onChange={(event) =>
              setDateRange(event.target.value)
            }
            aria-label="Select analytics date range"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh analytics"
            title="Refresh analytics"
          >
            <RefreshCw
              size={17}
              className={loading ? "is-spinning" : ""}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="barber-stats__error">
          <span>{error}</span>

          <button type="button" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="barber-stats__kpis">
        {barberKpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article
              key={kpi.id}
              className={`barber-stats__kpi barber-stats__kpi--${kpi.color}`}
            >
              <div className="barber-stats__kpi-top">
                <div className="barber-stats__kpi-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <span>{kpi.title}</span>
              </div>

              <h3>
                {loading ? "..." : kpi.value}
              </h3>

              <div className="barber-stats__kpi-description">
                {kpi.description}
              </div>
            </article>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="barber-stats__charts">

        {/* BARBER PERFORMANCE */}
        <article className="barber-stats__card barber-stats__growth">
          <div className="barber-stats__card-header">
            <div>
              <h3>Barber Performance</h3>
              <p>Completed orders over time</p>
            </div>
          </div>

          <div className="barber-stats__growth-summary">
            <div>
              <span>Completed orders</span>

              <strong>
                {loading ? "..." : formatNumber(completedOrders)}
              </strong>
            </div>

            <div className="barber-stats__positive">
              <TrendingUp size={15} />
              <span>Selected period</span>
            </div>
          </div>

          <div className="barber-stats__growth-chart">
            {loading ? (
              <div className="barber-stats__chart-message">
                Loading performance data...
              </div>
            ) : barberPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={barberPerformanceData}
                  margin={{
                    top: 12,
                    right: 10,
                    left: -18,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="barberGrowthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7cfc00"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="95%"
                        stopColor="#7cfc00"
                        stopOpacity={0.015}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#edf1eb"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#849084", fontSize: 11 }}
                    minTickGap={22}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#849084", fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <Tooltip content={<BarberGrowthTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#268b16"
                    strokeWidth={2.5}
                    fill="url(#barberGrowthGradient)"
                    activeDot={{
                      r: 5,
                      fill: "#268b16",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="barber-stats__chart-message">
                No completed orders found for this period.
              </div>
            )}
          </div>
        </article>

        {/* BOOKING STATUS */}
        <article className="barber-stats__card barber-stats__status">
          <div className="barber-stats__card-header">
            <div>
              <h3>Booking Status</h3>
              <p>Distribution of barber orders</p>
            </div>
          </div>

          <div className="barber-stats__status-chart">
            {loading ? (
              <div className="barber-stats__chart-message">
                Loading booking status...
              </div>
            ) : bookingStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="82%"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {bookingStatusData.map((item) => (
                        <Cell
                          key={item.name}
                          fill={item.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip content={<BookingStatusTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="barber-stats__status-center">
                  <strong>{formatNumber(totalBookings)}</strong>
                  <span>Total Orders</span>
                </div>
              </>
            ) : (
              <div className="barber-stats__chart-message">
                No order data found for this period.
              </div>
            )}
          </div>

          <div className="barber-stats__legend">
            {bookingStatusData.map((item) => (
              <div
                className="barber-stats__legend-item"
                key={item.name}
              >
                <div className="barber-stats__legend-label">
                  <span
                    className="barber-stats__legend-dot"
                    style={{ backgroundColor: item.color }}
                  />

                  <span>{item.name}</span>
                </div>

                <div className="barber-stats__legend-value">
                  <strong>{formatNumber(item.value)}</strong>

                  <span>{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Barber;

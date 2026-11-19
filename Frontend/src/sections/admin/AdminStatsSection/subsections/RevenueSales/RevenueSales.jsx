import React, { useMemo, useState } from "react";
import {  IndianRupee,  ShoppingCart,  Wallet,  ReceiptText,
  TrendingUp,  CalendarDays,  House,  Clock3, } from "lucide-react";

import {  ResponsiveContainer,  AreaChart,  Area,  XAxis,  YAxis,
  CartesianGrid,  Tooltip,  PieChart,  Pie,  Cell,} from "recharts";

import useAdminAnalytics from "../../../../../hooks/admin/useAdminAnalytics";
import "./RevenueSales.scss";

// DEMO DATA — breakdown APIs are not implemented yet.
const paymentData = [
  { name: "UPI", value: 252886, color: "#268b16" },
  { name: "Card", value: 136170, color: "#3478f6" },
  { name: "Cash", value: 73948, color: "#ff9b35" },
  { name: "Wallet", value: 23316, color: "#9b51e0" },
];

const slotRevenueData = [
  { name: "Morning", value: 97264, color: "#268b16" },
  { name: "Afternoon", value: 146000, color: "#3478f6" },
  { name: "Evening", value: 194528, color: "#ff9b35" },
  { name: "Night", value: 48528, color: "#9b51e0" },
];

const homeServiceRevenueData = [
  { name: "Haircut", value: 145000, color: "#268b16" },
  { name: "Beard Grooming", value: 82000, color: "#3478f6" },
  { name: "Hair Styling", value: 96000, color: "#ff9b35" },
  { name: "Premium Packages", value: 163220, color: "#9b51e0" },
];

const topBarbers = [
  { name: "Arjun Mehta", orders: 186, revenue: 86320, avg: 464 },
  { name: "Rahul Sharma", orders: 164, revenue: 72410, avg: 441 },
  { name: "Karan Singh", orders: 142, revenue: 64210, avg: 452 },
  { name: "Imran Khan", orders: 126, revenue: 58680, avg: 465 },
  { name: "Vikram Das", orders: 112, revenue: 49320, avg: 440 },
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const getDateFilters = (days) => {
  const end = new Date();
  const start = new Date();

  start.setDate(start.getDate() - Number(days) + 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="revenue-sales__tooltip">
      <span>{label}</span>
      <strong>{formatCurrency(payload[0].value)}</strong>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="revenue-sales__tooltip">
      <span>{item.name}</span>
      <strong>{formatCurrency(item.value)}</strong>
    </div>
  );
};

const RevenuePieCard = ({ title, subtitle, icon: Icon, data,  total,}) => {
  return (
    <article className="revenue-sales__pie-card">
      <div className="revenue-sales__card-heading">
        <div className="revenue-sales__heading-icon">
          <Icon size={19} />
        </div>

        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="revenue-sales__pie-layout">
        <div className="revenue-sales__pie">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="59%"
                outerRadius="86%"
                paddingAngle={3}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="revenue-sales__pie-center">
            <strong>{formatCurrency(total)}</strong>
            <span>Demo Revenue</span>
          </div>
        </div>

        <div className="revenue-sales__legend">
          {data.map((item) => {
            const percentage =
              total > 0 ? (item.value / total) * 100 : 0;

            return (
              <div
                className="revenue-sales__legend-row"
                key={item.name}
              >
                <div className="revenue-sales__legend-label">
                  <span
                    className="revenue-sales__legend-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="revenue-sales__legend-value">
                  <strong>{Math.round(percentage)}%</strong>
                  <small>{formatCurrency(item.value)}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
};

const RevenueSales = () => {
  const [dateRange, setDateRange] = useState("30");

  const dateFilters = useMemo(
    () => getDateFilters(dateRange),
    [dateRange]
  );

  const {
    analytics,
    loading,
    error,
    refetch,
  } = useAdminAnalytics(dateFilters);

  const summary = analytics?.summary || {};

  const revenueTrend = (analytics?.revenueTrend || []).map(
    (item) => ({
      ...item,
      date: new Date(`${item.date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      ),
    })
  );

  const revenueKpis = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      icon: IndianRupee,
      color: "green",
    },
    {
      id: "orders",
      title: "Total Orders",
      value: Number(summary.totalOrders || 0).toLocaleString("en-IN"),
      icon: ShoppingCart,
      color: "blue",
    },
    {
      id: "average",
      title: "Average Order Value",
      value: formatCurrency(summary.averageOrderValue),
      icon: Wallet,
      color: "purple",
    },
    {
      id: "pending",
      title: "Pending Revenue",
      value: formatCurrency(summary.pendingRevenue),
      icon: ReceiptText,
      color: "orange",
    },
  ];

  return (
    <section className="revenue-sales">
      <div className="revenue-sales__demo-notice">
        Revenue, orders, average order value and pending revenue
        are live. The breakdown charts and barber table still use
        demo data.
      </div>

      {/* HEADER AND FILTERS */}
      <header className="revenue-sales__header">
        <div>
          <span className="revenue-sales__eyebrow">
            REVENUE & SALES ANALYTICS
          </span>

          <h2>Revenue & Sales</h2>

          <p>
            Track revenue trends, payment methods, and sales
            performance.
          </p>
        </div>

        <label className="revenue-sales__date-filter">
          <CalendarDays size={17} />

          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            aria-label="Select revenue date range"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {/* LOADING AND ERROR */}
      {loading && (
        <div className="revenue-sales__demo-notice">
          Loading analytics...
        </div>
      )}

      {error && (
        <div className="revenue-sales__demo-notice">
          <span>{error}</span>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="revenue-sales__kpis">
        {revenueKpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article
              className={`revenue-sales__kpi revenue-sales__kpi--${kpi.color}`}
              key={kpi.id}
            >
              <div className="revenue-sales__kpi-icon">
                <Icon size={23} strokeWidth={1.9} />
              </div>

              <div className="revenue-sales__kpi-content">
                <span>{kpi.title}</span>
                <h3>
                  {loading ? "..." : kpi.value}
                </h3>

                <div className="revenue-sales__kpi-trend">
                  <TrendingUp size={15} />
                  <strong>Selected period</strong>
                </div>

                <small>
                  {dateRange} day overview
                </small>
              </div>
            </article>
          );
        })}
      </div>

      {/* REVENUE TREND */}
      <article className="revenue-sales__trend-card">
        <div className="revenue-sales__section-heading">
          <div>
            <h3>Revenue Trend</h3>
            <p>Daily revenue over the selected period</p>
          </div>

          <span className="revenue-sales__period-label">
            Last {dateRange} Days
          </span>
        </div>

        <div className="revenue-sales__trend-summary">
          <span>Total Revenue</span>
          <strong>
            {formatCurrency(summary.totalRevenue)}
          </strong>
        </div>

        <div className="revenue-sales__area-chart">
          {loading ? (
            <div className="revenue-sales__demo-notice">
              Loading revenue trend...
            </div>
          ) : revenueTrend.length === 0 ? (
            <div className="revenue-sales__demo-notice">
              No revenue data available for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrend}
                margin={{
                  top: 12,
                  right: 12,
                  left: -12,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="revenueSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#7cfc00"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor="#7cfc00"
                      stopOpacity={0.02}
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
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#849084", fontSize: 11 }}
                  minTickGap={22}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#849084", fontSize: 11 }}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `${value / 1000}K`
                      : value
                  }
                />

                <Tooltip content={<RevenueTooltip />} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#268b16"
                  strokeWidth={2.5}
                  fill="url(#revenueSalesGradient)"
                  activeDot={{
                    r: 5,
                    fill: "#268b16",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      {/* THREE REVENUE BREAKDOWNS — DEMO DATA */}
      <div className="revenue-sales__pie-grid">
        <RevenuePieCard
          title="Revenue by Payment Method"
          subtitle="Distribution across payment methods"
          icon={Wallet}
          data={paymentData}
          total={486320}
        />

        <RevenuePieCard
          title="Revenue by Slot"
          subtitle="Revenue across booking time slots"
          icon={Clock3}
          data={slotRevenueData}
          total={486320}
        />

        <RevenuePieCard
          title="Revenue by Home Service"
          subtitle="Revenue by service category"
          icon={House}
          data={homeServiceRevenueData}
          total={486320}
        />
      </div>

      {/* TOP BARBERS TABLE — DEMO DATA */}
      <article className="revenue-sales__table-card">
        <div className="revenue-sales__section-heading">
          <div>
            <h3>Top Performing Barbers</h3>
            <p>Barbers generating the highest revenue</p>
          </div>

          <span className="revenue-sales__table-badge">
            Top 5
          </span>
        </div>

        <div className="revenue-sales__table-wrapper">
          <table className="revenue-sales__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Barber</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Avg. Order Value</th>
              </tr>
            </thead>

            <tbody>
              {topBarbers.map((barber, index) => (
                <tr key={barber.name}>
                  <td>{index + 1}</td>
                  <td className="revenue-sales__barber-name">
                    <span className="revenue-sales__rank">
                      {barber.name.charAt(0)}
                    </span>
                    {barber.name}
                  </td>
                  <td>{barber.orders}</td>
                  <td>{formatCurrency(barber.revenue)}</td>
                  <td>{formatCurrency(barber.avg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default RevenueSales;
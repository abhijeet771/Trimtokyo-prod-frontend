import React, { useState } from "react";
import {
  CalendarDays,
  IndianRupee,
  Users,
  Scissors,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./Overview.scss";

// DEMO DATA — replace with API data later.
const overviewData = {
  kpis: [
    {
      id: "bookings",
      title: "Total Bookings",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      comparison: "vs previous 30 days",
      icon: CalendarDays,
      color: "green",
    },
    {
      id: "revenue",
      title: "Total Revenue",
      value: "₹4,86,320",
      change: "+18.2%",
      trend: "up",
      comparison: "vs previous 30 days",
      icon: IndianRupee,
      color: "blue",
    },
    {
      id: "users",
      title: "Total Users",
      value: "892",
      change: "+10.4%",
      trend: "up",
      comparison: "vs previous 30 days",
      icon: Users,
      color: "purple",
    },
    {
      id: "barbers",
      title: "Total Barbers",
      value: "48",
      change: "+6.7%",
      trend: "up",
      comparison: "vs previous 30 days",
      icon: Scissors,
      color: "orange",
    },
  ],
  bookings: [
    { date: "Sep 18", bookings: 28 },
    { date: "Sep 19", bookings: 35 },
    { date: "Sep 20", bookings: 31 },
    { date: "Sep 21", bookings: 46 },
    { date: "Sep 22", bookings: 39 },
    { date: "Sep 23", bookings: 52 },
    { date: "Sep 24", bookings: 44 },
    { date: "Sep 25", bookings: 58 },
    { date: "Sep 26", bookings: 48 },
    { date: "Sep 27", bookings: 63 },
    { date: "Sep 28", bookings: 55 },
    { date: "Sep 29", bookings: 72 },
  ],
};

const RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

const BookingTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="overview__tooltip">
      <span>{label}</span>
      <strong>{payload[0].value} bookings</strong>
    </div>
  );
};

const Overview = () => {
  const [dateRange, setDateRange] = useState("30");

  return (
    <section className="overview">
      <div className="overview__demo-notice">
        Demo analytics — values are illustrative, not live business data.
      </div>

      {/* KPI CARDS */}
      <div className="overview__kpis">
        {overviewData.kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon =
            kpi.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <article
              className={`overview__kpi overview__kpi--${kpi.color}`}
              key={kpi.id}
            >
              <div className="overview__kpi-top">
                <div className="overview__kpi-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <span className="overview__kpi-title">
                  {kpi.title}
                </span>
              </div>

              <div className="overview__kpi-details">
                <h3>{kpi.value}</h3>

                <div className="overview__kpi-trend">
                  <TrendIcon size={15} />
                  <span>{kpi.change}</span>
                </div>

                <p>{kpi.comparison}</p>
              </div>
            </article>
          );
        })}
      </div>

      {/* BOOKING OVERVIEW GRAPH */}
      <article className="overview__chart-card">
        <div className="overview__chart-header">
          <div>
            <h3>Booking Overview</h3>
            <p>Booking volume over time</p>
          </div>

          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            aria-label="Booking chart date range"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overview__chart-summary">
          <div>
            <span>Total bookings</span>
            <strong>1,248</strong>
          </div>

          <div className="overview__chart-summary-trend">
            <TrendingUp size={16} />
            <span>12.5%</span>
            <small>vs previous period</small>
          </div>
        </div>

        <div className="overview__chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={overviewData.bookings}
              margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="bookingAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#7cfc00"
                    stopOpacity={0.24}
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
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#89938a", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#89938a", fontSize: 12 }}
              />

              <Tooltip content={<BookingTooltip />} />

              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#268b16"
                strokeWidth={2.5}
                fill="url(#bookingAreaGradient)"
                activeDot={{
                  r: 5,
                  fill: "#268b16",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
};

export default Overview;

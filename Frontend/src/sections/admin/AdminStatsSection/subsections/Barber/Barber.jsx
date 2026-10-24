import React, { useState } from "react";
import {
  Scissors,
  Users,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./Barber.scss";

// DEMO DATA — replace with API data later.
const barberKpis = [
  {
    id: "total",
    title: "Total Barbers",
    value: "48",
    change: "+6.7%",
    icon: Scissors,
    color: "green",
  },
  {
    id: "active",
    title: "Active Barbers",
    value: "39",
    change: "+8.3%",
    icon: Users,
    color: "blue",
  },
  {
    id: "bookings",
    title: "Completed Bookings",
    value: "1,032",
    change: "+12.5%",
    icon: CalendarCheck,
    color: "purple",
  },
  {
    id: "revenue",
    title: "Barber Revenue",
    value: "₹4,12,640",
    change: "+15.3%",
    icon: IndianRupee,
    color: "orange",
  },
];

const barberPerformanceData = [
  { date: "Sep 1", bookings: 24 },
  { date: "Sep 3", bookings: 31 },
  { date: "Sep 5", bookings: 28 },
  { date: "Sep 7", bookings: 38 },
  { date: "Sep 9", bookings: 35 },
  { date: "Sep 11", bookings: 46 },
  { date: "Sep 13", bookings: 42 },
  { date: "Sep 15", bookings: 54 },
  { date: "Sep 17", bookings: 49 },
  { date: "Sep 19", bookings: 61 },
  { date: "Sep 21", bookings: 57 },
  { date: "Sep 23", bookings: 69 },
  { date: "Sep 25", bookings: 63 },
  { date: "Sep 27", bookings: 76 },
  { date: "Sep 30", bookings: 84 },
];

const bookingStatusData = [
  { name: "Completed", value: 1032, color: "#268b16" },
  { name: "Pending", value: 74, color: "#f5a623" },
  { name: "Cancelled", value: 142, color: "#ef5350" },
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const formatNumber = (value) =>
  Number(value).toLocaleString("en-IN");

const BarberGrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="barber-stats__tooltip">
      <span>{label}</span>
      <strong>{formatNumber(payload[0].value)} bookings</strong>
    </div>
  );
};

const BookingStatusTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="barber-stats__tooltip">
      <span>{item.name}</span>
      <strong>{formatNumber(item.value)} bookings</strong>
    </div>
  );
};

const Barber = () => {
  const [dateRange, setDateRange] = useState("30");

  const totalBookings = bookingStatusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="barber-stats">
      <div className="barber-stats__demo-notice">
        Demo analytics — figures are illustrative, not live barber data.
      </div>

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

              <h3>{kpi.value}</h3>

              <div className="barber-stats__kpi-trend">
                <TrendingUp size={15} />
                <strong>{kpi.change}</strong>
                <span>vs previous period</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="barber-stats__charts">
        {/* BARBER PERFORMANCE OVER TIME */}
        <article className="barber-stats__card barber-stats__growth">
          <div className="barber-stats__card-header">
            <div>
              <h3>Barber Performance</h3>
              <p>Completed bookings over time</p>
            </div>

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              aria-label="Select barber performance date range"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="barber-stats__growth-summary">
            <div>
              <span>Completed bookings</span>
              <strong>1,032</strong>
            </div>

            <div className="barber-stats__positive">
              <TrendingUp size={15} />
              <span>12.5%</span>
            </div>
          </div>

          <div className="barber-stats__growth-chart">
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
          </div>
        </article>

        {/* BOOKING STATUS BREAKDOWN */}
        <article className="barber-stats__card barber-stats__status">
          <div className="barber-stats__card-header">
            <div>
              <h3>Booking Status</h3>
              <p>Distribution of barber bookings</p>
            </div>
          </div>

          <div className="barber-stats__status-chart">
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
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip content={<BookingStatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="barber-stats__status-center">
              <strong>{formatNumber(totalBookings)}</strong>
              <span>Total Bookings</span>
            </div>
          </div>

          <div className="barber-stats__legend">
            {bookingStatusData.map((item) => {
              const percentage =
                totalBookings > 0
                  ? (item.value / totalBookings) * 100
                  : 0;

              return (
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
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Barber;

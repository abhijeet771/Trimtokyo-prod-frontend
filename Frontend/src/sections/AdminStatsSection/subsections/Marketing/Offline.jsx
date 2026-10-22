import React, { useState } from "react";
import {
  Users,
  UserPlus,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  CalendarDays,
  Store,
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

import "./Offline.scss";

// DEMO DATA — replace with offline marketing analytics API data later.
const offlineKpis = [
  {
    id: "reach",
    title: "Estimated Reach",
    value: "18,450",
    change: "+12.8%",
    icon: Users,
    color: "green",
  },
  {
    id: "acquired",
    title: "New Customers",
    value: "684",
    change: "+16.4%",
    icon: UserPlus,
    color: "blue",
  },
  {
    id: "bookings",
    title: "Bookings Generated",
    value: "428",
    change: "+11.2%",
    icon: CalendarCheck,
    color: "purple",
  },
  {
    id: "revenue",
    title: "Revenue Generated",
    value: "₹1,86,420",
    change: "+19.6%",
    icon: IndianRupee,
    color: "orange",
  },
];

const offlineTrendData = [
  { date: "Sep 1", reach: 420, customers: 18 },
  { date: "Sep 3", reach: 560, customers: 24 },
  { date: "Sep 5", reach: 480, customers: 21 },
  { date: "Sep 7", reach: 720, customers: 32 },
  { date: "Sep 9", reach: 650, customers: 28 },
  { date: "Sep 11", reach: 890, customers: 38 },
  { date: "Sep 13", reach: 780, customers: 34 },
  { date: "Sep 15", reach: 960, customers: 42 },
  { date: "Sep 17", reach: 1100, customers: 47 },
  { date: "Sep 19", reach: 980, customers: 43 },
  { date: "Sep 21", reach: 1280, customers: 56 },
  { date: "Sep 23", reach: 1160, customers: 51 },
  { date: "Sep 25", reach: 1420, customers: 62 },
  { date: "Sep 27", reach: 1580, customers: 71 },
  { date: "Sep 29", reach: 1720, customers: 76 },
  { date: "Sep 30", reach: 1900, customers: 84 },
];

const offlineChannelData = [
  {
    name: "Flyers & Pamphlets",
    value: 185,
    color: "#268b16",
  },
  {
    name: "Referral Cards",
    value: 142,
    color: "#3478f6",
  },
  {
    name: "Local Partnerships",
    value: 96,
    color: "#ff9b35",
  },
  {
    name: "Outdoor Advertising",
    value: 65,
    color: "#9b51e0",
  },
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const formatNumber = (value) =>
  Number(value).toLocaleString("en-IN");

const formatCompact = (value) =>
  value >= 1000
    ? `${(value / 1000).toFixed(1)}K`
    : formatNumber(value);

const OfflineTrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="offline-stats__tooltip">
      <span>{label}</span>

      {payload.map((item) => (
        <div
          className="offline-stats__tooltip-row"
          key={item.dataKey}
        >
          <span
            className="offline-stats__tooltip-dot"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.name}</span>
          <strong>{formatNumber(item.value)}</strong>
        </div>
      ))}
    </div>
  );
};

const OfflineChannelTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="offline-stats__tooltip">
      <span>{item.name}</span>
      <strong>{formatNumber(item.value)} attributed bookings</strong>
    </div>
  );
};

const Offline = () => {
  const [dateRange, setDateRange] = useState("30");

  const totalAttributedBookings = offlineChannelData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="offline-stats">
      <div className="offline-stats__demo-notice">
        Demo analytics — figures are illustrative, not live offline marketing data.
      </div>

      {/* KPI CARDS */}
      <div className="offline-stats__kpis">
        {offlineKpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article
              key={kpi.id}
              className={`offline-stats__kpi offline-stats__kpi--${kpi.color}`}
            >
              <div className="offline-stats__kpi-top">
                <div className="offline-stats__kpi-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <span>{kpi.title}</span>
              </div>

              <h3>{kpi.value}</h3>

              <div className="offline-stats__kpi-trend">
                <TrendingUp size={15} />
                <strong>{kpi.change}</strong>
                <span>vs previous period</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* OFFLINE MARKETING TREND */}
      <article className="offline-stats__card offline-stats__trend-card">
        <div className="offline-stats__card-header">
          <div>
            <h3>Offline Marketing Trend</h3>
            <p>Estimated reach and new customers acquired over time</p>
          </div>

          <label className="offline-stats__date-filter">
            <CalendarDays size={16} />

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              aria-label="Select offline marketing date range"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="offline-stats__chart-legend">
          <span>
            <i className="offline-stats__legend-dot is-green" />
            Estimated Reach
          </span>

          <span>
            <i className="offline-stats__legend-dot is-blue" />
            New Customers
          </span>
        </div>

        <div className="offline-stats__trend-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={offlineTrendData}
              margin={{ top: 12, right: 12, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="offlineReachGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#268b16"
                    stopOpacity={0.23}
                  />
                  <stop
                    offset="95%"
                    stopColor="#268b16"
                    stopOpacity={0.015}
                  />
                </linearGradient>

                <linearGradient
                  id="offlineCustomersGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#3478f6"
                    stopOpacity={0.16}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3478f6"
                    stopOpacity={0.01}
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
                yAxisId="reach"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#849084", fontSize: 11 }}
                tickFormatter={formatCompact}
              />

              <YAxis
                yAxisId="customers"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#849084", fontSize: 11 }}
                allowDecimals={false}
                width={35}
              />

              <Tooltip content={<OfflineTrendTooltip />} />

              <Area
                yAxisId="reach"
                type="monotone"
                dataKey="reach"
                name="Estimated Reach"
                stroke="#268b16"
                strokeWidth={2.5}
                fill="url(#offlineReachGradient)"
                activeDot={{ r: 4 }}
              />

              <Area
                yAxisId="customers"
                type="monotone"
                dataKey="customers"
                name="New Customers"
                stroke="#3478f6"
                strokeWidth={2.2}
                fill="url(#offlineCustomersGradient)"
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* OFFLINE CHANNEL BREAKDOWN */}
      <article className="offline-stats__card offline-stats__channel-card">
        <div className="offline-stats__card-header">
          <div>
            <h3>Bookings by Offline Channel</h3>
            <p>Attributed bookings generated through offline marketing</p>
          </div>
        </div>

        <div className="offline-stats__channel-layout">
          <div className="offline-stats__pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={offlineChannelData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {offlineChannelData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip content={<OfflineChannelTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="offline-stats__pie-center">
              <strong>
                {formatNumber(totalAttributedBookings)}
              </strong>
              <span>Attributed Bookings</span>
            </div>
          </div>

          <div className="offline-stats__channel-legend">
            {offlineChannelData.map((item) => {
              const percentage =
                totalAttributedBookings > 0
                  ? (item.value / totalAttributedBookings) * 100
                  : 0;

              return (
                <div
                  className="offline-stats__channel-row"
                  key={item.name}
                >
                  <div className="offline-stats__channel-label">
                    <i
                      className="offline-stats__legend-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="offline-stats__channel-value">
                    <strong>{formatNumber(item.value)}</strong>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </section>
  );
};

export default Offline;

import React, { useState } from "react";
import {
  Users,
  Eye,
  Heart,
  MousePointerClick,
  TrendingUp,
  CalendarDays,
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

import "./Online.scss";

// DEMO DATA — replace with social media analytics API data later.
const onlineKpis = [
  {
    id: "reach",
    title: "Total Reach",
    value: "124.5K",
    change: "+18.2%",
    icon: Users,
    color: "green",
  },
  {
    id: "impressions",
    title: "Total Impressions",
    value: "286.3K",
    change: "+14.6%",
    icon: Eye,
    color: "blue",
  },
  {
    id: "engagements",
    title: "Engagements",
    value: "18.4K",
    change: "+22.1%",
    icon: Heart,
    color: "purple",
  },
  {
    id: "clicks",
    title: "Link Clicks",
    value: "3,892",
    change: "+22.1%",
    icon: MousePointerClick,
    color: "orange",
  },
];

const engagementTrendData = [
  { date: "Sep 1", reach: 2800, engagements: 1200 },
  { date: "Sep 3", reach: 3900, engagements: 1500 },
  { date: "Sep 5", reach: 6200, engagements: 1800 },
  { date: "Sep 7", reach: 4800, engagements: 1600 },
  { date: "Sep 9", reach: 5300, engagements: 1900 },
  { date: "Sep 11", reach: 7100, engagements: 2400 },
  { date: "Sep 13", reach: 7900, engagements: 2900 },
  { date: "Sep 15", reach: 6500, engagements: 2100 },
  { date: "Sep 17", reach: 7200, engagements: 2300 },
  { date: "Sep 19", reach: 10400, engagements: 3200 },
  { date: "Sep 21", reach: 9200, engagements: 3900 },
  { date: "Sep 23", reach: 9800, engagements: 3100 },
  { date: "Sep 25", reach: 12600, engagements: 3600 },
  { date: "Sep 27", reach: 15100, engagements: 4200 },
  { date: "Sep 29", reach: 16900, engagements: 4800 },
  { date: "Sep 30", reach: 20000, engagements: 5200 },
];

const socialPlatformData = [
  {
    name: "Instagram",
    value: 18600,
    color: "#E1306C",
  },
  {
    name: "Facebook",
    value: 12400,
    color: "#1877F2",
  },
  {
    name: "X",
    value: 7200,
    color: "#242424",
  },
  {
    name: "YouTube",
    value: 4600,
    color: "#FF3030",
  },
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const formatNumber = (value) =>
  Number(value).toLocaleString("en-IN");

const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="online-stats__tooltip">
      <span>{label}</span>

      {payload.map((item) => (
        <div className="online-stats__tooltip-row" key={item.dataKey}>
          <span
            className="online-stats__tooltip-dot"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.name}</span>
          <strong>{formatNumber(item.value)}</strong>
        </div>
      ))}
    </div>
  );
};

const PlatformTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="online-stats__tooltip">
      <span>{item.name}</span>
      <strong>{formatNumber(item.value)} followers</strong>
    </div>
  );
};

const Online = () => {
  const [dateRange, setDateRange] = useState("30");

  const totalFollowers = socialPlatformData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="online-stats">
      <div className="online-stats__demo-notice">
        Demo analytics — figures are illustrative, not live social media data.
      </div>

      {/* KPI CARDS */}
      <div className="online-stats__kpis">
        {onlineKpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article
              key={kpi.id}
              className={`online-stats__kpi online-stats__kpi--${kpi.color}`}
            >
              <div className="online-stats__kpi-top">
                <div className="online-stats__kpi-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <span>{kpi.title}</span>
              </div>

              <h3>{kpi.value}</h3>

              <div className="online-stats__kpi-trend">
                <TrendingUp size={15} />
                <strong>{kpi.change}</strong>
                <span>vs previous period</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* REACH & ENGAGEMENT TREND */}
      <article className="online-stats__card online-stats__trend-card">
        <div className="online-stats__card-header">
          <div>
            <h3>Reach & Engagement Trend</h3>
            <p>Social media reach and engagements over time</p>
          </div>

          <label className="online-stats__date-filter">
            <CalendarDays size={16} />

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              aria-label="Select social media date range"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="online-stats__chart-legend">
          <span>
            <i className="online-stats__legend-dot is-green" />
            Reach
          </span>

          <span>
            <i className="online-stats__legend-dot is-blue" />
            Engagements
          </span>
        </div>

        <div className="online-stats__trend-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={engagementTrendData}
              margin={{ top: 12, right: 12, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="onlineReachGradient"
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
                  id="onlineEngagementGradient"
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
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#849084", fontSize: 11 }}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `${value / 1000}K`
                    : value
                }
              />

              <Tooltip content={<TrendTooltip />} />

              <Area
                type="monotone"
                dataKey="reach"
                name="Reach"
                stroke="#268b16"
                strokeWidth={2.5}
                fill="url(#onlineReachGradient)"
                activeDot={{ r: 4 }}
              />

              <Area
                type="monotone"
                dataKey="engagements"
                name="Engagements"
                stroke="#3478f6"
                strokeWidth={2.2}
                fill="url(#onlineEngagementGradient)"
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      {/* FOLLOWERS BY SOCIAL PLATFORM */}
      <article className="online-stats__card online-stats__platform-card">
        <div className="online-stats__card-header">
          <div>
            <h3>Followers by Platform</h3>
            <p>Audience distribution across social platforms</p>
          </div>
        </div>

        <div className="online-stats__platform-layout">
          <div className="online-stats__pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={socialPlatformData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {socialPlatformData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip content={<PlatformTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="online-stats__pie-center">
              <strong>
                {(totalFollowers / 1000).toFixed(1)}K
              </strong>
              <span>Total Followers</span>
            </div>
          </div>

          <div className="online-stats__platform-legend">
            {socialPlatformData.map((item) => {
              const percentage =
                totalFollowers > 0
                  ? (item.value / totalFollowers) * 100
                  : 0;

              return (
                <div
                  className="online-stats__platform-row"
                  key={item.name}
                >
                  <div className="online-stats__platform-label">
                    <i
                      className="online-stats__legend-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="online-stats__platform-value">
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

export default Online;

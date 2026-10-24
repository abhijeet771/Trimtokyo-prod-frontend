import React, { useState } from "react";
import {
  Users as UsersIcon,
  UserPlus,
  Smartphone,
  Globe,
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

import "./Users.scss";

// DEMO DATA — replace with API data later.
const userKpis = [
  {
    id: "total",
    title: "Total Users",
    value: "892",
    change: "+10.4%",
    icon: UsersIcon,
    color: "green",
  },
  {
    id: "new",
    title: "New Users",
    value: "124",
    change: "+14.2%",
    icon: UserPlus,
    color: "blue",
  },
  {
    id: "app",
    title: "App Users",
    value: "568",
    change: "+12.8%",
    icon: Smartphone,
    color: "purple",
  },
  {
    id: "website",
    title: "Website Users",
    value: "324",
    change: "+6.5%",
    icon: Globe,
    color: "orange",
  },
];

const userGrowthData = [
  { date: "Sep 1", users: 32 },
  { date: "Sep 3", users: 45 },
  { date: "Sep 5", users: 39 },
  { date: "Sep 7", users: 58 },
  { date: "Sep 9", users: 51 },
  { date: "Sep 11", users: 72 },
  { date: "Sep 13", users: 65 },
  { date: "Sep 15", users: 84 },
  { date: "Sep 17", users: 76 },
  { date: "Sep 19", users: 98 },
  { date: "Sep 21", users: 89 },
  { date: "Sep 23", users: 112 },
  { date: "Sep 25", users: 103 },
  { date: "Sep 27", users: 126 },
  { date: "Sep 30", users: 145 },
];

const platformData = [
  {
    name: "App Users",
    value: 568,
    color: "#268b16",
  },
  {
    name: "Website Users",
    value: 324,
    color: "#8b5cf6",
  },
];

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const UserGrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="users-stats__tooltip">
      <span>{label}</span>
      <strong>{payload[0].value} new users</strong>
    </div>
  );
};

const PlatformTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="users-stats__tooltip">
      <span>{item.name}</span>
      <strong>
        {item.value.toLocaleString("en-IN")} users
      </strong>
    </div>
  );
};

const Users = () => {
  const [dateRange, setDateRange] = useState("30");

  const totalPlatformUsers = platformData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="users-stats">
      <div className="users-stats__demo-notice">
        Demo analytics — figures are illustrative, not live user data.
      </div>

      {/* KPI CARDS */}
      <div className="users-stats__kpis">
        {userKpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article
              key={kpi.id}
              className={`users-stats__kpi users-stats__kpi--${kpi.color}`}
            >
              <div className="users-stats__kpi-top">
                <div className="users-stats__kpi-icon">
                  <Icon size={23} strokeWidth={1.9} />
                </div>

                <span>{kpi.title}</span>
              </div>

              <h3>{kpi.value}</h3>

              <div className="users-stats__kpi-trend">
                <TrendingUp size={15} />
                <strong>{kpi.change}</strong>
                <span>vs previous period</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="users-stats__charts">
        {/* USER GROWTH */}
        <article className="users-stats__card users-stats__growth">
          <div className="users-stats__card-header">
            <div>
              <h3>User Growth</h3>
              <p>New user registrations over time</p>
            </div>

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              aria-label="Select user growth date range"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="users-stats__growth-summary">
            <div>
              <span>New registrations</span>
              <strong>124</strong>
            </div>

            <div className="users-stats__positive">
              <TrendingUp size={15} />
              <span>14.2%</span>
            </div>
          </div>

          <div className="users-stats__growth-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={userGrowthData}
                margin={{
                  top: 12,
                  right: 10,
                  left: -18,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="userGrowthGradient"
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

                <Tooltip content={<UserGrowthTooltip />} />

                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#268b16"
                  strokeWidth={2.5}
                  fill="url(#userGrowthGradient)"
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

        {/* APP VS WEBSITE USERS */}
        <article className="users-stats__card users-stats__platform">
          <div className="users-stats__card-header">
            <div>
              <h3>Users by Platform</h3>
              <p>App users vs website users</p>
            </div>
          </div>

          <div className="users-stats__platform-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="82%"
                  paddingAngle={4}
                  stroke="none"
                >
                  {platformData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip content={<PlatformTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="users-stats__platform-center">
              <strong>
                {totalPlatformUsers.toLocaleString("en-IN")}
              </strong>
              <span>Total Users</span>
            </div>
          </div>

          <div className="users-stats__legend">
            {platformData.map((item) => {
              const percentage =
                totalPlatformUsers > 0
                  ? (item.value / totalPlatformUsers) * 100
                  : 0;

              return (
                <div
                  className="users-stats__legend-item"
                  key={item.name}
                >
                  <div className="users-stats__legend-label">
                    <span
                      className="users-stats__legend-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="users-stats__legend-value">
                    <strong>
                      {item.value.toLocaleString("en-IN")}
                    </strong>
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

export default Users;

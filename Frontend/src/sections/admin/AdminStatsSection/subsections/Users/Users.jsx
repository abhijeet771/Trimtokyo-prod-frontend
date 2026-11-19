
import React, { useMemo, useState } from "react";
import {
  Users as UsersIcon,
  UserPlus,
  Repeat2,
  BadgeCheck,
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

import useAdminAnalytics from "../../../../../hooks/admin/useAdminAnalytics";
import "./Users.scss";

const RANGE_OPTIONS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

const getDateFilters = (days) => {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - Number(days) + 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatChartDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
};

const UserGrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="users-stats__tooltip">
      <span>{label}</span>
      <strong>{formatNumber(payload[0].value)} new users</strong>
    </div>
  );
};

const VerificationTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="users-stats__tooltip">
      <span>{item.name}</span>
      <strong>{formatNumber(item.value)} users</strong>
    </div>
  );
};

const Users = () => {
  const [dateRange, setDateRange] = useState("30");

  const filters = useMemo(
    () => getDateFilters(dateRange),
    [dateRange]
  );

  const {
    analytics,
    loading,
    error,
    refetch,
  } = useAdminAnalytics(filters, "users");

  const summary = analytics?.summary || {};

  const totalUsers = Number(summary.totalUsers || 0);
  const newUsers = Number(summary.newUsers || 0);
  const repeatCustomers = Number(summary.repeatCustomers || 0);
  const verifiedUsers = Number(summary.verifiedUsers || 0);

  const unverifiedUsers = Math.max(
    totalUsers - verifiedUsers,
    0
  );

  const userGrowthData = (analytics?.userGrowth || []).map(
    (item) => ({
      date: formatChartDate(item.date),
      users: Number(item.users || 0),
    })
  );

  const verificationData = [
    {
      name: "Verified Users",
      value: verifiedUsers,
      color: "#268b16",
    },
    {
      name: "Unverified Users",
      value: unverifiedUsers,
      color: "#f59e0b",
    },
  ];

  const totalVerificationUsers = verificationData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const userKpis = [
    {
      id: "total",
      title: "Total Users",
      value: totalUsers,
      icon: UsersIcon,
      color: "green",
    },
    {
      id: "new",
      title: "New Users",
      value: newUsers,
      icon: UserPlus,
      color: "blue",
    },
    {
      id: "repeat",
      title: "Repeat Customers",
      value: repeatCustomers,
      icon: Repeat2,
      color: "purple",
    },
    {
      id: "verified",
      title: "Verified Users",
      value: verifiedUsers,
      icon: BadgeCheck,
      color: "orange",
    },
  ];

  return (
    <section className="users-stats">
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

              <h3>
                {loading ? "—" : formatNumber(kpi.value)}
              </h3>

              <div className="users-stats__kpi-trend">
                <span>
                  {kpi.id === "total"
                    ? "All registered users"
                    : kpi.id === "new"
                    ? "Selected period"
                    : kpi.id === "repeat"
                    ? "More than one order in period"
                    : "Phone verified"}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {error && (
        <div className="users-stats__error">
          <span>{error}</span>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

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
              <strong>
                {loading ? "—" : formatNumber(newUsers)}
              </strong>
            </div>
          </div>

          <div className="users-stats__growth-chart">
            {loading ? (
              <div className="users-stats__chart-message">
                Loading user growth...
              </div>
            ) : userGrowthData.length === 0 ? (
              <div className="users-stats__chart-message">
                No user registrations found for this period.
              </div>
            ) : (
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
            )}
          </div>
        </article>

        {/* VERIFIED VS UNVERIFIED USERS */}
        <article className="users-stats__card users-stats__platform">
          <div className="users-stats__card-header">
            <div>
              <h3>User Verification</h3>
              <p>Verified vs unverified users</p>
            </div>
          </div>

          <div className="users-stats__platform-chart">
            {loading ? (
              <div className="users-stats__chart-message">
                Loading verification data...
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="82%"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {verificationData.map((item) => (
                        <Cell
                          key={item.name}
                          fill={item.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip content={<VerificationTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="users-stats__platform-center">
                  <strong>
                    {formatNumber(totalVerificationUsers)}
                  </strong>
                  <span>Total Users</span>
                </div>
              </>
            )}
          </div>

          <div className="users-stats__legend">
            {verificationData.map((item) => {
              const percentage =
                totalVerificationUsers > 0
                  ? (item.value / totalVerificationUsers) * 100
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

export default Users;

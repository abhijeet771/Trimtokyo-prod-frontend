import React, { useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Wallet,
  ReceiptText,
  TrendingUp,
  CalendarDays,
  House,
  Clock3,
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

import "./RevenueSales.scss";

// DEMO DATA — replace with analytics API responses later.
const revenueKpis = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "₹4,86,320",
    change: "+18.2%",
    icon: IndianRupee,
    color: "green",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: "1,248",
    change: "+12.5%",
    icon: ShoppingCart,
    color: "blue",
  },
  {
    id: "average",
    title: "Average Order Value",
    value: "₹389",
    change: "+6.1%",
    icon: Wallet,
    color: "purple",
  },
  {
    id: "completed",
    title: "Completed Revenue",
    value: "₹4,12,640",
    change: "+15.3%",
    icon: ReceiptText,
    color: "orange",
  },
];

const revenueTrend = [
  { date: "Sep 1", revenue: 5000 },
  { date: "Sep 3", revenue: 6500 },
  { date: "Sep 5", revenue: 8000 },
  { date: "Sep 7", revenue: 12000 },
  { date: "Sep 9", revenue: 9500 },
  { date: "Sep 11", revenue: 12500 },
  { date: "Sep 13", revenue: 17000 },
  { date: "Sep 15", revenue: 14500 },
  { date: "Sep 17", revenue: 18000 },
  { date: "Sep 19", revenue: 23000 },
  { date: "Sep 21", revenue: 18500 },
  { date: "Sep 23", revenue: 17000 },
  { date: "Sep 25", revenue: 22000 },
  { date: "Sep 27", revenue: 28000 },
  { date: "Sep 29", revenue: 26000 },
  { date: "Sep 30", revenue: 31000 },
];

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
  `₹${Number(value).toLocaleString("en-IN")}`;

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

const RevenuePieCard = ({
  title,
  subtitle,
  icon: Icon,
  data,
  total,
}) => {
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
            <span>Total Revenue</span>
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
                  <strong>
                    {Math.round(percentage)}%
                  </strong>
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

  return (
    <section className="revenue-sales">
      <div className="revenue-sales__demo-notice">
        Demo analytics — all figures are illustrative, not live
        business data.
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
                <h3>{kpi.value}</h3>

                <div className="revenue-sales__kpi-trend">
                  <TrendingUp size={15} />
                  <strong>{kpi.change}</strong>
                </div>

                <small>vs previous period</small>
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
          <strong>₹4,86,320</strong>
          <span className="revenue-sales__positive">
            <TrendingUp size={15} />
            +18.2%
          </span>
        </div>

        <div className="revenue-sales__area-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTrend}
              margin={{ top: 12, right: 12, left: -12, bottom: 0 }}
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
        </div>
      </article>

      {/* THREE REVENUE BREAKDOWNS */}
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

      {/* TOP BARBERS TABLE */}
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

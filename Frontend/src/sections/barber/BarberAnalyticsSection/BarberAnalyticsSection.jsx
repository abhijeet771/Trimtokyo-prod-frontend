import React, { useMemo, useState } from "react";
import {  Wallet,  ShoppingBag,  Users,  Receipt,  Scissors,  TrendingUp,ChartColumn,  UsersRound,  CalendarDays,
  BarChart3,  PieChart as PieChartIcon,  Trophy,  ArrowDownRight,  ArrowUpRight,
} from "lucide-react";

import {  ResponsiveContainer,  BarChart,  Bar,  XAxis,  YAxis,  CartesianGrid,  Tooltip,  PieChart,  Pie,  Cell,} from "recharts";

import {  ANALYTICS_PERIODS,  ANALYTICS_KPIS,  ANALYTICS_EARNINGS_BY_DAY,  ANALYTICS_SERVICE_EARNINGS,
  ANALYTICS_CUSTOMER_METRICS,
  ANALYTICS_DATE_RANGE,
} from "../../../constants/barberAnalytics";

import "./BarberAnalyticsSection.scss";

const ICONS = {  Wallet,  ShoppingBag,  Users,  Receipt,  Scissors,TrendingUp,  ChartColumn,
  UsersRound,
};

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

const formatCompactCurrency = (value) => {
  if (value >= 1000) {
    return `₹${Number(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }

  return `₹${value}`;
};

const EarningsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="barber-analytics__tooltip">
      <span>{label}</span>
      <strong>{formatCurrency(payload[0].value)}</strong>
    </div>
  );
};

const ServiceTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="barber-analytics__tooltip">
      <span>{item.name}</span>
      <strong>{formatCurrency(item.amount)}</strong>
    </div>
  );
};

const BarberAnalyticsSection = () => {
  const [period, setPeriod] = useState("7");

  const earningsData = useMemo(() => {
    if (period === "7") {
      return ANALYTICS_EARNINGS_BY_DAY;
    }

    const count = Number(period);

    return Array.from({ length: count }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - index - 1));

      return {
        day: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        shortDay: date.toLocaleDateString("en-IN", {
          day: "numeric",
        }),
        earnings: Math.round(500 + Math.random() * 2000),
      };
    });
  }, [period]);

  const totalEarnings = ANALYTICS_SERVICE_EARNINGS.reduce(
    (total, service) => total + service.amount,
    0
  );

  const highestEarningDay = earningsData.reduce(
    (highest, day) =>
      day.earnings > highest.earnings ? day : highest,
    earningsData[0]
  );

  const lowestEarningDay = earningsData.reduce(
    (lowest, day) =>
      day.earnings < lowest.earnings ? day : lowest,
    earningsData[0]
  );

  const dateRange =
    period === "7"
      ? `${ANALYTICS_DATE_RANGE.start} - ${ANALYTICS_DATE_RANGE.end}`
      : `Last ${period} days`;

  return (
    <section className="barber-analytics">
      {/* Page heading */}
      <header className="barber-analytics__header">
        <div>
          <span className="barber-analytics__eyebrow">
            BARBER WORKSPACE
          </span>

          <h1>Earnings Analytics</h1>

          <p>
            Track your earnings, services, orders and customer activity.
          </p>
        </div>
      </header>

      {/* Date range */}
      <div className="barber-analytics__date-range">
        <CalendarDays size={19} />

        <span>{dateRange}</span>
      </div>

      {/* KPIs appear ABOVE all charts */}
      <section
        className="barber-analytics__kpi-section"
        aria-label="Analytics key performance indicators"
      >
        <div className="barber-analytics__section-heading">
          <div>
            <h2>Performance Overview</h2>
            <p>Your key business metrics at a glance.</p>
          </div>

          <span className="barber-analytics__period-label">
            {period === "7" ? "Last 7 Days" : `Last ${period} Days`}
          </span>
        </div>

        <div className="barber-analytics__kpi-grid">
          {ANALYTICS_KPIS.map((kpi) => {
            const Icon = ICONS[kpi.icon];

            return (
              <article
                key={kpi.id}
                className="barber-analytics__kpi-card"
              >
                <div
                  className={`barber-analytics__icon barber-analytics__icon--${kpi.accent}`}
                >
                  <Icon size={21} />
                </div>

                <div className="barber-analytics__kpi-details">
                  <span className="barber-analytics__kpi-label">
                    {kpi.label}
                  </span>

                  <strong className="barber-analytics__kpi-value">
                    {kpi.value}
                  </strong>

                  <span className="barber-analytics__kpi-change">
                    <ArrowUpRight size={14} />
                    {kpi.change}
                  </span>
                </div>

                <p className="barber-analytics__kpi-description">
                  {kpi.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Earnings by day */}
      <section className="barber-analytics__panel">
        <div className="barber-analytics__panel-heading">
          <div className="barber-analytics__panel-title">
            <div className="barber-analytics__icon barber-analytics__icon--purple">
              <BarChart3 size={21} />
            </div>

            <div>
              <h2>Earnings by Day</h2>
              <p>Daily revenue breakdown</p>
            </div>
          </div>

          <select
            className="barber-analytics__period-select"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Select analytics period"
          >
            {ANALYTICS_PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="barber-analytics__chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={earningsData}
              margin={{ top: 12, right: 4, left: -12, bottom: 0 }}
              barCategoryGap={period === "7" ? "35%" : "20%"}
            >
              <CartesianGrid
                vertical={false}
                stroke="#ececf4"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="shortDay"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737b8d", fontSize: 12 }}
                dy={8}
                interval={period === "90" ? 6 : period === "30" ? 2 : 0}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737b8d", fontSize: 11 }}
                tickFormatter={formatCompactCurrency}
                width={49}
              />

              <Tooltip
                content={<EarningsTooltip />}
                cursor={{ fill: "#f4f1ff" }}
              />

              <Bar
                dataKey="earnings"
                fill="#8a78f1"
                radius={[6, 6, 0, 0]}
                maxBarSize={period === "7" ? 48 : 24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="barber-analytics__earning-highlights">
          <article className="barber-analytics__highlight-card">
            <div className="barber-analytics__icon barber-analytics__icon--orange">
              <Trophy size={21} />
            </div>

            <div>
              <span>Highest Earning Day</span>
              <strong>{formatCurrency(highestEarningDay.earnings)}</strong>
              <small>{highestEarningDay.day}</small>
            </div>
          </article>

          <article className="barber-analytics__highlight-card">
            <div className="barber-analytics__icon barber-analytics__icon--red">
              <ArrowDownRight size={22} />
            </div>

            <div>
              <span>Lowest Earning Day</span>
              <strong>{formatCurrency(lowestEarningDay.earnings)}</strong>
              <small>{lowestEarningDay.day}</small>
            </div>
          </article>
        </div>
      </section>

      {/* Service-wise earnings */}
      <section className="barber-analytics__panel">
        <div className="barber-analytics__panel-heading">
          <div className="barber-analytics__panel-title">
            <div className="barber-analytics__icon barber-analytics__icon--purple">
              <PieChartIcon size={21} />
            </div>

            <div>
              <h2>Service-wise Earnings</h2>
              <p>Revenue contribution by service</p>
            </div>
          </div>
        </div>

        <div className="barber-analytics__service-layout">
          <div className="barber-analytics__donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ANALYTICS_SERVICE_EARNINGS}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={2}
                  stroke="none"
                >
                  {ANALYTICS_SERVICE_EARNINGS.map((service) => (
                    <Cell
                      key={service.name}
                      fill={service.color}
                    />
                  ))}
                </Pie>

                <Tooltip content={<ServiceTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="barber-analytics__donut-center">
              <strong>{formatCurrency(totalEarnings)}</strong>
              <span>Total Earnings</span>
            </div>
          </div>

          <div className="barber-analytics__service-list">
            {ANALYTICS_SERVICE_EARNINGS.map((service) => (
              <div
                className="barber-analytics__service-row"
                key={service.name}
              >
                <div className="barber-analytics__service-name">
                  <span
                    className="barber-analytics__legend-dot"
                    style={{ backgroundColor: service.color }}
                  />

                  <span>{service.name}</span>
                </div>

                <span className="barber-analytics__service-percentage">
                  {service.percentage}%
                </span>

                <strong>
                  {formatCurrency(service.amount)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Orders and customers */}
      <section className="barber-analytics__panel">
        <div className="barber-analytics__panel-heading">
          <div className="barber-analytics__panel-title">
            <div className="barber-analytics__icon barber-analytics__icon--purple">
              <UsersRound size={21} />
            </div>

            <div>
              <h2>Orders &amp; Customers</h2>
              <p>Understand your customer activity</p>
            </div>
          </div>
        </div>

        <div className="barber-analytics__customer-grid">
          {ANALYTICS_CUSTOMER_METRICS.map((metric) => {
            const Icon = ICONS[metric.icon];

            return (
              <article
                className="barber-analytics__customer-card"
                key={metric.id}
              >
                <div
                  className={`barber-analytics__icon barber-analytics__icon--${metric.accent}`}
                >
                  <Icon size={21} />
                </div>

                <div className="barber-analytics__customer-info">
                  <div className="barber-analytics__customer-value-row">
                    <strong>{metric.value}</strong>

                    {metric.change && (
                      <span className="barber-analytics__customer-change">
                        <ArrowUpRight size={13} />
                        {metric.change}
                      </span>
                    )}
                  </div>

                  <span>{metric.label}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default BarberAnalyticsSection;


import React from "react";
import {
  CalendarDays,
  Clock3,
  CircleCheck,
  CheckCheck,
  PieChart as PieChartIcon,
  ChartColumnIncreasing,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import "./Overview.scss";

// Illustrative data; replace with API data when the backend is integrated.
const overviewStats = [
  {
    title: "Total Bookings",
    value: "248",
    subtitle: "All event bookings",
    icon: CalendarDays,
    color: "green",
  },
  {
    title: "Pending",
    value: "32",
    subtitle: "Awaiting confirmation",
    icon: Clock3,
    color: "orange",
  },
  {
    title: "Confirmed",
    value: "164",
    subtitle: "Approved bookings",
    icon: CircleCheck,
    color: "blue",
  },
  {
    title: "Completed",
    value: "52",
    subtitle: "Successfully completed",
    icon: CheckCheck,
    color: "purple",
  },
];

const eventTypeData = [
  { name: "Marriage / Wedding", value: 112, color: "#268b16" },
  { name: "Mundan", value: 68, color: "#4385f5" },
  { name: "Upanayanam", value: 42, color: "#9b6af5" },
  { name: "Party", value: 18, color: "#f2a93b" },
  { name: "Corporate", value: 8, color: "#e76f91" },
];

const preferredServicesData = [
  { name: "Haircut", bookings: 186 },
  { name: "Beard Styling", bookings: 142 },
  { name: "Hair Styling", bookings: 118 },
  { name: "Facial", bookings: 86 },
  { name: "Groom Package", bookings: 64 },
];

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="event-overview__tooltip">
      {label && <p className="event-overview__tooltip-label">{label}</p>}

      {payload.map((item, index) => (
        <p key={`${item.name}-${index}`}>
          <span
            className="event-overview__tooltip-dot"
            style={{ backgroundColor: item.color || item.payload?.color }}
          />
          <span>{item.name}: </span>
          <strong>{formatNumber(Number(item.value) || 0)}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Overview() {
  const totalEventTypes = eventTypeData.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <section className="event-overview">
      {/* KPI Cards */}
      <div className="event-overview__stats">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className={`event-overview__stat-card event-overview__stat-card--${stat.color}`}
              key={stat.title}
            >
              <div className="event-overview__stat-top">
                <div className="event-overview__stat-icon">
                  <Icon size={22} strokeWidth={1.9} />
                </div>

                <span className="event-overview__stat-indicator">
                  <span />
                  Live overview
                </span>
              </div>

              <div className="event-overview__stat-details">
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
                <span>{stat.subtitle}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Event Type Distribution */}
      <div className="event-overview__charts">
        <article className="event-overview__chart-card event-overview__chart-card--distribution">
          <div className="event-overview__chart-header">
            <div className="event-overview__chart-heading-icon">
              <PieChartIcon size={19} />
            </div>

            <div>
              <h3>Event Type Distribution</h3>
              <p>Bookings by event category</p>
            </div>
          </div>

          <div className="event-overview__pie-layout">
            <div className="event-overview__pie-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {eventTypeData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="event-overview__pie-center">
                <strong>{formatNumber(totalEventTypes)}</strong>
                <span>Bookings</span>
              </div>
            </div>

            <div className="event-overview__legend">
              {eventTypeData.map((item) => {
                const percentage = (
                  (item.value / totalEventTypes) *
                  100
                ).toFixed(1);

                return (
                  <div
                    className="event-overview__legend-item"
                    key={item.name}
                  >
                    <span
                      className="event-overview__legend-dot"
                      style={{ backgroundColor: item.color }}
                    />

                    <div className="event-overview__legend-details">
                      <span>{item.name}</span>
                      <strong>{formatNumber(item.value)}</strong>
                    </div>

                    <span className="event-overview__legend-percent">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* Preferred Services */}
        <article className="event-overview__chart-card event-overview__chart-card--services">
          <div className="event-overview__chart-header">
            <div className="event-overview__chart-heading-icon event-overview__chart-heading-icon--services">
              <ChartColumnIncreasing size={19} />
            </div>

            <div>
              <h3>Preferred Services</h3>
              <p>Most booked services for event customers</p>
            </div>
          </div>

          <div className="event-overview__bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={preferredServicesData}
                layout="vertical"
                margin={{
                  top: 8,
                  right: 24,
                  bottom: 4,
                  left: 8,
                }}
              >
                <CartesianGrid
                  stroke="#edf0eb"
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#858d80", fontSize: 11 }}
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={108}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#525b4e", fontSize: 11 }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill="#268b16"
                  radius={[0, 5, 5, 0]}
                  barSize={19}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="event-overview__chart-footer">
            <span className="event-overview__footer-dot" />
            <span>Ranked by booking volume</span>
          </div>
        </article>
      </div>
    </section>
  );
}

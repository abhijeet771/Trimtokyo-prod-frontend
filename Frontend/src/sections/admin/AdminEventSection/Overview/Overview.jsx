
import React, { useEffect } from "react";
import {
  CalendarDays,
  Clock3,
  CircleCheck,
  CheckCheck,
  PieChart as PieChartIcon,
  ChartColumnIncreasing,
  XCircle,
  Activity,
  Layers,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import useEventBooking from "../../../../hooks/admin/useEventBooking";

import "./Overview.scss";

const COLORS = [
  "#268b16",
  "#4385f5",
  "#9b6af5",
  "#f2a93b",
  "#e76f91",
  "#16a6a1",
  "#e07835",
  "#64748b",
];

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(value ?? 0);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="event-overview__tooltip">
      {label && (
        <p className="event-overview__tooltip-label">{label}</p>
      )}

      {payload.map((item, index) => (
        <p key={`${item.name}-${index}`}>
          <span
            className="event-overview__tooltip-dot"
            style={{
              backgroundColor:
                item.color || item.payload?.color,
            }}
          />
          <span>{item.name}: </span>
          <strong>
            {formatNumber(Number(item.value) || 0)}
          </strong>
        </p>
      ))}
    </div>
  );
};

export default function Overview() {
  const {
    summary,
    categoryDistribution,
    dashboardLoading,
    fetchDashboard,
  } = useEventBooking();

  useEffect(() => {
    fetchDashboard().catch(() => {});
  }, [fetchDashboard]);

  const totalBookings = summary.totalBookings ?? 0;
  const pending = summary.pending ?? 0;
  const confirmed = summary.confirmed ?? 0;
  const completed = summary.completed ?? 0;
  const cancelled = summary.cancelled ?? 0;

  const activeBookings = pending + confirmed;

  const completionRate =
    totalBookings > 0
      ? ((completed / totalBookings) * 100).toFixed(1)
      : "0.0";

  const overviewStats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      subtitle: "All event bookings",
      icon: CalendarDays,
      color: "green",
    },
    {
      title: "Pending",
      value: pending,
      subtitle: "Awaiting confirmation",
      icon: Clock3,
      color: "orange",
    },
    {
      title: "Confirmed",
      value: confirmed,
      subtitle: "Approved bookings",
      icon: CircleCheck,
      color: "blue",
    },
    {
      title: "Completed",
      value: completed,
      subtitle: "Successfully completed",
      icon: CheckCheck,
      color: "purple",
    },
  ];

  const eventTypeData = categoryDistribution.map(
    (item, index) => ({
      name: item.name,
      value: item.count,
      percentage: item.percentage,
      color: COLORS[index % COLORS.length],
    })
  );

  const hasCategoryData = eventTypeData.some(
    (item) => item.value > 0
  );

  return (
    <section className="event-overview">

      {/* KPI CARDS */}
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

                <h3>
                  {dashboardLoading
                    ? "—"
                    : formatNumber(stat.value)}
                </h3>

                <span>{stat.subtitle}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="event-overview__charts">

        {/* EVENT CATEGORY DISTRIBUTION */}
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

          {dashboardLoading ? (
            <div className="event-overview__chart-state">
              Loading event distribution...
            </div>
          ) : !hasCategoryData ? (
            <div className="event-overview__chart-state">
              <PieChartIcon size={32} />
              <h4>No event data available</h4>
              <p>Event category statistics will appear here once bookings are created.</p>
            </div>
          ) : (
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
                  <strong>{formatNumber(totalBookings)}</strong>
                  <span>Bookings</span>
                </div>
              </div>

              <div className="event-overview__legend">
                {eventTypeData.map((item) => (
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
                      {item.percentage?.toFixed(1) ??
                        "0.0"}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* EVENT BOOKING INSIGHTS */}
        <article className="event-overview__chart-card event-overview__chart-card--services">
          <div className="event-overview__chart-header">
            <div className="event-overview__chart-heading-icon event-overview__chart-heading-icon--services">
              <ChartColumnIncreasing size={19} />
            </div>

            <div>
              <h3>Event Booking Insights</h3>
              <p>Overall booking performance</p>
            </div>
          </div>

          {dashboardLoading ? (
            <div className="event-overview__chart-state">
              Loading booking insights...
            </div>
          ) : (
            <div className="event-overview__insights">

              <div className="event-overview__insight-item">
                <div className="event-overview__insight-icon event-overview__insight-icon--green">
                  <Activity size={19} />
                </div>

                <div className="event-overview__insight-details">
                  <span>Active Bookings</span>
                  <strong>{formatNumber(activeBookings)}</strong>
                  <small>Pending + Confirmed</small>
                </div>
              </div>

              <div className="event-overview__insight-item">
                <div className="event-overview__insight-icon event-overview__insight-icon--purple">
                  <CheckCheck size={19} />
                </div>

                <div className="event-overview__insight-details">
                  <span>Completion Rate</span>
                  <strong>{completionRate}%</strong>
                  <small>Completed bookings / Total bookings</small>
                </div>
              </div>

              <div className="event-overview__insight-item">
                <div className="event-overview__insight-icon event-overview__insight-icon--orange">
                  <XCircle size={19} />
                </div>

                <div className="event-overview__insight-details">
                  <span>Cancelled Bookings</span>
                  <strong>{formatNumber(cancelled)}</strong>
                  <small>Cancelled event bookings</small>
                </div>
              </div>

              <div className="event-overview__insight-item">
                <div className="event-overview__insight-icon event-overview__insight-icon--blue">
                  <Layers size={19} />
                </div>

                <div className="event-overview__insight-details">
                  <span>Event Categories</span>
                  <strong>{formatNumber(categoryDistribution.length)}</strong>
                  <small>Categories with bookings</small>
                </div>
              </div>

            </div>
          )}

          <div className="event-overview__chart-footer">
            <span className="event-overview__footer-dot" />
            <span>Based on all event bookings</span>
          </div>
        </article>
      </div>
    </section>
  );
}

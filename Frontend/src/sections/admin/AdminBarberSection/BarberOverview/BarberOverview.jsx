import React, { useMemo } from "react";
import {  Store,  Clock3,  CheckCircle2,  XCircle,  TrendingUp,  Users,} from "lucide-react";

import useBarberOverview from "../../../../hooks/admin/useBarberOverview.js";
import "./BarberOverview.scss";

const STATUS_COLORS = {  APPROVED: "#16a36a",  PENDING: "#f59e0b",  REJECTED: "#ef5261",};

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-IN");

const BarberOverview = () => {
  const {
    summary,
    applicationStatus,
    applicationGrowth,
    loading,
    error,
    refreshOverview,
  } = useBarberOverview();

  const stats = useMemo(() => {
    const total = summary?.totalApplications ?? 0;
    const approved = summary?.approved ?? 0;
    const rejected = summary?.rejected ?? 0;
    const pending = summary?.pendingRequests ?? 0;
    const growth = summary?.growthPercentage ?? 0;

    const rejectedPercentage =
      total > 0 ? ((rejected / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "Total Applications",
        value: total,
        change: `${growth > 0 ? "+" : ""}${growth}% vs last month`,
        icon: Store,
        color: "blue",
      },
      {
        title: "Pending Requests",
        value: pending,
        change: "Awaiting review",
        icon: Clock3,
        color: "orange",
      },
      {
        title: "Approved",
        value: approved,
        change: "Approved applications",
        icon: CheckCircle2,
        color: "green",
      },
      {
        title: "Rejected",
        value: rejected,
        change: `${rejectedPercentage}% of requests`,
        icon: XCircle,
        color: "red",
      },
    ];
  }, [summary]);

  const statusData = useMemo(
    () =>
      (applicationStatus ?? []).map((item) => {
        const label = String(item.status ?? "").toUpperCase();

        return {
          label:
            label.charAt(0) + label.slice(1).toLowerCase(),
          value: Number(item.count ?? 0),
          color: STATUS_COLORS[label] ?? "#94a3b8",
        };
      }),
    [applicationStatus]
  );

  const growthData = useMemo(
    () =>
      (applicationGrowth ?? []).map((item) => ({
        month: item.month,
        value: Number(item.applications ?? 0),
      })),
    [applicationGrowth]
  );

  const total = statusData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const pieGradient = useMemo(() => {
    if (total === 0) {
      return "#e9eef6";
    }

    let accumulated = 0;

    const segments = statusData.map((item) => {
      const start = accumulated;
      accumulated += (item.value / total) * 100;

      return `${item.color} ${start}% ${accumulated}%`;
    });

    return `conic-gradient(${segments.join(", ")})`;
  }, [statusData, total]);

  const chartWidth = 560;
  const chartHeight = 220;
  const left = 35;
  const right = 15;
  const top = 15;
  const bottom = 30;

  const maxValue = Math.max(
    20,
    Math.ceil(
      Math.max(0, ...growthData.map((item) => item.value)) / 20
    ) * 20
  );

  const points = growthData.map((item, index) => ({
    x:
      growthData.length > 1
        ? left +
          (index * (chartWidth - left - right)) /
            (growthData.length - 1)
        : chartWidth / 2,
    y:
      top +
      ((maxValue - item.value) / maxValue) *
        (chartHeight - top - bottom),
    ...item,
  }));

  const line = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const area =
    points.length > 0
      ? `${points[0].x},${chartHeight - bottom} ${line} ${
          points[points.length - 1].x
        },${chartHeight - bottom}`
      : "";

  const latestMonthValue =
    summary?.applicationsThisMonth ??
    growthData[growthData.length - 1]?.value ??
    0;

  return (
    <section className="barber-overview">
      <header className="bo-header">
        <div>
          <span className="bo-eyebrow">BARBER MANAGEMENT</span>
          <h2>Overview</h2>
          <p>Monitor barber applications and request performance.</p>
        </div>

        <button
          type="button"
          className="bo-refresh"
          onClick={refreshOverview}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="bo-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={refreshOverview}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      <div className="bo-kpis">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article className="bo-kpi" key={item.title}>
              <div className={`bo-kpi__icon bo-kpi__icon--${item.color}`}>
                <Icon size={21} />
              </div>

              <p>{item.title}</p>

              <h3>
                {loading && !summary
                  ? "—"
                  : formatNumber(item.value)}
              </h3>

              <span
                className={`bo-kpi__change bo-kpi__change--${item.color}`}
              >
                {item.change}
              </span>
            </article>
          );
        })}
      </div>

      <div className="bo-charts">
        <article className="bo-chart-card">
          <div className="bo-chart-heading">
            <div>
              <h3>Application Status</h3>
              <p>Distribution by request status</p>
            </div>
            <Users size={19} />
          </div>

          <div className="bo-pie-layout">
            <div
              className="bo-pie"
              style={{ background: pieGradient }}
              role="img"
              aria-label={`Application status distribution: ${total} total applications`}
            >
              <div className="bo-pie__center">
                <strong>{formatNumber(total)}</strong>
                <span>Requests</span>
              </div>
            </div>

            <div className="bo-legend">
              {statusData.map((item) => (
                <div className="bo-legend__item" key={item.label}>
                  <span
                    className="bo-legend__dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.label}</span>
                  <strong>{formatNumber(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="bo-chart-card">
          <div className="bo-chart-heading">
            <div>
              <h3>Application Growth</h3>
              <p>Monthly barber applications</p>
            </div>
            <TrendingUp size={19} />
          </div>

          <div className="bo-growth">
            <div className="bo-growth__total">
              <strong>{formatNumber(latestMonthValue)}</strong>
              <span>Applications this month</span>
            </div>

            <svg
              className="bo-growth__svg"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label="Monthly barber application growth"
            >
              {[0, 1, 2, 3, 4].map((step) => {
                const value = (maxValue / 4) * step;
                const y =
                  top +
                  ((maxValue - value) / maxValue) *
                    (chartHeight - top - bottom);

                return (
                  <g key={step}>
                    <line
                      x1={left}
                      y1={y}
                      x2={chartWidth - right}
                      y2={y}
                      stroke="#e9eef6"
                      strokeDasharray="4 5"
                    />
                    <text
                      x="0"
                      y={y + 4}
                      fill="#8591a5"
                      fontSize="11"
                    >
                      {Math.round(value)}
                    </text>
                  </g>
                );
              })}

              {points.length > 0 && (
                <>
                  <polygon
                    points={area}
                    fill="#1769e8"
                    opacity="0.09"
                  />

                  <polyline
                    points={line}
                    fill="none"
                    stroke="#1769e8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {points.map((point, index) => (
                <g key={`${point.month}-${index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#fff"
                    stroke="#1769e8"
                    strokeWidth="2.5"
                  />
                  <text
                    x={point.x}
                    y={chartHeight - 7}
                    fill="#75839a"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {point.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BarberOverview;
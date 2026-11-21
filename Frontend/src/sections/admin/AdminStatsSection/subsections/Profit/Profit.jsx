
import React, { useMemo, useState } from "react";
import {
  Plus,
  CalendarDays,
  Wallet,
  Layers,
  TrendingUp,
  IndianRupee,
  Filter,
  RotateCcw,
  Info,
  BriefcaseBusiness,
  Megaphone,
} from "lucide-react";

import ProfitDialog from "../../../../../components/admin/ProfitDialog/ProfitDialog";
import useAdminProfit from "../../../../../hooks/admin/useAdminProfit";
import "./Profit.scss";

// --------------------------------------------------
// Constants
// --------------------------------------------------

const CATEGORY_COLORS = {
  "Operational Cost": "#3478F6",
  Marketing: "#EC4899",
};

const DEFAULT_FILTERS = {
  dateRange: "30",
  serviceCategory: "all",
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getApiFilters = (filters) => {
  const today = new Date();
  const endDate = getLocalDateString(today);

  let startDate;

  if (filters.dateRange !== "all") {
    const days = Number(filters.dateRange);
    const start = new Date(today);

    start.setDate(start.getDate() - days);
    startDate = getLocalDateString(start);
  }

  return {
    ...(startDate ? { startDate } : {}),
    ...(filters.serviceCategory !== "all"
      ? { category: filters.serviceCategory }
      : {}),
    ...(startDate ? { endDate } : {}),
  };
};

const INITIAL_API_FILTERS = getApiFilters(DEFAULT_FILTERS);

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const getChartDateLabel = (date) => {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// --------------------------------------------------
// Component
// --------------------------------------------------

const Profit = () => {
  const {
    profits,
    analytics,
    loading,
    analyticsLoading,
    error,
    addProfit,
    fetchProfits,
    fetchAnalytics,
  } = useAdminProfit(INITIAL_API_FILTERS);

  const [showDialog, setShowDialog] = useState(false);

  // Selected filters
  const [dateRange, setDateRange] = useState(
    DEFAULT_FILTERS.dateRange
  );

  const [serviceCategory, setServiceCategory] = useState(
    DEFAULT_FILTERS.serviceCategory
  );

  // Applied filters
  const [appliedFilters, setAppliedFilters] = useState(
    DEFAULT_FILTERS
  );

  // --------------------------------------------------
  // API filter handling
  // --------------------------------------------------

  const refreshDashboard = async (filters) => {
    const apiFilters = getApiFilters(filters);

    await Promise.all([
      fetchProfits(apiFilters),
      fetchAnalytics(apiFilters),
    ]);
  };

  const handleApplyFilters = async () => {
    const filters = {
      dateRange,
      serviceCategory,
    };

    setAppliedFilters(filters);

    try {
      await refreshDashboard(filters);
    } catch (err) {
      console.error("Failed to apply profit filters:", err);
    }
  };

  const handleResetFilters = async () => {
    setDateRange(DEFAULT_FILTERS.dateRange);
    setServiceCategory(DEFAULT_FILTERS.serviceCategory);

    setAppliedFilters(DEFAULT_FILTERS);

    try {
      await refreshDashboard(DEFAULT_FILTERS);
    } catch (err) {
      console.error("Failed to reset profit filters:", err);
    }
  };

  // --------------------------------------------------
  // Add financial entry
  // --------------------------------------------------

  const handleAddProfit = async (data) => {
    try {
      await addProfit(data);

      // Refresh entries and analytics after successful creation.
      await refreshDashboard(appliedFilters);
    } catch (err) {
      console.error("Failed to add financial entry:", err);
      throw err;
    }
  };

  // --------------------------------------------------
  // Analytics data
  // --------------------------------------------------

  const kpis = analytics?.kpis || {};

  const grossRevenue = Number(kpis.grossRevenue || 0);
  const netRevenue = Number(kpis.netRevenue || 0);
  const operationalCost = Number(kpis.operationalCost || 0);
  const marketingCost = Number(kpis.marketingCost || 0);
  const profit = Number(kpis.netProfit || 0);

  const profitPercentage = Number(
    kpis.netProfitPercentage || 0
  );

  // --------------------------------------------------
  // Cost distribution
  // --------------------------------------------------

  const chartData = useMemo(() => {
    const distribution = analytics?.costDistribution || [];

    return distribution
      .map((item) => ({
        name: item.name || item.category || "Other",
        amount: Number(item.amount || 0),
        color:
          item.color ||
          CATEGORY_COLORS[item.name || item.category] ||
          "#94A3B8",
      }))
      .filter((item) => item.amount > 0);
  }, [analytics]);

  const chartTotal = chartData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  let cumulativePercentage = 0;

  const donutGradient =
    chartTotal > 0
      ? chartData
          .map((item) => {
            const percentage =
              (item.amount / chartTotal) * 100;

            const start = cumulativePercentage;
            cumulativePercentage += percentage;

            return `${item.color} ${start}% ${cumulativePercentage}%`;
          })
          .join(", ")
      : "#E8EEE7 0% 100%";

  // --------------------------------------------------
  // Profit growth data
  // --------------------------------------------------

  const growthData = useMemo(() => {
    const data = analytics?.profitGrowth || [];

    return data.map((item) => ({
      date: item.date,
      value: Number(
        item.profit ?? item.netProfit ?? item.value ?? 0
      ),
    }));
  }, [analytics]);

  const chartWidth = 700;
  const chartHeight = 230;

  const chartPadding = {
    top: 20,
    right: 15,
    bottom: 35,
    left: 65,
  };

  const growthValues = growthData.map((item) => item.value);

  const maxGrowth = Math.max(...growthValues, 0);
  const minGrowth = Math.min(...growthValues, 0);
  const growthRange = maxGrowth - minGrowth || 1;

  const getPoint = (value, index) => {
    const denominator = Math.max(growthData.length - 1, 1);

    const x =
      chartPadding.left +
      (index / denominator) *
        (chartWidth -
          chartPadding.left -
          chartPadding.right);

    const y =
      chartPadding.top +
      ((maxGrowth - value) / growthRange) *
        (chartHeight -
          chartPadding.top -
          chartPadding.bottom);

    return { x, y };
  };

  const points = growthData.map((item, index) =>
    getPoint(item.value, index)
  );

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const areaPath =
    points.length > 0
      ? `${linePath} L ${lastPoint.x} ${
          chartHeight - chartPadding.bottom
        } L ${firstPoint.x} ${
          chartHeight - chartPadding.bottom
        } Z`
      : "";

  const axisValues = Array.from(
    { length: 5 },
    (_, index) =>
      minGrowth + ((maxGrowth - minGrowth) * index) / 4
  ).reverse();

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="profit-page">
      {/* Page Header */}
      <div className="profit-page__header">
        <div>
          <span className="profit-page__eyebrow">
            ANALYTICS & REPORTS
          </span>

          <h2>Profit & Loss</h2>

          <p>
            Track revenue, operational costs, marketing costs and
            business profitability.
          </p>
        </div>

        <div className="profit-page__header-actions">
          <button
            type="button"
            className="profit-page__add-btn"
            onClick={() => setShowDialog(true)}
          >
            <Plus size={19} />
            Add Financial Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="profit-filters">
        <div className="profit-filters__heading">
          <Filter size={19} />
          <span>Filters</span>
        </div>

        <div className="profit-filters__field">
          <label>
            <CalendarDays size={15} />
            Date Range
          </label>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="profit-filters__field">
          <label>
            <BriefcaseBusiness size={15} />
            Service / Business
          </label>

          <select
            value={serviceCategory}
            onChange={(e) =>
              setServiceCategory(e.target.value)
            }
          >
            <option value="all">All Services</option>
            <option value="Home Service">Home Service</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Online Orders">Online Orders</option>
          </select>
        </div>

        <div className="profit-filters__actions">
          <button
            type="button"
            className="profit-filters__apply"
            onClick={handleApplyFilters}
            disabled={analyticsLoading}
          >
            <Filter size={15} />
            {analyticsLoading ? "Loading..." : "Apply"}
          </button>

          <button
            type="button"
            className="profit-filters__reset"
            onClick={handleResetFilters}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="profit-error" role="alert">
          {typeof error === "string"
            ? error
            : "Unable to load profit data. Please try again."}
        </div>
      )}

      {/* KPI Cards */}
      <div className="profit-kpis">
        <div className="profit-kpi profit-kpi--blue">
          <div className="profit-kpi__top">
            <div className="profit-kpi__icon">
              <Layers size={23} />
            </div>

            <span>Gross Revenue</span>

            <Info size={15} className="profit-kpi__info" />
          </div>

          <h3>{formatCurrency(grossRevenue)}</h3>

          <p>Total revenue from all services</p>
        </div>

        <div className="profit-kpi profit-kpi--green">
          <div className="profit-kpi__top">
            <div className="profit-kpi__icon">
              <Wallet size={23} />
            </div>

            <span>Net Revenue</span>

            <Info size={15} className="profit-kpi__info" />
          </div>

          <h3>{formatCurrency(netRevenue)}</h3>

          <p>Gross revenue after operational costs</p>
        </div>

        <div className="profit-kpi profit-kpi--red">
          <div className="profit-kpi__top">
            <div className="profit-kpi__icon">
              <IndianRupee size={23} />
            </div>

            <span>Operational Cost</span>

            <Info size={15} className="profit-kpi__info" />
          </div>

          <h3>{formatCurrency(operationalCost)}</h3>

          <p>Barber payments, service costs, etc.</p>
        </div>

        <div className="profit-kpi profit-kpi--purple">
          <div className="profit-kpi__top">
            <div className="profit-kpi__icon">
              <Megaphone size={23} />
            </div>

            <span>Marketing Cost</span>

            <Info size={15} className="profit-kpi__info" />
          </div>

          <h3>{formatCurrency(marketingCost)}</h3>

          <p>Manually recorded marketing expenses</p>
        </div>

        <div className="profit-kpi profit-kpi--profit">
          <div className="profit-kpi__top">
            <div className="profit-kpi__icon">
              <TrendingUp size={23} />
            </div>

            <span>Net Profit</span>

            <Info size={15} className="profit-kpi__info" />
          </div>

          <h3>{formatCurrency(profit)}</h3>

          <p>{profitPercentage.toFixed(2)}% profit margin</p>
        </div>
      </div>

      {/* Charts */}
      <div className="profit-charts">
        {/* Cost Distribution */}
        <section className="profit-chart-card profit-chart-card--distribution">
          <div className="profit-chart-card__header">
            <div className="profit-chart-card__icon">
              <Layers size={21} />
            </div>

            <div>
              <h3>Cost Distribution</h3>
              <p>
                Breakdown of operational and marketing costs
              </p>
            </div>
          </div>

          <div className="profit-distribution">
            <div className="profit-donut-wrap">
              <div
                className="profit-donut"
                style={{
                  background: `conic-gradient(${donutGradient})`,
                }}
              >
                <div className="profit-donut__center">
                  <strong>{formatCurrency(chartTotal)}</strong>
                  <span>Total Costs</span>
                </div>
              </div>
            </div>

            <div className="profit-legend">
              {analyticsLoading ? (
                <p className="profit-empty">
                  Loading cost distribution...
                </p>
              ) : chartData.length > 0 ? (
                chartData.map((item) => {
                  const percentage =
                    chartTotal > 0
                      ? (item.amount / chartTotal) * 100
                      : 0;

                  return (
                    <div
                      className="profit-legend__item"
                      key={item.name}
                    >
                      <span
                        className="profit-legend__dot"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />

                      <span className="profit-legend__name">
                        {item.name}
                      </span>

                      <strong>
                        {formatCurrency(item.amount)}
                      </strong>

                      <span className="profit-legend__percentage">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="profit-empty">
                  No cost data available.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Profit Growth */}
        <section className="profit-chart-card profit-chart-card--growth">
          <div className="profit-chart-card__header">
            <div className="profit-chart-card__icon">
              <TrendingUp size={21} />
            </div>

            <div>
              <h3>Profit Growth</h3>
              <p>Net profit trend over time</p>
            </div>
          </div>

          <div className="profit-growth-chart">
            {analyticsLoading ? (
              <p className="profit-empty">
                Loading profit trend...
              </p>
            ) : growthData.length > 0 ? (
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                role="img"
                aria-label="Profit growth line chart"
              >
                <defs>
                  <linearGradient
                    id="profitAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#27A51D"
                      stopOpacity="0.24"
                    />

                    <stop
                      offset="100%"
                      stopColor="#27A51D"
                      stopOpacity="0.01"
                    />
                  </linearGradient>
                </defs>

                {axisValues.map((value, index) => {
                  const y =
                    chartPadding.top +
                    ((maxGrowth - value) / growthRange) *
                      (chartHeight -
                        chartPadding.top -
                        chartPadding.bottom);

                  return (
                    <g key={index}>
                      <line
                        x1={chartPadding.left}
                        x2={chartWidth - chartPadding.right}
                        y1={y}
                        y2={y}
                        stroke="#E9EEE8"
                        strokeDasharray="3 3"
                      />

                      <text
                        x={chartPadding.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="profit-growth-chart__axis"
                      >
                        ₹{Math.round(value).toLocaleString("en-IN")}
                      </text>
                    </g>
                  );
                })}

                {points.length > 1 && (
                  <path
                    d={areaPath}
                    fill="url(#profitAreaGradient)"
                  />
                )}

                {points.length > 1 && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#24991C"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}

                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#24991C"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {growthData.map((item, index) => {
                  const point = points[index];

                  return (
                    <text
                      key={`${item.date}-${index}`}
                      x={point.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="profit-growth-chart__date"
                    >
                      {getChartDateLabel(item.date)}
                    </text>
                  );
                })}
              </svg>
            ) : (
              <p className="profit-empty">
                No profit trend data available.
              </p>
            )}
          </div>

          <div className="profit-growth-footer">
            <span>
              <span className="profit-growth-footer__dot" />
              Profit trend
            </span>

            <strong>
              Current Profit: {formatCurrency(profit)}
            </strong>
          </div>
        </section>
      </div>

      {/* Add Financial Entry Dialog */}
      <ProfitDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleAddProfit}
      />
    </div>
  );
};

export default Profit;
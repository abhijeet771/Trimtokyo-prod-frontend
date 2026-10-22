
import { useEffect } from "react";
import {
  UsersRound,
  Wallet,
  UserRound,
  UserRoundCheck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import useBarberStaffOverview from "../../hooks/barber/useBarberStaffOverview";

import "./StaffOverview.scss";

const GENDER_COLORS = ["#168653", "#F0A4BC", "#94A3B8"];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatPercentage = (value) => {
  if (value == null) return "N/A";

  return `${value > 0 ? "+" : ""}${value}%`;
};

const formatMonthLabel = (month) => {
  if (!month) return "";

  const date = new Date(`${month}-01T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    month: "short",
  });
};

export default function StaffOverview() {
  const {
    summary,
    salaryGrowthChart,
    staffDistribution,
    selectedMonth,
    setSelectedMonth,
    fetchOverview,
    loading,
    error,
    clearError,
  } = useBarberStaffOverview();

  useEffect(() => {
    fetchOverview().catch(() => {});
  }, [fetchOverview]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleRefresh = () => {
    fetchOverview().catch(() => {});
  };

  const kpis = [
    {
      title: "Total Staff",
      value: summary?.totalStaff ?? 0,
      subtitle: `${summary?.activeStaff ?? 0} active staff`,
      icon: UsersRound,
      className: "staff-kpi-green",
    },
    {
      title: "Monthly Salary Paid",
      value: formatCurrency(summary?.monthlySalaryPaid ?? 0),
      subtitle: "Fully paid this month",
      icon: Wallet,
      className: "staff-kpi-blue",
    },
    {
      title: "Men Staff",
      value: summary?.menStaff ?? 0,
      subtitle: `${summary?.menPercentage ?? 0}% of total staff`,
      icon: UserRound,
      className: "staff-kpi-purple",
    },
    {
      title: "Women Staff",
      value: summary?.womenStaff ?? 0,
      subtitle: `${summary?.womenPercentage ?? 0}% of total staff`,
      icon: UserRoundCheck,
      className: "staff-kpi-pink",
    },
    {
      title: "Salary Growth",
      value: formatPercentage(summary?.salaryGrowthPercentage),
      subtitle: summary?.salaryGrowthComparisonAvailable
        ? "Compared with previous month"
        : "Insufficient previous-month data",
      icon: TrendingUp,
      className: "staff-kpi-orange",
    },
  ];

  const chartData = salaryGrowthChart.map((item) => ({
    ...item,
    monthLabel: item.label || formatMonthLabel(item.month),
    salary: Number(item.salaryExpenditure || 0),
  }));

  const pieData = staffDistribution || [];

  return (
    <section className="staff-overview">
      <div className="staff-overview__header">
        <div>
          <h2>Staff Overview</h2>
          <p>Monitor your workforce and monthly salary performance.</p>
        </div>

        <div className="staff-overview__controls">
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            aria-label="Select overview month"
            disabled={loading && !summary}
          />

          <button
            type="button"
            className="staff-overview__refresh"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh staff overview"
            title="Refresh overview"
          >
            <RefreshCw
              size={17}
              className={loading ? "is-spinning" : ""}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="staff-overview__error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => clearError()}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {loading && !summary ? (
        <div className="staff-overview__state">
          <RefreshCw size={24} className="is-spinning" />
          <span>Loading staff overview...</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="staff-overview__kpis">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <article
                  className={`staff-kpi-card ${kpi.className}`}
                  key={kpi.title}
                >
                  <div className="staff-kpi-card__top">
                    <div className="staff-kpi-card__icon">
                      <Icon size={21} strokeWidth={2} />
                    </div>
                  </div>

                  <p className="staff-kpi-card__title">{kpi.title}</p>

                  <h3 className="staff-kpi-card__value">
                    {kpi.value}
                  </h3>

                  <span className="staff-kpi-card__subtitle">
                    {kpi.subtitle}
                  </span>
                </article>
              );
            })}
          </div>

          {/* Charts */}
          <div className="staff-overview__charts">
            {/* Salary Growth Chart */}
            <article className="staff-chart-card">
              <div className="staff-chart-card__header">
                <div>
                  <h3>Staff Salary Growth</h3>
                  <p>Monthly salary expenditure</p>
                </div>

                <span className="staff-chart-card__badge">
                  <TrendingUp size={15} />
                  Growth
                </span>
              </div>

              <div className="staff-chart-card__body">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 12,
                        right: 12,
                        left: 8,
                        bottom: 4,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#E8EEE9"
                      />

                      <XAxis
                        dataKey="monthLabel"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#7B857F", fontSize: 12 }}
                        dy={8}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#7B857F", fontSize: 11 }}
                        tickFormatter={(value) =>
                          `₹${value / 1000}k`
                        }
                        width={55}
                      />

                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value),
                          "Salary expenditure",
                        ]}
                        labelFormatter={(_, payload) =>
                          payload?.[0]?.payload?.month || ""
                        }
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #E3EBE5",
                          boxShadow:
                            "0 6px 20px rgba(20, 60, 35, 0.08)",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="salary"
                        name="Salary expenditure"
                        stroke="#168653"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#168653",
                          stroke: "#FFFFFF",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="staff-overview__chart-empty">
                    No salary expenditure data available.
                  </div>
                )}
              </div>
            </article>

            {/* Staff Distribution Chart */}
            <article className="staff-chart-card">
              <div className="staff-chart-card__header">
                <div>
                  <h3>Staff Distribution</h3>
                  <p>Gender distribution of staff</p>
                </div>
              </div>

              <div className="staff-chart-card__body staff-chart-card__body--pie">
                {pieData.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={
                              GENDER_COLORS[
                                index % GENDER_COLORS.length
                              ]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [
                          `${value} staff`,
                          name,
                        ]}
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #E3EBE5",
                        }}
                      />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        formatter={(value) => (
                          <span className="staff-chart-legend">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="staff-overview__chart-empty">
                    No staff distribution data available.
                  </div>
                )}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}


import React from "react";
import {  ShoppingBag,  Clock3,  IndianRupee,  Star,  CalendarCheck,} from "lucide-react";

import {  ResponsiveContainer,  LineChart,  Line,  CartesianGrid,  XAxis,  YAxis,
  Tooltip,  PieChart,  Pie,  Cell,  BarChart,  Bar,  AreaChart,  Area,} from "recharts";

import useBarberDashboard from "../../../hooks/barber/useBarberDashboard";

import "./BarberOverviewSection.scss";

const STATUS_COLORS = {
  PENDING: "#f5ad35",
  CONFIRMED: "#5795e8",
  IN_PROGRESS: "#a477e8",
  COMPLETED: "#65c93a",
  CANCELLED: "#e66b6b",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const BarberOverviewSection = () => {
  const {
    totalOrders, todayOrders,
    revenue, averageRating,
    pendingOrders, charts, loading,
    error,refetch,
  } = useBarberDashboard();

  const orderStatusData = (charts?.orderStatus || []).map(
    (item) => ({
      name: STATUS_LABELS[item.status] || item.status,
      value: item.count || 0,
      color: STATUS_COLORS[item.status] || "#9ca3af",
    })
  );

  const weeklyBookingsData = (
    charts?.weeklyBookings || []
  ).map((item) => ({
    ...item,
    day: formatDate(item.date),
  }));

  const revenueTrendData = (
    charts?.revenueTrend || []
  ).map((item) => ({
    ...item,
    month: formatDate(item.date),
  }));

  const monthlyRevenueData = (
    charts?.monthlyRevenue || []
  ).map((item) => ({
    ...item,
    day: formatDate(item.date),
  }));

  const cards = [
    {
      id: "total-orders",
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      description: "All-time orders",
      accent: "green",
    },
    {
      id: "today-orders",
      title: "Today's Orders",
      value: todayOrders,
      icon: CalendarCheck,
      description: "Orders received today",
      accent: "blue",
    },
    {
      id: "revenue",
      title: "Revenue",
      value: formatCurrency(revenue),
      icon: IndianRupee,
      description: "Revenue from completed orders",
      accent: "purple",
    },
    {
      id: "average-rating",
      title: "Average Rating",
      value: Number(averageRating || 0).toFixed(1),
      icon: Star,
      description: "Customer rating",
      accent: "orange",
    },
    {
      id: "pending-orders",
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock3,
      description: "Awaiting confirmation",
      accent: "red",
    },
  ];

  return (
    <section className="barber-kpis">
      {error && (
        <div className="dashboard-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={refetch}>
            Retry
          </button>
        </div>
      )}

      <div className="kpi-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className={`kpi-card kpi-card--${card.accent}`}
            >
              <div className="kpi-card__top">
                <div className="kpi-card__icon">
                  <Icon size={21} strokeWidth={2} />
                </div>

                {card.id === "pending-orders" &&
                  Number(pendingOrders) > 0 && (
                    <span className="kpi-card__indicator">
                      Action needed
                    </span>
                  )}
              </div>

              <div className="kpi-card__content">
                <h4>{card.title}</h4>

                <p className="kpi-card__value">
                  {loading ? "—" : card.value}
                </p>

                <span className="kpi-card__description">
                  {card.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        {/* Revenue Trend */}
        <div className="chart-card">
          <h3>Revenue Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#edf1e9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#788477", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#788477", fontSize: 12 }}
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#65c93a"
                strokeWidth={3}
                dot={{ r: 4, fill: "#65c93a" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="chart-card">
          <h3>Order Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={55}
                paddingAngle={4}
              >
                {orderStatusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  value,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-legend">
            {orderStatusData.map((item) => (
              <div key={item.name} className="chart-legend__item">
                <span
                  className="chart-legend__dot"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Bookings */}
        <div className="chart-card">
          <h3>Weekly Bookings</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyBookingsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#edf1e9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#788477", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#788477", fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="bookings"
                name="Bookings"
                fill="#65c93a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="chart-card">
          <h3>Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#edf1e9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#788477", fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#788477", fontSize: 12 }}
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#65c93a"
                strokeWidth={2}
                fill="#e4f8d9"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default BarberOverviewSection;

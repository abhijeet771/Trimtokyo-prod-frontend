import React from "react";
import {
  ShoppingBag,
  CircleCheckBig,
  Clock3,
  IndianRupee,
  Star,
  Scissors,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

import { BARBER_TEXT } from "../../constants/barber";
import useBarberKPIs from "../../hooks/useBarberKPIs";

import "./BarberKpisSection.scss";

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 24000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 28000 },
];

const bookingData = [
  { day: "Mon", bookings: 12 },
  { day: "Tue", bookings: 18 },
  { day: "Wed", bookings: 15 },
  { day: "Thu", bookings: 22 },
  { day: "Fri", bookings: 28 },
  { day: "Sat", bookings: 35 },
  { day: "Sun", bookings: 24 },
];

const orderStatusData = [
  { name: "Completed", value: 65 },
  { name: "Pending", value: 20 },
  { name: "Cancelled", value: 15 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const BarberKpisSection = () => {
  const {
    totalOrders,
    completedOrders,
    pendingOrders,
    revenue,
    avgRating,
    totalServices,
    loading,
  } = useBarberKPIs();

  const cards = [
    {
      title: BARBER_TEXT.kpis.totalOrders,
      value: totalOrders,
      icon: ShoppingBag,
    },
    {
      title: BARBER_TEXT.kpis.completedOrders,
      value: completedOrders,
      icon: CircleCheckBig,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock3,
    },
    {
      title: BARBER_TEXT.kpis.revenue,
      value: `₹${revenue}`,
      icon: IndianRupee,
    },
    {
      title: "Average Rating",
      value: avgRating,
      icon: Star,
    },
    {
      title: "Services",
      value: totalServices,
      icon: Scissors,
    },
  ];

  return (
    <section className="barber-kpis">
      <div className="dashboard-heading">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's an overview of your business.</p>
      </div>

      <div className="kpi-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="kpi-card"
            >
              <div className="kpi-card__icon">
                <Icon size={24} />
              </div>

              <div className="kpi-card__content">
                <h4>{card.title}</h4>

                <p>{loading ? "..." : card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenue Trend</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Order Status</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Weekly Bookings</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="bookings"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Monthly Revenue</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                fill="#c4b5fd"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="quick-stats">
        <div className="quick-card">
          <span>Today's Orders</span>
          <h2>18</h2>
        </div>

        <div className="quick-card">
          <span>Today's Revenue</span>
          <h2>₹4,850</h2>
        </div>

        <div className="quick-card">
          <span>Pending Orders</span>
          <h2>3</h2>
        </div>

        <div className="quick-card">
          <span>Customer Rating</span>
          <h2>⭐ 4.8</h2>
        </div>
      </div>
    </section>
  );
};

export default BarberKpisSection;
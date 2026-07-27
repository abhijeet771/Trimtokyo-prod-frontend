import React from "react";
import {  LineChart,  Line,  XAxis,  YAxis,  Tooltip,  CartesianGrid,  BarChart,  Bar,  PieChart,  Pie,  Cell,  ResponsiveContainer,} from "recharts";
import { statsData, STATUS_COLORS } from "../../constants/stats";
import "./StatsSection.scss";

const StatisticsSection = () => {
  const {    kpis,    ordersData,    revenueData,   statusData,   topBarbers,} = statsData;

  return (
    <div className="stats">

      {/* ================= KPI CARDS ================= */}
      <div className="stats__kpis">
        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹{kpis.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="card">
          <h4>Top Barber</h4>
          <p>{kpis.topBarber}</p>
          <span>{kpis.topBarberOrders} orders</span>
        </div>

        <div className="card">
          <h4>Top Service</h4>
          <p>{kpis.topService}</p>
          <span>{kpis.topServiceOrders} orders</span>
        </div>

        <div className="card">
          <h4>Avg Order Value</h4>
          <p>₹{kpis.avgOrderValue}</p>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="stats__charts">

        {/* Orders Overview */}
        <div className="chart-card">
          <h3>Orders Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Overview */}
        <div className="chart-card">
          <h3>Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="stats__bottom">

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={STATUS_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Barbers */}
        <div className="chart-card">
          <h3>Top Barbers</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {topBarbers.map((b, i) => (
                <tr key={i}>
                  <td>{b.name}</td>
                  <td>{b.orders}</td>
                  <td>₹{b.revenue.toLocaleString()}</td>
                  <td>⭐ {b.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

export default StatisticsSection;
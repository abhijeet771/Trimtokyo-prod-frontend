import React from "react";
import { BARBER_TEXT } from "../../constants/barber";
import useBarberKPIs from "../../hooks/useBarberKPIs";
import "./BarberKpisSection.scss";

const BarberKpisSection = () => {
  const { totalOrders, completedOrders, revenue, loading } =
    useBarberKPIs();

  return (
    <div className="barber-kpis">
      <div className="kpi-card">
        <h4>{BARBER_TEXT.kpis.totalOrders}</h4>
        <p>{loading ? "..." : totalOrders}</p>
      </div>

      <div className="kpi-card">
        <h4>{BARBER_TEXT.kpis.completedOrders}</h4>
        <p>{loading ? "..." : completedOrders}</p>
      </div>

      <div className="kpi-card">
        <h4>{BARBER_TEXT.kpis.revenue}</h4>
        <p>{loading ? "..." : `₹${revenue}`}</p>
      </div>
    </div>
  );
};

export default BarberKpisSection;
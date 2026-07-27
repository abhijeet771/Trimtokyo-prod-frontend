import React, { useState } from "react";
import BarberHeaderSection from "../sections/BarberHeaderSection/BarberHeaderSection";
import BarberTabSection from "../sections/BarberTabSection/BarberTabSection";
import useBarberOrders from "../hooks/useBarberOrders";
import SlotSection from "../sections/SlotSection/SlotSection";
import "./BarberDashboard.scss";

const BarberDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const { orders, loading, error } =
    useBarberOrders();

  return (
    <div className="barber-dashboard"> 
      <BarberHeaderSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <BarberTabSection
        activeTab={activeTab}
        orders={orders}
        loading={loading}
        error={error}
        SlotSection={SlotSection}
      />
    </div>
  );
};

export default BarberDashboard;
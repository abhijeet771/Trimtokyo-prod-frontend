import React from "react";
import { BARBER_TEXT } from "../../constants/barber";
import "./BarberHeaderSection.scss";
import { useAuth } from "../../context/AuthContext";

const BarberHeaderSection = ({
  activeTab,
  setActiveTab,
}) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="barber-header">
      <h2>
        {BARBER_TEXT.welcome}, Barber
      </h2>

      <div className="tabs">
        <button
          className={
            activeTab === "profile"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("profile")
          }
        >
          {BARBER_TEXT.tabs.profile}
        </button>

        <button
          className={
            activeTab === "orders"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("orders")
          }
        >
          {BARBER_TEXT.tabs.orders}
        </button>

        {/* Slots Tab */}
        <button
          className={
            activeTab === "slots"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("slots")
          }
        >
          {BARBER_TEXT.tabs.slots || "Slots"}
        </button>

        {/* ✅ Logout Button */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default BarberHeaderSection;
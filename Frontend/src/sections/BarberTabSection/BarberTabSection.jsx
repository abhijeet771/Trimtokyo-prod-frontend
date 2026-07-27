import React from "react";
import BarberKpisSection from "../BarberKpisSection/BarberKpisSection";
import BarberProfileSection from "../BarberProfileSection/BarberProfileSection";
import BarberServiceSection from "../BarberServiceSection/BarberServiceSection";
import BarberOrderSection from "../BarberOrderSection/BarberOrderSection";
import BarberMapSection from "../BarberMapSection/BarberMapSection";
import SlotSection from "../SlotSection/SlotSection"; // ✅ NEW
import "./BarberTabSection.scss";

const BarberTabSection = ({
  activeTab,
  orders,
  loading,
  error,
}) => {
  /* ================= PROFILE TAB ================= */
  if (activeTab === "profile") {
    return (
      <div className="barber-tab-section">
        <BarberKpisSection />

        <div className="barber-tab-section__content">
          <BarberProfileSection />
          <BarberServiceSection />
        </div>
      </div>
    );
  }

  /* ================= ORDERS TAB ================= */
  if (activeTab === "orders") {
    return (
      <div className="barber-tab-section">
        <BarberKpisSection />

        <div className="barber-tab-section__content">
          <BarberOrderSection
            orders={orders}
            loading={loading}
            error={error}
          />

          <BarberMapSection orders={orders} />
        </div>
      </div>
    );
  }

  /* ================= SLOTS TAB ================= */
  if (activeTab === "slots") {
    return (
      <div className="barber-tab-section">
        <BarberKpisSection />

        <div className="barber-tab-section__content">
          <SlotSection />
        </div>
      </div>
    );
  }

  return null;
};

export default BarberTabSection;
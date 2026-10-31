import { useState } from "react";
import {
  Package,
  Zap,
  Building2,
  Receipt,
} from "lucide-react";

import "./BarberExpenceSection.scss";

import InventorySection from "./InventorySection";
import UtilitySection from "./UtilitySection";
import RentSection from "./RentSection";
import GeneralSection from "./GeneralSection";

const EXPENSE_TABS = [
  {
    id: "inventory",
    label: "Inventory Expenses",
    icon: Package,
  },
  {
    id: "utilities",
    label: "Utility Expenses",
    icon: Zap,
  },
  {
    id: "maintenance",
    label: "Rent & Maintenance",
    icon: Building2,
  },
  {
    id: "general",
    label: "General Expenses",
    icon: Receipt,
  },
];

const BarberExpenceSection = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <section className="barber-expense">

      {/* HEADER */}
      <div className="barber-expense__header">
        <div>
          <h2>Expenses</h2>
          <p>
            Manage and track your business expenses.
          </p>
        </div>
      </div>

      {/* EXPENSE TABS */}
      <div className="barber-expense__tabs">
        {EXPENSE_TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              className={`barber-expense__tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={19} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="barber-expense__content">

        {activeTab === "inventory" && (
          <InventorySection />
        )}

        {activeTab === "utilities" && (
          <UtilitySection />
        )}

        {activeTab === "maintenance" && (
          <RentSection/>
        )}

        {activeTab === "general" && (
          <GeneralSection/>
        )}

      </div>

    </section>
  );
};

export default BarberExpenceSection;
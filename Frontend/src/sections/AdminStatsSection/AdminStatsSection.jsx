import React, { useState } from "react";
import {
  LayoutDashboard,
  IndianRupee,
  Users,
  Scissors,
  Megaphone,
  ShoppingCart,
} from "lucide-react";

import Overview from "./subsections/Overview/Overview";
import RevenueSales from "./subsections/RevenueSales/RevenueSales";
import UsersSection from "./subsections/Users/Users";
import Barber from "./subsections/Barber/Barber";
import Marketing from "./subsections/Marketing/Marketing";
import Orders from "./subsections/Orders/Orders";

import "./AdminStatsSection.scss";

const STAT_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    component: Overview,
  },
  {
    id: "revenue",
    label: "Revenue & Sales",
    icon: IndianRupee,
    component: RevenueSales,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    component: UsersSection,
  },
  {
    id: "barber",
    label: "Barber",
    icon: Scissors,
    component: Barber,
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    component: Marketing,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    component: Orders,
  },
];

const AdminStatsSection = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const ActiveComponent =
    STAT_TABS.find((tab) => tab.id === activeSubTab)?.component ||
    Overview;

  return (
    <section className="admin-stats">
      <header className="admin-stats__header">
        <div>
          <span className="admin-stats__eyebrow">
            ANALYTICS & REPORTS
          </span>

          <h2>Statistics</h2>

          <p>
            Monitor business performance across TrimTokyo.
          </p>
        </div>
      </header>

      <nav
        className="admin-stats__tabs"
        aria-label="Statistics sections"
      >
        {STAT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`admin-stats__tab ${
                isActive ? "is-active" : ""
              }`}
              onClick={() => setActiveSubTab(tab.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-stats__content">
        <ActiveComponent />
      </div>
    </section>
  );
};

export default AdminStatsSection;

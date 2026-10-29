
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
} from "lucide-react";

import "./AdminBarberSection.scss";

import BarberOverview from "./BarberOverview/BarberOverview.jsx";
import BarberManagement from "./BarberManagement/BarberManagement.jsx";
import BarberRequest from "./BarberRequest/BarberRequest.jsx";

const BARBER_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "barber-management",
    label: "Barber Management",
    icon: Users,
  },
  {
    id: "barber-request",
    label: "Barber Request",
    icon: UserRoundCheck,
  },
];

export default function AdminBarberSection() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveContent = () => {
    switch (activeTab) {
      case "overview":
        return <BarberOverview />;

      case "barber-management":
        return <BarberManagement />;

      case "barber-request":
        return <BarberRequest />;

      default:
        return <BarberOverview />;
    }
  };

  return (
    <section className="admin-barber">
      <nav
        className="admin-barber__tabs"
        role="tablist"
        aria-label="Barber management sections"
      >
        {BARBER_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`admin-barber-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`admin-barber-panel-${tab.id}`}
              className={`admin-barber__tab ${
                isActive ? "admin-barber__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div
        className="admin-barber__panel"
        role="tabpanel"
        id={`admin-barber-panel-${activeTab}`}
        aria-labelledby={`admin-barber-tab-${activeTab}`}
      >
        <div className="admin-barber__content">
          {renderActiveContent()}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";

import Overview from "./Overview/Overview.jsx";
import EventBooking from "./EventBooking/EventBooking.jsx";
import EventStatus from "./EventStatus/EventStatus.jsx";

import "./AdminEventSection.scss";

const EVENT_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
  },
  {
    id: "booking-status",
    label: "Booking Status",
    icon: ClipboardCheck,
  },
];

export default function AdminEventSection() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;

      case "events":
        return <EventBooking />;

      case "booking-status":
        return <EventStatus />;

      default:
        return <Overview />;
    }
  };

  return (
    <section className="admin-event">
      <nav
        className="admin-event__tabs"
        role="tablist"
        aria-label="Event management sections"
      >
        {EVENT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`admin-event-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`admin-event-panel-${tab.id}`}
              className={`admin-event__tab ${
                isActive ? "admin-event__tab--active" : ""
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
        className="admin-event__panel"
        role="tabpanel"
        id={`admin-event-panel-${activeTab}`}
        aria-labelledby={`admin-event-tab-${activeTab}`}
      >
        <div className="admin-event__content">
          {renderActiveContent()}
        </div>
      </div>
    </section>
  );
}

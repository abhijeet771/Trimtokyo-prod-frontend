import React, { useState } from "react";
import {  MessageCircle,  UserRound,  Scissors,  Users,} from "lucide-react";

import GuestSupport from "./GuestSupport/GuestSupport.jsx";
import BarberSupport from "./BarberSupport/BarberSupport.jsx";
import UserSupport from "./UserSupport/UserSupport.jsx";

import "./AdminSupportSection.scss";

const supportTabs = [
  {
    id: "guest",
    label: "Guest Support",
    icon: UserRound,
  },
  {
    id: "barber",
    label: "Barber Support",
    icon: Scissors,
  },
  {
    id: "user",
    label: "User Support",
    icon: Users,
  },
];

const AdminSupportSection = () => {
  const [activeTab, setActiveTab] = useState("guest");

  const renderSupportContent = () => {
    switch (activeTab) {
      case "guest":
        return <GuestSupport />;

      case "barber":
        return <BarberSupport />;

      case "user":
        return <UserSupport />;

      default:
        return null;
    }
  };

  return (
    <section className="admin-support">
      {/* Header */}
      <header className="admin-support__header">
        <div className="admin-support__heading">
          <span className="admin-support__eyebrow">
            SUPPORT MANAGEMENT
          </span>

          <h2>Support Center</h2>

          <p>
            Manage support requests from guests, barbers, and users.
          </p>
        </div>

        <div className="admin-support__header-icon">
          <MessageCircle size={24} />
        </div>
      </header>

      {/* Support Tabs */}
      <nav
        className="admin-support__tabs"
        role="tablist"
        aria-label="Support categories"
      >
        {supportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`admin-support-tab-${tab.id}`}
              type="button"
              role="tab"
              className={`admin-support__tab ${
                isActive ? "admin-support__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={isActive}
              aria-controls={`admin-support-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
            >
              <Icon size={19} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Active Support Content */}
      <div
        id={`admin-support-panel-${activeTab}`}
        className="admin-support__content"
        role="tabpanel"
        aria-labelledby={`admin-support-tab-${activeTab}`}
      >
        {renderSupportContent()}
      </div>
    </section>
  );
};

export default AdminSupportSection;
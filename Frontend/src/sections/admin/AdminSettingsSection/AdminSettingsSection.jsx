import { useState } from "react";
import {  Users, CalendarDays, CreditCard, Scissors, Monitor, Share2,} from "lucide-react";

import Staff from "./Staff/Staff.jsx";
import Event from "./Event/Event.jsx";
import SocialMedia from "./SocialMedia/SocialMedia.jsx";
import Subscription from "./Subscription/Subscription.jsx";
import Display from "./Display/Display.jsx";

import "./AdminSettingsSection.scss";

const SETTINGS_TABS = [
  {
    id: "staff",
    label: "Staff",
    description: "Manage staff members",
    icon: Users,
  },
  {
    id: "event",
    label: "Event",
    description: "Configure event categories",
    icon: CalendarDays,
  },
  {
    id: "subscription",
    label: "Subscription",
    description: "Plans and billing",
    icon: CreditCard,
  },
  {
    id: "barber",
    label: "Barber",
    description: "Barber configuration",
    icon: Scissors,
  },
  {
    id: "display",
    label: "Display",
    description: "Dashboard preferences",
    icon: Monitor,
  },
  {
    id: "social-media",
    label: "Social Media",
    description: "Social accounts and metrics",
    icon: Share2,
  },
];

const SETTINGS_CONTENT = {
  staff: {
    title: "Staff Settings",
    description:
      "Manage staff designations, joining dates, salaries, and phone numbers.",
  },
  event: {
    title: "Event Settings",
    description:
      "Create and manage event categories used in event bookings.",
  },
  subscription: {
    title: "Subscription Settings",
    description:
      "Configure subscription plans, pricing, and billing options.",
  },
  barber: {
    title: "Barber Settings",
    description:
      "Manage barber-related configuration and operational preferences.",
  },
  display: {
    title: "Display Settings",
    description:
      "Configure dashboard display preferences and interface options.",
  },
  "social-media": {
    title: "Social Media Settings",
    description:
      "Manage social media platforms, handles, and audience metrics.",
  },
};

export default function AdminSettingSection() {
  const [activeTab, setActiveTab] = useState("staff");

  const activeContent =
    SETTINGS_CONTENT[activeTab] ?? SETTINGS_CONTENT.staff;

  const activeTabConfig = SETTINGS_TABS.find(
    (tab) => tab.id === activeTab
  );

  const ActiveIcon = activeTabConfig?.icon ?? Users;

  const hidePanelHeader = [
    "staff",
    "event",
    "subscription",
    "display",
  ].includes(activeTab);

  const renderActiveContent = () => {
    switch (activeTab) {
      case "staff":
        return <Staff />;

      case "event":
        return <Event />;

      case "subscription":
        return <Subscription />;

      case "social-media":
        return <SocialMedia />;

      case "display":
        return <Display />;

      case "barber":
      default:
        return (
          <div className="admin-setting__placeholder">
            <div className="admin-setting__placeholder-icon">
              <ActiveIcon size={25} />
            </div>

            <h4>{activeContent.title}</h4>

            <p>
              The configuration interface for this section will
              be implemented here.
            </p>

            <span className="admin-setting__status">
              Configuration pending
            </span>
          </div>
        );
    }
  };

  return (
    <section className="admin-setting">
      <nav
        className="admin-setting__tabs"
        role="tablist"
        aria-label="Settings sections"
      >
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`admin-setting-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`admin-setting-panel-${tab.id}`}
              className={`admin-setting__tab ${
                isActive ? "admin-setting__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="admin-setting__tab-icon">
                <Icon size={19} strokeWidth={1.9} />
              </span>

              <span className="admin-setting__tab-text">
                <span className="admin-setting__tab-label">
                  {tab.label}
                </span>

                <span className="admin-setting__tab-description">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div
        className="admin-setting__panel"
        role="tabpanel"
        id={`admin-setting-panel-${activeTab}`}
        aria-labelledby={`admin-setting-tab-${activeTab}`}
        key={activeTab}
      >
        {!hidePanelHeader && (
          <div className="admin-setting__panel-header">
            <div>
              <h3>{activeContent.title}</h3>
              <p>{activeContent.description}</p>
            </div>
          </div>
        )}

        {renderActiveContent()}
      </div>
    </section>
  );
}
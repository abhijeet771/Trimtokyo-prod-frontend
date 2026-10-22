import { useState } from "react";
import {
  UserRound,
  Bell,
  Palette,
  ShieldCheck,
} from "lucide-react";

import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import ThemeSettings from "./ThemeSettings";

import "./BarberSettingSection.scss";

const SETTINGS_TABS = [
  {
    id: "account",
    label: "Account & Security",
    icon: UserRound,
  },
  {
    id: "notifications",
    label: "Notification Settings",
    icon: Bell,
  },
  {
    id: "theme",
    label: "Theme Settings",
    icon: Palette,
  },
  {
    id: "access",
    label: "Role-Based Access",
    icon: ShieldCheck,
  },
];

const BarberSettingSection = () => {
  const [activeTab, setActiveTab] = useState("account");

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "theme":
        return <ThemeSettings />;

      case "access":
        return (
          <div className="settings-placeholder">
            <ShieldCheck size={36} />
            <h3>Role-Based Access</h3>
            <p>
              Manage role permissions and access controls for your account.
            </p>
            <span className="settings-coming-soon">
              Coming Soon
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="barber-setting-section">
      <div className="page-header">
        <h2>Settings</h2>
        <p>
          Manage your account, notifications, appearance, and access.
        </p>
      </div>

      {/* Four settings tabs */}
      <div
        className="settings-tabs"
        role="tablist"
        aria-label="Settings"
      >
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`settings-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`settings-panel-${tab.id}`}
              className={`settings-tab ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={19} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div
        className="settings-content"
        role="tabpanel"
        id={`settings-panel-${activeTab}`}
        aria-labelledby={`settings-tab-${activeTab}`}
      >
        {renderContent()}
      </div>
    </section>
  );
};

export default BarberSettingSection;

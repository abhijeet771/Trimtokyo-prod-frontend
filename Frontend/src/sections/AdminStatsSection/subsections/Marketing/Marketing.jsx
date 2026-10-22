
import React, { useState } from "react";
import { Globe, Store } from "lucide-react";

import Online from "./Online";
import Offline from "./Offline";

import "./Marketing.scss";

const MARKETING_TABS = [
  {
    id: "online",
    label: "Online Marketing",
    description: "Social media reach and engagement",
    icon: Globe,
  },
  {
    id: "offline",
    label: "Offline Marketing",
    description: "Local campaigns and customer acquisition",
    icon: Store,
  },
];

export default function Marketing() {
  const [activeTab, setActiveTab] = useState("online");

  return (
    <section className="marketing-stats">
      <div className="marketing-stats__header">
        <div>
          <h2 className="marketing-stats__title">
            Marketing Analytics
          </h2>
          <p className="marketing-stats__subtitle">
            Track campaign performance across online and offline channels.
          </p>
        </div>
      </div>

      <div
        className="marketing-stats__tabs"
        role="tablist"
        aria-label="Marketing analytics categories"
      >
        {MARKETING_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`marketing-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`marketing-panel-${tab.id}`}
              className={`marketing-stats__tab ${
                isActive ? "marketing-stats__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="marketing-stats__tab-icon">
                <Icon size={18} strokeWidth={2} />
              </span>

              <span className="marketing-stats__tab-content">
                <span className="marketing-stats__tab-label">
                  {tab.label}
                </span>
                <span className="marketing-stats__tab-description">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="marketing-stats__divider" />

      <div
        className="marketing-stats__panel"
        role="tabpanel"
        id={`marketing-panel-${activeTab}`}
        aria-labelledby={`marketing-tab-${activeTab}`}
      >
        {activeTab === "online" ? <Online /> : <Offline />}
      </div>
    </section>
  );
}

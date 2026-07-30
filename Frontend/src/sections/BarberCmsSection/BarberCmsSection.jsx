import { useState } from "react";

import {
  Images,
  Building2,
  Scissors,
  Users,
  Settings2,
} from "lucide-react";

import CmsImages from "./tabs/CmsImages";
import CmsDetails from "./tabs/CmsDetails";
import CmsServices from "./tabs/CmsServices";
import CmsBarbers from "./tabs/CmsBarbers";
import CmsOthers from "./tabs/CmsOthers";

import "./BarberCmsSection.scss";

const TABS = [
  {
    id: "images",
    label: "Images",
    icon: Images,
  },
  {
    id: "details",
    label: "Details",
    icon: Building2,
  },
  {
    id: "services",
    label: "Services",
    icon: Scissors,
  },
  {
    id: "barbers",
    label: "Barbers",
    icon: Users,
  },
  {
    id: "others",
    label: "Others",
    icon: Settings2,
  },
];

const BarberCmsSection = () => {
  const [activeTab, setActiveTab] =
    useState("images");

  const renderContent = () => {
    switch (activeTab) {
      case "images":
        return <CmsImages />;

      case "details":
        return <CmsDetails />;

      case "services":
        return <CmsServices />;

      case "barbers":
        return <CmsBarbers />;

      case "others":
        return <CmsOthers />;

      default:
        return <CmsImages />;
    }
  };

  return (
    <section className="barber-cms-section">
      <div className="page-header">
        <div>
          <h2>Brand Website CMS</h2>

          <p>
            Customize how your salon
            appears on the customer
            website.
          </p>
        </div>
      </div>

      <div className="cms-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              className={
                activeTab === tab.id
                  ? "tab-btn active"
                  : "tab-btn"
              }
              onClick={() =>
                setActiveTab(tab.id)
              }
            >
              <Icon size={18} />

              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="cms-content">
        {renderContent()}
      </div>
    </section>
  );
};

export default BarberCmsSection;
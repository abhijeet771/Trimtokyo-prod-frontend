import "./AdminCMSSection.scss";
import { useState } from "react";

// import HeaderTab from "./tabs/HeaderTab";
import HeroTab from "./tabs/HeroTab";
import ExploreStylesTab from "./tabs/ExploreStylesTab";
import WhyChooseTab from "./tabs/WhyChooseTab";

// import HowItWorksTab from "./tabs/HowItWorksTab";
// import TestimonialsTab from "./tabs/TestimonialsTab";

import FooterCMSTabs from "./tabs/FooterCMSTabs";

const TABS = [
  "Header",
  "Hero",
  "Explore Styles",
  "Why Choose Tab",
  "How it works",
  "Footer",
];

const AdminCMSSection = () => {
  const [activeTab, setActiveTab] = useState("Hero");

  const renderTab = () => {
    switch (activeTab) {
      case "Hero":
        return <HeroTab />;

      // case "Header":
      //   return <HeaderTab />;

       case "Explore Styles":
         return <ExploreStylesTab />;

       case "Why Choose Tab":
         return <WhyChooseTab/>;

      // case "How it works":
      //   return <HowItWorksTab />;

        case "Footer":
         return <FooterCMSTabs />;

      default:
        return (
          <div className="cms-card">
            <h2>{activeTab}</h2>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <section className="admin-cms">
      <div className="admin-cms__header">
        <div>
          <h1>Website CMS</h1>
          <p>Manage and customize your website sections.</p>
        </div>

        <div className="admin-cms__actions">
          <button className="secondary-btn">
            View Live
          </button>

          <button className="primary-btn">
            Save Changes
          </button>
        </div>
      </div>

      <div className="admin-cms__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-cms__content">
        {renderTab()}
      </div>
    </section>
  );
};

export default AdminCMSSection;
import { useState } from "react";
import {
  LayoutDashboard,
  Image,
  Sparkles,
  Palette,
  Info,
  CircleHelp,
  Workflow,
  Mail,
  PanelsTopLeft,
  ExternalLink,
  Save,
  ChevronRight,
} from "lucide-react";

import HeroTab from "./tabs/HeroTab";
import ExploreStylesTab from "./tabs/ExploreStylesTab";
import WhyChooseTab from "./tabs/WhyChooseTab";
import AboutHeroTab from "./tabs/AboutHeroTab";
import FAQTab from "./tabs/FAQTab";
import ContactTab from "./tabs/ContactTab";
import FooterCMSTabs from "./tabs/FooterCMSTabs";

import "./AdminCMSSection.scss";

const TABS = [
  { label: "Header", icon: PanelsTopLeft },
  { label: "Hero", icon: Image },
  { label: "Explore Styles", icon: Palette },
  { label: "Why Choose Tab", icon: Sparkles },
  { label: "About Hero", icon: Info },
  { label: "FAQ", icon: CircleHelp },
  { label: "How it works", icon: Workflow },
  { label: "Contact", icon: Mail },
  { label: "Footer", icon: LayoutDashboard },
];

const AdminCMSSection = () => {
  const [activeTab, setActiveTab] = useState("Hero");

  const renderTab = () => {
    switch (activeTab) {
      case "Hero":
        return <HeroTab />;

      case "Explore Styles":
        return <ExploreStylesTab />;

      case "Why Choose Tab":
        return <WhyChooseTab />;

      case "About Hero":
        return <AboutHeroTab />;

      case "FAQ":
        return <FAQTab />;

      case "Contact":
        return <ContactTab />;

      case "Footer":
        return <FooterCMSTabs />;

      default:
        return (
          <div className="cms-card">
            <div className="cms-card__icon">
              <LayoutDashboard size={23} />
            </div>

            <h2>{activeTab}</h2>

            <p>
              This section is under development. Its settings will be
              available here when the section is implemented.
            </p>
          </div>
        );
    }
  };

  const activeTabInfo = TABS.find(
    (tab) => tab.label === activeTab
  );

  const ActiveIcon = activeTabInfo?.icon || LayoutDashboard;

  return (
    <section className="admin-cms">
      {/* Page header */}
      <header className="admin-cms__header">
        <div className="admin-cms__heading">
          <div className="admin-cms__eyebrow">
            <LayoutDashboard size={15} />
            <span>WEBSITE MANAGEMENT</span>
          </div>

          <h1>Website CMS</h1>

          <p>
            Manage and customize the content of your website.
          </p>
        </div>

        <div className="admin-cms__actions">
          <button
            type="button"
            className="admin-cms__button admin-cms__button--secondary"
          >
            <ExternalLink size={16} />
            <span>View Live</span>
          </button>

          <button
            type="button"
            className="admin-cms__button admin-cms__button--primary"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      {/* Section navigation */}
      <div className="admin-cms__navigation">
        <div
          className="admin-cms__tabs"
          role="tablist"
          aria-label="Website content sections"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;

            return (
              <button
                key={tab.label}
                id={`cms-tab-${TABS.indexOf(tab)}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="cms-active-panel"
                tabIndex={isActive ? 0 : -1}
                className={`admin-cms__tab ${
                  isActive ? "admin-cms__tab--active" : ""
                }`}
                onClick={() => setActiveTab(tab.label)}
              >
                <Icon size={16} strokeWidth={1.9} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active section heading */}
      <div className="admin-cms__section-heading">
        <div className="admin-cms__section-icon">
          <ActiveIcon size={19} />
        </div>

        <div>
          <span className="admin-cms__section-label">
            EDIT WEBSITE SECTION
          </span>
          <h2>{activeTab}</h2>
        </div>

        <ChevronRight
          className="admin-cms__section-chevron"
          size={19}
        />
      </div>

      {/* Active section content */}
      <div
        className="admin-cms__content"
        id="cms-active-panel"
        role="tabpanel"
        aria-labelledby={`cms-tab-${TABS.findIndex(
          (tab) => tab.label === activeTab
        )}`}
      >
        {renderTab()}
      </div>
    </section>
  );
};

export default AdminCMSSection;

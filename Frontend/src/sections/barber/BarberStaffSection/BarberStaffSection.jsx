import { useState } from "react";
import {  LayoutDashboard,  UsersRound,  Wallet,  IdCard,} from "lucide-react";


import StaffOverview from "./StaffOverview";
import StaffDetails from "./StaffDetails";
import StaffSalaryCycle from "./StaffSalaryCycle";
import StaffIdCardGenerator from "./StaffIdCardGenerator";
import "./BarberStaffSection.scss";

const STAFF_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "details",
    label: "Staff Details",
    icon: UsersRound,
  },
  {
    id: "salary",
    label: "Salary Cycle",
    icon: Wallet,
  },
  {
    id: "idcard",
    label: "ID Card Generator",
    icon: IdCard,
  },
];

const BarberStaffSection = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <StaffOverview />;

      case "details":
        return <StaffDetails />;

      case "salary":
        return <StaffSalaryCycle />;

      case "idcard":
        return <StaffIdCardGenerator/>;

      default:
        return <StaffOverview />;
    }
  };

  return (
    <section className="barber-staff-section">
      {/* HEADER */}
      <div className="barber-staff-header">
        <div>
          <h2>Staff Management</h2>
          <p>
            Manage salon staff, employee details, salaries, and
            verification ID cards.
          </p>
        </div>
      </div>

      {/* FOUR TABS */}
      <div
        className="staff-tabs"
        role="tablist"
        aria-label="Staff management sections"
      >
        {STAFF_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`staff-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`staff-panel-${tab.id}`}
              className={`staff-tab ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={19} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div
        className="staff-tab-content"
        role="tabpanel"
        id={`staff-panel-${activeTab}`}
        aria-labelledby={`staff-tab-${activeTab}`}
      >
        {renderTabContent()}
      </div>
    </section>
  );
};

export default BarberStaffSection;

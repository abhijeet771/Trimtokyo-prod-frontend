import React from "react";

import AdminOverviewSection from "../AdminOverviewSection/AdminOverviewSection";
import AdminUserSection from "../AdminUserSection/AdminUserSection";
import AdminBarberSection from "../AdminBarberSection/AdminBarberSection";
import AdminApprovalSection from "../AdminApprovalSection/AdminApprovalSection";
import AdminBlogSection from "../AdminBlogSection/AdminBlogSection";
import AdminSlotSection from "../AdminSlotSection/AdminSlotSection";
import AdminStatsSection from "../AdminStatsSection/AdminStatsSection";
import AdminCampaignSection from "../AdminCampaignSection/AdminCampaignSection";
import AdminReelSection from "../AdminReelSection/AdminReelSection";
import AdminCMSSection from "../AdminCMSSection/AdminCMSSection";
import AdminOrderSection from "../AdminOrderSection/AdminOrderSection";
import AdminEventSection from "../AdminEventSection/AdminEventSection";
import AdminSettingsSection from "../AdminSettingsSection/AdminSettingsSection";

import "./AdminContentSection.scss";

const AdminContentSection = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminOverviewSection />;

      case "users":
        return <AdminUserSection />;

      case "barbers":
        return <AdminBarberSection />;

      case "approvals":
        return <AdminApprovalSection />;

      case "slots":
        return <AdminSlotSection />;

      case "orders":
        return <AdminOrderSection />;

      case "statistics":
        return <AdminStatsSection />;

      case "blogs":
        return <AdminBlogSection />;

      case "reels":
        return <AdminReelSection />;

      case "campaign":
        return <AdminCampaignSection />;

      case "cms":
        return <AdminCMSSection />;
      
      case "settings":
        return <AdminSettingsSection />;

      case "events":
        return <AdminEventSection/>;

      default:
        return <AdminOverviewSection />;
    }
  };

  return (
    <div className="admin-content-section">
      {renderContent()}
    </div>
  );
};

export default AdminContentSection;

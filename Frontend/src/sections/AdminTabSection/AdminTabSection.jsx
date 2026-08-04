import React from "react";

import AdminHeroSection from "../AdminHeroSection/AdminHeroSection";
import AdminApprovalSection from "../AdminApprovalSection/AdminApprovalSection";
import AdminBlogSection from "../AdminBlogSection/AdminBlogSection";
import AdminSlotSection from "../AdminSlotSection/AdminSlotSection";
import StatisticsSection from "../StatsSection/StatsSection";
import AdminCampaignSection from "../AdminCampaignSection/AdminCampaignSection";
import AdminReelSection from "../AdminReelSection/AdminReelSection";
import AdminCMSSection from "../AdminCMSSection/AdminCMSSection";

import "./AdminTabSection.scss";

const AdminTabSection = ({
  activeTab,
}) => {

  /* ================= DASHBOARD TAB ================= */

  if (activeTab === "dashboard") {
    return (
      <div className="admin-tab-section">
        <AdminHeroSection />
      </div>
    );
  }

  /* ================= APPROVALS TAB ================= */

  if (activeTab === "approvals") {
    return (
      <div className="admin-tab-section">

        <div className="admin-tab-section__content">
          <AdminApprovalSection />
        </div>

      </div>
    );
  }

  /* ================= SLOTS TAB ================= */

  if (activeTab === "slots") {
    return (
      <div className="admin-tab-section">
        <AdminSlotSection />
      </div>
    );
  }

  /* ================= STATISTICS TAB ================= */

  if (activeTab === "statistics") {
    return (
      <div className="admin-tab-section">
        <StatisticsSection />
      </div>
    );
  }

  /* ================= BLOGS TAB ================= */

  if (activeTab === "blogs") {
    return (
      <div className="admin-tab-section">
        <AdminBlogSection />
      </div>
    );
  }

  /* ================= REELS TAB ================= */

  if (activeTab === "reels") {
    return (
      <div className="admin-tab-section">
        <AdminCMSSection />
      </div>
    );
  }

  /* ================= CAMPAIGN TAB ================= */

  if (activeTab === "campaign") {
    return (
      <div className="admin-tab-section">
        <AdminCampaignSection />
      </div>
    );
  }
 /* ================= CMS TAB ================= */

  if (activeTab === "cms") {
    return (
      <div className="admin-tab-section">
        <AdminCMSSection />
      </div>
    );
  }

  return null;
};

export default AdminTabSection;
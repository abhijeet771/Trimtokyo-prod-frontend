import React, { useEffect, useState } from "react";
import { ADMIN_TEXT } from "../../constants/admin";
import "./AdminHeaderSection.scss";
import { useAuth } from "../../context/AuthContext";
import { MdPalette } from "react-icons/md";

import { applyTheme } from "../../theme/applyTheme";
import {  getSettings,  updateSettings,} from "../../services/api";

const AdminHeaderSection = ({
  activeTab,
  setActiveTab,
}) => {
  const { logout } = useAuth();

  const [selectedTheme, setSelectedTheme] =
    useState("pink");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await getSettings();

      setSelectedTheme(data.homepageTheme);
      applyTheme(data.homepageTheme);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleThemeChange = async (theme) => {
    try {
      await updateSettings({
        homepageTheme: theme,
      });

      setSelectedTheme(theme);

      applyTheme(theme);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-header">
      <div className="tabs">

        <button  className={ activeTab === "dashboard" ? "active" : "" }
          onClick={() => setActiveTab("dashboard")}>
          {ADMIN_TEXT.tabs.dashboard}
        </button>

        <button className={ activeTab === "approvals" ? "active"  : "" }
          onClick={() => setActiveTab("approvals") }>
          {ADMIN_TEXT.tabs.approvals}
        </button>

        <button className={ activeTab === "slots" ? "active"  : "" }
          onClick={() => setActiveTab("slots")}>
          {ADMIN_TEXT.tabs.slots || "Bookings"}
        </button>

        <button className={ activeTab === "statistics" ? "active" : "" }
          onClick={() =>setActiveTab("statistics")}>
          {ADMIN_TEXT.tabs.statistics || "Statistics"}
        </button>

        <button className={ activeTab === "blogs" ? "active" : "" }
          onClick={() => setActiveTab("blogs")}>
          {ADMIN_TEXT.tabs.blogs || "Blogs"}
        </button>
        <button className={ activeTab === "reels" ? "active" : "" }
          onClick={() => setActiveTab("reels")}>
          Reels
        </button>

        <button className={ activeTab === "campaign" ? "active" : ""}
          onClick={() => setActiveTab("campaign")}>
          Campaign
        </button>
        <button className={ activeTab === "cms" ? "active" : "" }
          onClick={() =>  setActiveTab("cms")}>
          CMS
        </button>
        <button className="logout-btn" onClick={handleLogout} >
          Logout
        </button>

      </div>

      {/* Theme Selector */}

      <div className="theme-selector">

        <div className="theme-label">
          <MdPalette />
          <span>Theme</span>
        </div>

        <button
          className={`theme-circle pink ${
            selectedTheme === "pink"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleThemeChange("pink")
          }
          title="Pink Theme"
        />

        <button
          className={`theme-circle blue ${
            selectedTheme === "blue"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleThemeChange("blue")
          }
          title="Blue Theme"
        />

        <button
          className={`theme-circle green ${
            selectedTheme === "green"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleThemeChange("green")
          }
          title="Green Theme"
        />

      </div>
    </div>
  );
};

export default AdminHeaderSection;
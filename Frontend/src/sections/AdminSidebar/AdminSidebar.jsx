import React from "react";
import {
  MdDashboard,
  MdPeople,
  MdVerifiedUser,
  MdCalendarMonth,
  MdBarChart,
  MdArticle,
  MdMovie,
  MdCampaign,
  MdWeb,
  MdSettings,
  MdLogout,
  MdContentCut,
  MdShoppingCart,
  MdEvent,
} from "react-icons/md";

import { useAuth } from "../../context/AuthContext";
import "./AdminSidebar.scss";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Overview",
    icon: MdDashboard,
  },
  {
    id: "users",
    label: "Users",
    icon: MdPeople,
  },
  {
    id: "approvals",
    label: "Approvals",
    icon: MdVerifiedUser,
  },
  {
    id: "slots",
    label: "Bookings",
    icon: MdCalendarMonth,
  },
  {
    id: "orders",
    label: "Orders",
    icon: MdShoppingCart,
  },
  {
    id: "events",
    label: "Events",
    icon: MdEvent,
  },
  {
    id: "statistics",
    label: "Statistics",
    icon: MdBarChart,
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: MdArticle,
  },
  {
    id: "reels",
    label: "Reels",
    icon: MdMovie,
  },
  {
    id: "campaign",
    label: "Campaigns",
    icon: MdCampaign,
  },
  {
    id: "cms",
    label: "CMS",
    icon: MdWeb,
  },
  {
    id: "settings",
    label: "Settings",
    icon: MdSettings,
  },
];

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">
          <MdContentCut aria-hidden="true" />
        </div>

        <div className="admin-sidebar__brand-text">
          <h2>TrimTokyo</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <div className="admin-sidebar__section-label">
        WORKSPACE
      </div>

      <nav
        className="admin-sidebar__navigation"
        aria-label="Admin navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`admin-sidebar__nav-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => handleNavigation(item.id)}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className="admin-sidebar__nav-icon"
                aria-hidden="true"
              />

              <span>{item.label}</span>

              {isActive && (
                <span className="admin-sidebar__active-indicator" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__footer-label">
          ACCOUNT
        </div>

        <button
          type="button"
          className="admin-sidebar__logout"
          onClick={logout}
        >
          <MdLogout
            className="admin-sidebar__nav-icon"
            aria-hidden="true"
          />
          <span>Logout</span>
        </button>

        <div className="admin-sidebar__version">
          <span className="admin-sidebar__status-dot" />
          <span>Admin Workspace</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
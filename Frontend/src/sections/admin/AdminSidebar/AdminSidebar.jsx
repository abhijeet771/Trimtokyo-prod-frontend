import React from "react";
import {  MdDashboard,  MdPeople,  MdVerifiedUser,  MdCalendarMonth,  MdBarChart,
  MdArticle,  MdMovie,  MdCampaign,  MdWeb,  MdSettings,  MdLogout,
  MdContentCut,  MdShoppingCart,  MdEvent,  MdWork,  MdChevronLeft,  MdChevronRight,
  MdCardGiftcard,
} from "react-icons/md";

import { BiSupport } from "react-icons/bi";

import { useAuth } from "../../../context/AuthContext";
import "./AdminSidebar.scss";

const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: MdDashboard },
  { id: "users", label: "Users", icon: MdPeople },
  { id: "approvals", label: "Approvals", icon: MdVerifiedUser },
  { id: "subscription", label: "Subscription", icon: MdVerifiedUser },
  { id: "slots", label: "Bookings", icon: MdCalendarMonth },
  { id: "orders", label: "Orders", icon: MdShoppingCart },
  { id: "events", label: "Events", icon: MdEvent },
  { id: "statistics", label: "Statistics", icon: MdBarChart },
  { id: "blogs", label: "Blogs", icon: MdArticle },
  { id: "reels", label: "Reels", icon: MdMovie },
  { id: "campaign", label: "Campaigns", icon: MdCampaign },
  { id: "career", label: "Career", icon: MdWork },
  { id: "cms", label: "CMS", icon: MdWeb },
  { id: "barber", label: "Barber", icon: MdPeople },
  { id: "referral", label: "Referral", icon: MdCardGiftcard },
  { id: "settings", label: "Settings", icon: MdSettings },
  { id: "support", label: "Support", icon: BiSupport },
];

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen = true,
  setSidebarOpen = () => {},
}) => {
  const { logout } = useAuth();

  return (
    <aside
      className={`admin-sidebar ${
        sidebarOpen ? "admin-sidebar--open" : "admin-sidebar--closed"
      }`}
    >
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">
          <MdContentCut aria-hidden="true" />
        </div>

        {sidebarOpen && (
          <div className="admin-sidebar__brand-text">
            <h2>TrimTokyo</h2>
            <span>ADMIN PANEL</span>
          </div>
        )}

        <button
          type="button"
          className="admin-sidebar__toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <MdChevronLeft /> : <MdChevronRight />}
        </button>
      </div>

     {sidebarOpen && ( <div className="admin-sidebar__section-label"></div>)}

      <nav className="admin-sidebar__navigation" aria-label="Admin navigation">
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
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? "page" : undefined}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon
                className="admin-sidebar__nav-icon"
                aria-hidden="true"
              />

              {sidebarOpen && <span>{item.label}</span>}

              {isActive && (
                <span className="admin-sidebar__active-indicator" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        {sidebarOpen && (
          <div className="admin-sidebar__footer-label">ACCOUNT</div>
        )}

        <button
          type="button"
          className="admin-sidebar__logout"
          onClick={logout}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <MdLogout
            className="admin-sidebar__nav-icon"
            aria-hidden="true"
          />
          {sidebarOpen && <span>Logout</span>}
        </button>

        {sidebarOpen && (
          <div className="admin-sidebar__version">
            <span className="admin-sidebar__status-dot" />
            <span>Admin Workspace</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
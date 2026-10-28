import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {  Scissors,  Menu,User,  X,  Headset,
  ArrowRight,  LayoutDashboard,ShoppingCart,  Package,
  CalendarDays,  Bell,Settings,  MessageSquareWarning,
  CircleHelp,  PanelLeftClose,PanelLeftOpen,  CalendarCheck,
  Gift,
} from "lucide-react";

import { USER_SIDEBAR_MENU, USER_SIDEBAR_BOTTOM,} from "../../../constants/userSidebar";

import "./UserSideBar.scss";
const ICONS = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  CalendarDays,
  Bell,
  User,
  Settings,
  Headset,
  MessageSquareWarning,
  CircleHelp,
  CalendarCheck,
  Gift,
  Scissors,
};

const UserSideBar = ({
  collapsed = false,
  onCollapseChange,
  activeSection = "cart",
  onSectionChange,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeSidebar = () => setOpen(false);

  const toggleCollapse = () => {
    onCollapseChange?.(!collapsed);
  };

  const handleMenuClick = (item) => {
    closeSidebar();

    if (onSectionChange) {
      onSectionChange(item.id);
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  const renderMenuItem = (item) => {
    const Icon = ICONS[item.icon] || CircleHelp;
    const isActive = activeSection === item.id;

    return (
      <button
        key={item.id}
        type="button"
        title={collapsed ? item.label : undefined}
        className={`user-sidebar__link ${
          isActive ? "user-sidebar__link--active" : ""
        }`}
        onClick={() => handleMenuClick(item)}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          className="user-sidebar__link-icon"
          size={20}
          strokeWidth={1.9}
        />

        <span className="user-sidebar__link-label">
          {item.label}
        </span>

        {item.id === "notifications" && (
          <span className="user-sidebar__notification-dot" />
        )}
      </button>
    );
  };

  return (
    <>
      <button
        type="button"
        className="user-sidebar__mobile-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu size={22} />
      </button>

      <div
        className={`user-sidebar__overlay ${ open ? "user-sidebar__overlay--active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={[ "user-sidebar",
          collapsed ? "user-sidebar--collapsed" : "",
          open ? "user-sidebar--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Customer navigation"
      >
        <div className="user-sidebar__top">
          <div className="user-sidebar__brand-row">
            <button
              type="button"
              className="user-sidebar__brand"
              onClick={() => { closeSidebar(); navigate("/");}}
              aria-label="TrimTokyo home"
              title={collapsed ? "TrimTokyo home" : undefined}
            >
              <span className="user-sidebar__brand-icon">
                <Scissors size={25} strokeWidth={2.2} />
              </span>

              <span className="user-sidebar__brand-name">
                TrimTokyo
              </span>
            </button>

            <button
              type="button"
              className="user-sidebar__close"
              onClick={closeSidebar}
              aria-label="Close navigation menu"
            >
              <X size={21} />
            </button>

            <button
              type="button"
              className="user-sidebar__collapse"
              onClick={toggleCollapse}
              aria-label={ collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={ collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              {collapsed ? ( <PanelLeftOpen size={19} />) : (
                <PanelLeftClose size={19} />
              )}
            </button>
          </div>

          <div className="user-sidebar__divider" />

          <p className="user-sidebar__section-label">
            MY ACCOUNT
          </p>

          <nav className="user-sidebar__menu">
            {USER_SIDEBAR_MENU.map(renderMenuItem)}
          </nav>
        </div>

        <div className="user-sidebar__bottom">
          <nav className="user-sidebar__bottom-menu">
            {USER_SIDEBAR_BOTTOM.map(renderMenuItem)}
          </nav>

          <div className="user-sidebar__support-card">
            <span className="user-sidebar__support-icon">
              <Gift size={22} />
            </span>

            <h4>Refer a Friend</h4>

            <p>
              Share your referral code and earn 50 points
              when your referral is approved by our admin team.
            </p>

            <button
              type="button"
              className="user-sidebar__support-button"
              onClick={() => {
                closeSidebar();
                navigate("/referrals");
              }}
            >
              Refer a Friend
              <ArrowRight size={15} />
            </button>
          </div>

          <p className="user-sidebar__footer">
            TrimTokyo · Customer Account
          </p>
        </div>
      </aside>
    </>
  );
};

export default UserSideBar;
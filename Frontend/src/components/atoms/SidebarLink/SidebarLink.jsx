import React from "react";

import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  User,
  LogOut,
} from "lucide-react";

import "./SidebarLink.scss";

/* =========================
   ICON MAP
========================= */

const ICON_MAP = {
  dashboard: LayoutDashboard,
  orders: ShoppingBag,
  calendar: CalendarDays,
  user: User,
  logout: LogOut,
};

const SidebarLink = ({
  to = "#",
  icon,
  label,
  onClick,
}) => {

  const IconComponent =
    ICON_MAP[icon];

  /* =========================
     LOGOUT BUTTON
  ========================= */

  if (icon === "logout") {
    return (
      <button
        className="sidebar-link sidebar-link--logout"
        onClick={onClick}
      >

        {IconComponent && (
          <span className="sidebar-link__icon">

            <IconComponent size={20} />

          </span>
        )}

        <span className="sidebar-link__label">
          {label}
        </span>

      </button>
    );
  }

  /* =========================
     NAVIGATION LINK
  ========================= */

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar-link ${
          isActive
            ? "active"
            : ""
        }`
      }
    >

      {IconComponent && (
        <span className="sidebar-link__icon">

          <IconComponent size={20} />

        </span>
      )}

      <span className="sidebar-link__label">
        {label}
      </span>

    </NavLink>
  );
};

export default SidebarLink;
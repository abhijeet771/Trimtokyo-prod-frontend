import React from "react";

import SidebarLink from "../../atoms/SidebarLink/SidebarLink";

import { useAuth } from "../../../context/AuthContext";

const SidebarMenuItem = ({
  item,
  onClick,
}) => {

  const { logout } = useAuth();

  /* =========================
     HANDLE CLICK
  ========================= */

  const handleClick = () => {

    /* CLOSE MOBILE SIDEBAR */

    if (onClick) {
      onClick();
    }

    /* LOGOUT */

    if (item.action === "logout") {
      logout();
    }
  };

  /* =========================
     ACTION ITEM
  ========================= */

  if (item.action) {
    return (
      <SidebarLink
        icon={item.icon}
        label={item.label}
        onClick={handleClick}
      />
    );
  }

  /* =========================
     NAVIGATION ITEM
  ========================= */

  return (
    <SidebarLink
      to={item.path}
      icon={item.icon}
      label={item.label}
      onClick={handleClick}
    />
  );
};

export default SidebarMenuItem;
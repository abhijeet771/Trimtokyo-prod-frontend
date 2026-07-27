import React from "react";
import NavLink from "../../atoms/NavLink/NavLink";
import Icon from "../../atoms/Icon/Icon";
import "./NavItem.scss";

const NavItem = ({
  label,
  iconType,
  active = false,
  onClick,
  variant = "default",
}) => {
  return (
    <div
      className={`nav-item nav-item--${variant} ${
        active ? "nav-item--active" : ""
      }`}
      onClick={onClick}
    >
      {iconType && <Icon type={iconType} variant={variant} />}
      <NavLink label={label} />
    </div>
  );
};

export default NavItem;
// src/components/atoms/Navlink/Navlink.jsx

import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({
  label,
  href = "/",
  className = "",
}) => {
  const isExternal =
    href.startsWith("http");

  // EXTERNAL LINKS
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`nav-link ${className}`}
      >
        {label}
      </a>
    );
  }

  // INTERNAL LINKS
  return (
    <Link
      to={href}
      className={`nav-link ${className}`}
    >
      {label}
    </Link>
  );
};

export default NavLink;
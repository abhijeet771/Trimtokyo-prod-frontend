import React, { useState } from "react";
import "./Header.scss";

import { HEADER_DATA } from "../../../constants/header";
import Logo from "../../atoms/Logo/Logo";
import NavItem from "../../molecules/NavItem/NavItem";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__container">

        {/* LEFT */}
        <div className="header__left">
          <button className="header__cart">🛒</button>
          <Logo text={HEADER_DATA.brand} />
        </div>

        {/* CENTER NAV */}
        <nav className={`header__nav ${isOpen ? "active" : ""}`}>
          {HEADER_DATA.navLinks.map((link, index) => (
            <NavItem key={index} label={link.label} />
          ))}
        </nav>

        {/* RIGHT */}
        <div className="header__right">
          <button className="btn btn-outline">
            {HEADER_DATA.authButtons.login}
          </button>

          <button className="btn btn-primary">
            {HEADER_DATA.authButtons.register}
          </button>

          <div
            className="header__hamburger"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
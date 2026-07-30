import React from "react";
import {
  Bell,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";

import "./BarberHeaderSection.scss";

const BarberHeaderSection = () => {
  return (
    <header className="barber-header">
      {/* Left */}
      <div className="barber-header__left">
        <div className="barber-header__brand">
          <div className="barber-header__logo">
            ✂️
          </div>

          <div>
            <h2>TrimTokyo</h2>
            <span>Barber Dashboard</span>
          </div>
        </div>

        <button className="menu-btn">
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search anything..."
          />
        </div>
      </div>

      {/* Right */}
      <div className="barber-header__right">
        <button className="notification-btn">
          <Bell size={22} />

          <span className="badge">3</span>
        </button>

        <div className="profile">
          <img
            src="https://i.pravatar.cc/100"
            alt="Profile"
          />

          <div className="profile__info">
            <h4>Naturica Unisex Salon</h4>

            <span>Purnia, Bihar</span>
          </div>

          <ChevronDown size={18} />
        </div>
      </div>
    </header>
  );
};

export default BarberHeaderSection;
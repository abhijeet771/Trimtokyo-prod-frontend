import React, { useEffect, useRef, useState } from "react";
import "./Shopheader.scss";

import { SHOP_HEADER } from "../../constants/shopheader";

import {
  MapPin,
  ChevronDown,
  Search,
  Heart,
  Bell,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Shopheader = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  /* =========================
     CLOSE DROPDOWN OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================
     USERNAME + INITIAL
  ========================= */

  const username =
    user?.username ||
    user?.name ||
    user?.fullName ||
    "User";

  const initial = username.charAt(0).toUpperCase();

  /* =========================
     DASHBOARD ROUTE
  ========================= */

  const getDashboardRoute = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard";
    }

    if (user?.role === "barber") {
      return "/barber/dashboard";
    }

    return "/dashboard";
  };

  return (
    <header className="shop-header">
      {/* LEFT */}
      <div className="shop-header__left">
        <div
          className="shop-header__logo"
          onClick={() => navigate("/")}
        >
          <img
            src="/scissor.png"
            alt="TrimTokyo Logo"
          />

          <h2>
            Trim<span>Tokyo</span>
          </h2>
        </div>

        <div className="shop-header__location">
          <MapPin size={18} />

          <span>{SHOP_HEADER.location}</span>

          <ChevronDown size={18} />
        </div>
      </div>

      {/* CENTER */}
      <div className="shop-header__center">
        <div className="shop-header__search">
          <Search
            size={18}
            className="search-icon"
          />

          <input
            type="text"
            placeholder={SHOP_HEADER.placeholder}
          />

          <button>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="shop-header__right">
        <button className="barber-btn">
          {SHOP_HEADER.becomeBarber}
        </button>

        <button className="icon-btn">
          <Heart size={22} />
        </button>

        <button className="icon-btn notification-btn">
          <Bell size={22} />

          <span className="notification-dot"></span>
        </button>

        {/* PROFILE */}
        <div
          className="shop-profile-menu"
          ref={menuRef}
        >
          <button
            className="shop-profile-avatar"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu((prev) => !prev);
            }}
          >
            {initial}
          </button>

          {openMenu && (
            <div className="shop-profile-dropdown">
              {/* USER INFO */}
              <div className="shop-profile-dropdown__user">
                <div className="shop-profile-dropdown__avatar">
                  {initial}
                </div>

                <div>
                  <h4>{username}</h4>

                  <p>{user?.role || "user"}</p>
                </div>
              </div>

              {/* PROFILE */}

              <button
                className="shop-profile-dropdown__item"
                onClick={() => {
                  navigate("/profile");
                  setOpenMenu(false);
                }}
              >
                <User size={18} />

                <span>View Profile</span>
              </button>

              {/* DASHBOARD */}

              <button
                className="shop-profile-dropdown__item"
                onClick={() => {
                  navigate(getDashboardRoute());
                  setOpenMenu(false);
                }}
              >
                <LayoutDashboard size={18} />

                <span>View Dashboard</span>
              </button>

              {/* LOGOUT */}

              <button
                className="shop-profile-dropdown__item shop-profile-dropdown__logout"
                onClick={logout}
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Shopheader;
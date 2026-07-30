import React, { useState } from "react";
import {
  Bell,
  Menu,
  ChevronDown,
} from "lucide-react";

import BarberNotifications from "../../components/molecules/BarberNotification/BarberNotification";
import BarberProfileMenu from "../../components/molecules/BarberProfileMenu/BarberProfileMenu";

import "./BarberHeaderSection.scss";

const BarberHeaderSection = () => {
  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const handleLogout = () => {
    console.log("Logout");

    // Later
    // logout();
    // navigate("/auth");
  };

  return (
    <>
      <header className="barber-header">
        {/* Left */}

        <div className="barber-header__left">
          <div className="barber-header__brand">
            <div className="barber-header__logo">
              ✂️
            </div>

            <div>
              <h2>TrimTokyo</h2>

              <span>
                Barber Dashboard
              </span>
            </div>
          </div>

          <button className="menu-btn">
            <Menu size={22} />
          </button>
        </div>

        {/* Right */}

        <div className="barber-header__right">
          <button
            className="notification-btn"
            onClick={() =>
              setNotificationOpen(true)
            }
          >
            <Bell size={22} />

            <span className="badge">
              3
            </span>
          </button>

          <div className="profile-wrapper">
            <div
              className="profile"
              onClick={() =>
                setProfileOpen(
                  (prev) => !prev
                )
              }
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="Profile"
              />

              <div className="profile__info">
                <h4>
                  Naturica Unisex
                  Salon
                </h4>

                <span>
                  Purnia, Bihar
                </span>
              </div>

              <ChevronDown
                size={18}
              />
            </div>

            <BarberProfileMenu
              open={profileOpen}
              onClose={() =>
                setProfileOpen(false)
              }
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <BarberNotifications
        open={notificationOpen}
        onClose={() =>
          setNotificationOpen(false)
        }
      />
    </>
  );
};

export default BarberHeaderSection;
import React, { useState } from "react";
import {  Bell,  Menu,  ChevronDown,} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useBarberProfile from "../../hooks/barber/useBarberProfile";

import BarberNotifications from "../../components/barber/BarberNotification/BarberNotification";
import BarberProfileMenu from "../../components/barber/BarberProfileMenu/BarberProfileMenu";

import "./BarberHeaderSection.scss";

const BarberHeaderSection = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { profile, loading, error } = useBarberProfile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Prefer the barber's personal name over the shop name.
  const barberName =
    profile?.name ||
    profile?.fullName ||
    profile?.userId?.name ||
    profile?.user?.name ||
    profile?.shopName ||
    "Barber";

  const location = [
    profile?.city,
    profile?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const profileImage =
    profile?.profileImage ||
    profile?.userId?.profileImage ||
    profile?.user?.profileImage;

  return (
    <>
      <header className="barber-header">
        {/* Left */}
        <div className="barber-header__left">
          <div className="barber-header__welcome">
            <span className="barber-header__eyebrow">
              BARBER WORKSPACE
            </span>

            <h2>
              Hi {loading ? "there" : barberName}, welcome back!
            </h2>

            <p>
              Here's what's happening with your shop today.
            </p>

            {error && (
              <span role="status" className="barber-header__error">
                Unable to load your profile.
              </span>
            )}
          </div>

          <button
            type="button"
            className="menu-btn"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Right */}
        <div className="barber-header__right">
          <button
            type="button"
            className="notification-btn"
            aria-label="Notifications"
            onClick={() => setNotificationOpen(true)}
          >
            <Bell size={22} />
            <span className="badge">3</span>
          </button>

          <div className="profile-wrapper">
            <button
              type="button"
              className="profile"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${barberName}'s profile`}
                />
              ) : (
                <div className="profile__avatar" aria-hidden="true">
                  {barberName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="profile__info">
                <h4>
                  {loading ? "Loading..." : barberName}
                </h4>

                <span>
                  {loading
                    ? "Loading..."
                    : location || profile?.shopName || "Barber"}
                </span>
              </div>

              <ChevronDown size={18} />
            </button>

            <BarberProfileMenu
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <BarberNotifications
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </>
  );
};

export default BarberHeaderSection;

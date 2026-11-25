
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  UserRound,
  ChevronDown,
} from "lucide-react";

import "./UserProfileMenu.scss";

export default function UserProfileMenu({
  user = {},
  cartCount = 0,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const rootRef = useRef(null);
  const navigate = useNavigate();

  const profile = user?.profile || user || {};

  const displayName =
    profile.firstName ||
    profile.name ||
    profile.fullName ||
    profile.username ||
    "Account";

  const email = profile.email || "";

  const initial =
    String(displayName).trim().charAt(0).toUpperCase() || "A";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      if (onLogout) {
        await onLogout();
      } else {
        navigate("/auth");
      }

      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    setOpen(false);

    navigate("/cart", {
      state: { activeSection: "profile" },
    });
  };

  return (
    <div className="user-profile-menu" ref={rootRef}>
      <button
        type="button"
        className={`user-profile-menu__trigger${open ? " is-open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="user-profile-menu__avatar">
          {initial}
        </span>

        <span className="user-profile-menu__trigger-copy">
          <span className="user-profile-menu__hello">
            Hello,
          </span>

          <strong>Account</strong>
        </span>

        <ChevronDown
          className="user-profile-menu__chevron"
          size={15}
        />
      </button>

      {open && (
        <div className="user-profile-menu__popover" role="menu">
          <div className="user-profile-menu__identity">
            <span className="user-profile-menu__avatar user-profile-menu__avatar--large">
              {initial}
            </span>

            <div className="user-profile-menu__identity-text">
              <strong>{displayName}</strong>

              {email && (
                <span title={email}>{email}</span>
              )}

              {!email && <span>Welcome back</span>}
            </div>
          </div>

          <div className="user-profile-menu__divider" />

          {/* Cart */}
          <Link
            to="/cart"
            role="menuitem"
            className="user-profile-menu__item"
            onClick={() => setOpen(false)}
          >
            <ShoppingCart size={17} />

            <span>My Cart</span>

            {Number(cartCount) > 0 && (
              <span className="user-profile-menu__count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile - Opens the existing dashboard profile section */}
          <button
            type="button"
            role="menuitem"
            className="user-profile-menu__item"
            onClick={handleProfileClick}
          >
            <UserRound size={17} />

            <span>Profile</span>
          </button>

          <div className="user-profile-menu__divider" />

          {/* Logout */}
          <button
            type="button"
            role="menuitem"
            className="user-profile-menu__item user-profile-menu__logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={17} />

            <span>
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
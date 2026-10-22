import React, { useEffect, useState } from "react";
import "./HeaderSection.scss";

import {
  FiSearch,
  FiMapPin,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { HEADER_DATA } from "../../../constants/header";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import UserProfileMenu from "../../../components/User/UserProfileMenu/UserProfileMenu";

const HeaderSection = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [location, setLocation] = useState("Select Location");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );

          if (!response.ok) {
            throw new Error("Location unavailable");
          }

          const data = await response.json();
          const address = data.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            address.county ||
            "Unknown";

          const state = address.state || "";

          setLocation(state ? `${city}, ${state}` : city);
        } catch {
          setLocation("Select Location");
        }
      },
      () => setLocation("Select Location"),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  const handleSearch = () => {
    const query = searchTerm.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "";

  const handleAuthClick = () => navigate("/auth");

  const handleCartClick = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    navigate("/cart");
  };

  const handleLoginFromDialog = () => {
    setShowLoginDialog(false);
    navigate("/auth?redirect=%2Fcart");
  };

  const closeLoginDialog = () => setShowLoginDialog(false);

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__left">
            <button
              type="button"
              className="header__logo-wrapper"
              onClick={() => navigate("/")}
              aria-label="TrimTokyo home"
            >
              <img src={HEADER_DATA.logo} alt="" className="header__logo" />
              <span className="header__brand">
                TrimTokyo<span className="header__brand-dot">.</span>
              </span>
            </button>

            <button
              type="button"
              className="header__location"
              aria-label={`Selected location: ${location}`}
              title={location}
            >
              <FiMapPin className="header__location-icon" />
              <span className="header__location-content">
                <span className="header__eyebrow">Delivering to</span>
                <strong>{location}</strong>
                <span className="header__location-update">Update location</span>
              </span>
            </button>
          </div>

          <form
            className="header__search"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <span className="header__search-label">Explore</span>
            <input
              type="search"
              placeholder="Search shops, services or barbers..."
              className="header__search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search shops, services or barbers"
            />
            <button type="submit" className="header__search-btn" aria-label="Search">
              <FiSearch size={22} />
            </button>
          </form>

          <nav className="header__right" aria-label="Main navigation">
            <button
              type="button"
              className="header__shop-btn"
              onClick={handleAuthClick}
            >
              Shop
            </button>

            <button
              type="button"
              className="header__cart-btn"
              onClick={handleCartClick}
              aria-label={`Shopping cart, ${cartCount} items`}
              title="Cart"
            >
              <span className="header__cart-icon-wrap">
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="header__cart-count">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="header__cart-label">Cart</span>
            </button>

            {user ? (
              <UserProfileMenu
                user={user}
                cartCount={cartCount}
                onLogout={logout}
              />
            ) : (
              <div className="header__auth-actions">
                <button
                  type="button"
                  className="header__login-btn"
                  onClick={handleAuthClick}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="header__register-btn"
                  onClick={handleAuthClick}
                >
                  Register
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {showLoginDialog && (
        <div
          className="cart-login-modal__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLoginDialog();
          }}
        >
          <section
            className="cart-login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-login-title"
          >
            <button
              type="button"
              className="cart-login-modal__close"
              onClick={closeLoginDialog}
              aria-label="Close dialog"
            >
              <FiX size={20} />
            </button>

            <div className="cart-login-modal__icon">
              <FiShoppingCart size={27} />
            </div>
            <h2 id="cart-login-title">Your cart is waiting!</h2>
            <p>
              Please log in to continue to your cart. Your selected services
              will remain saved while you sign in.
            </p>
            <button
              type="button"
              className="cart-login-modal__login"
              onClick={handleLoginFromDialog}
            >
              Log in to continue
            </button>
            <button
              type="button"
              className="cart-login-modal__cancel"
              onClick={closeLoginDialog}
            >
              Continue browsing
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default HeaderSection;

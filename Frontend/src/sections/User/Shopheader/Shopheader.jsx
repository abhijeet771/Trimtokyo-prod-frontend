import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Search,
  ShoppingCart,
  Menu,
  CalendarCheck,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import UserProfileMenu from "../../../components/User/UserProfileMenu/UserProfileMenu";

import "./ShopHeader.scss";

const ShopHeader = ({ user: userProp, onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { cartCount } = useCart();

  const [search, setSearch] = useState("");

  // Prefer the explicitly provided user, falling back to AuthContext.
  const user = userProp || authUser || null;

  const profile = user?.profile || user || {};
  const firstName = String(
    profile.firstName ||
      profile.name ||
      profile.fullName ||
      profile.username ||
      profile.email?.split("@")[0] ||
      ""
  )
    .trim()
    .split(/\s+/)[0];

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    navigate(
      query
        ? `/search?q=${encodeURIComponent(query)}`
        : "/search"
    );
  };

  const handleCartClick = () => {
    if (!user) {
      navigate("/auth?redirect=%2Fcart");
      return;
    }

    navigate("/cart");
  };

  const handleBookingsClick = () => {
    if (!user) {
      navigate("/auth?redirect=%2Fuser");
      return;
    }

    navigate("/cart", {
      state: { activeSection: "appointments" },
    });
  };

  return (
    <header className="shop-header">
      <div className="shop-header__left">
        <button
          className="shop-header__mobile-menu"
          type="button"
          aria-label="Open account navigation"
          onClick={onOpenSidebar}
        >
          <Menu size={22} />
        </button>

        <button
          className="shop-header__brand"
          type="button"
          onClick={() => navigate("/")}
          aria-label="TrimTokyo home"
        >
          <span className="shop-header__logo">
            <Scissors size={27} strokeWidth={2.2} />
          </span>

          <span className="shop-header__brand-name">
            TrimTokyo
          </span>
        </button>
      </div>

      <form
        className="shop-header__search"
        onSubmit={handleSearch}
      >
        <span className="shop-header__search-label">
          Explore
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search shops, services or barbers..."
          aria-label="Search shops, services or barbers"
        />

        <button type="submit" aria-label="Search">
          <Search size={21} />
        </button>
      </form>

      <nav
        className="shop-header__actions"
        aria-label="Main navigation"
      >
        <button
          className="shop-header__action"
          type="button"
          onClick={handleBookingsClick}
          aria-label="My appointments"
        >
          <CalendarCheck size={21} />
          <span>Bookings</span>
        </button>

        <button
          className="shop-header__action"
          type="button"
          onClick={handleCartClick}
          aria-label={`Shopping cart, ${cartCount} items`}
        >
          <span className="shop-header__cart-icon-wrap">
            <ShoppingCart size={23} />

            {cartCount > 0 && (
              <span className="shop-header__cart-count">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>

          <span>Cart</span>
        </button>

        {user ? (
          <UserProfileMenu
            user={user}
            cartCount={cartCount}
            onLogout={logout}
          />
        ) : (
          <button
            className="shop-header__account"
            type="button"
            onClick={() => navigate("/auth")}
          >
            <span className="shop-header__account-icon">
              <Scissors size={20} />
            </span>

            <span className="shop-header__account-text">
              <small>
                {firstName ? `Hello, ${firstName}` : "Welcome"}
              </small>

              <strong>Login / Register</strong>
            </span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default ShopHeader;
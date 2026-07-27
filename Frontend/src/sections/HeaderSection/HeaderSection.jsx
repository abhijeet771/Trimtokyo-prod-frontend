import React, {  useEffect,  useState,} from "react";
import "./HeaderSection.scss";

import {  FiSearch,  FiMapPin,  FiChevronDown,} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HEADER_DATA } from "../../constants/header";

const HeaderSection = () => {
  const navigate = useNavigate();

  const [location, setLocation] =
    useState("Detecting...");

  // ================= SEARCH =================

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    if (
      !navigator.geolocation
    ) {
      setLocation(
        "Select Location"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

          const data =
            await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown";

          const state =
            data.address.state ||
            "";

          setLocation(
            `${city}, ${state}`
          );
        } catch (error) {
          setLocation(
            "Select Location"
          );
        }
      },

      () => {
        setLocation(
          "Select Location"
        );
      }
    );
  }, []);

  // ================= SEARCH HANDLER =================

  const handleSearch = () => {
    const trimmed =
      searchTerm.trim();

    if (!trimmed) return;

    navigate(
      `/shop?search=${encodeURIComponent(
        trimmed
      )}`
    );
  };

  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="header">

      <div className="header__container">
        <div className="header__left">
          <div className="header__logo-wrapper">
            <img  src={HEADER_DATA.logo}  alt="TrimTokyo"   className="header__logo"/>
            <h2 className="header__brand">{HEADER_DATA.brand}</h2>
          </div>
          <button className="header__location">
            <FiMapPin className="header__location-icon" />
            <span className="header__location-text">
              {location}
            </span>
            <FiChevronDown size={16}/>
          </button>
        </div>
        <div className="header__search">

          <FiSearch className="header__search-icon" />

          <input
            type="text"
            placeholder="Search salon, barber or service..."
            className="header__search-input"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
          />

          <button  className="header__search-btn"  onClick={ handleSearch}>
            <FiSearch size={18} />
          </button>
        </div>

        <div className="header__right">

          <button className="header__become-btn"   onClick={() => navigate("/auth")}>
            Become a Barber
          </button>

          <button className="header__login-btn" onClick={() =>  navigate("/auth")}>
            Login
          </button>

          <button className="header__register-btn"   onClick={() => navigate("/auth")}>
            Register
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
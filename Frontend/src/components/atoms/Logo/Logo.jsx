import React from "react";

import "./Logo.scss";

const Logo = ({
  variant = "default",
}) => {

  return (
    <div
      className={`logo logo--${variant}`}
    >

      {/* ================= LOGO IMAGE ================= */}

      <div className="logo__image-wrapper">

        <img
          src="/scissor.png"
          alt="TrimTokyo Logo"
          className="logo__image"
        />

      </div>

      {/* ================= LOGO TEXT ================= */}

      <div className="logo__content">

        <h2 className="logo__title">

          Barber
          <span>
            Delivery
          </span>

        </h2>

        <p className="logo__subtitle">
          Premium Grooming
        </p>

      </div>

    </div>
  );
};

export default Logo;
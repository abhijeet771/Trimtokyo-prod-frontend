import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiScissors } from "react-icons/fi";

import "./Hero.scss";
import { HERO_CONTENT } from "../../../constants/hero";

const Hero = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("men");

  const activeStyles =
    HERO_CONTENT.styles[activeTab];

  return (
    <section className="hero">
      <div className="hero__container">

        {/* ================= HERO BANNER ================= */}

        <div className="hero__banner">

          <div className="hero__content">

            <div className="hero__badge">
              <FiScissors />

              <span>
                {HERO_CONTENT.badge}
              </span>
            </div>

            <h1 className="hero__title">

              <span className="hero__title-line">
                {HERO_CONTENT.title.line1}
              </span>

              <span className="hero__title-highlight">
                {HERO_CONTENT.title.highlight}
              </span>

              <span className="hero__title-line">
                {HERO_CONTENT.title.line3}
              </span>

            </h1>

            <p className="hero__subtitle">
              {HERO_CONTENT.subtitle}
            </p>

            <button
              className="hero__popular-btn"
              onClick={() => navigate("/auth")}
            >
              <span className="hero__popular-dot"></span>

              {HERO_CONTENT.popularButton}
            </button>

          </div>

          <div className="hero__image-wrapper">

            <div className="hero__circle hero__circle--1"></div>

            <div className="hero__circle hero__circle--2"></div>

            <img
              src={HERO_CONTENT.heroImage}
              alt="Featured Hairstyle"
              className="hero__image"
            />

          </div>

        </div>

        {/* ================= EXPLORE STYLES ================= */}

        <div className="hero__styles-section">

          <div className="hero__styles-header">

            <div>
              <h2>
                Explore Styles
              </h2>

              <p>
                Find your perfect look
              </p>
            </div>

            {/* MEN / WOMEN TABS */}

            <div className="hero__style-tabs">

              <button
                type="button"
                className={
                  activeTab === "men"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("men")
                }
              >
                Men
              </button>

              <button
                type="button"
                className={
                  activeTab === "women"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("women")
                }
              >
                Women
              </button>

            </div>

          </div>

          {/* STYLE CARDS */}

          <div className="hero__styles">

            {activeStyles.map((style) => (

              <div
                className="hero__style-card"
                key={style.id}
                onClick={() => navigate("/auth")}
              >

                <div className="hero__style-image">

                  <img
                    src={style.image}
                    alt={style.name}
                  />

                </div>

                <div className="hero__style-content">

                  <h3>
                    {style.name}
                  </h3>

                  <div className="hero__style-icon">
                    <FiScissors />
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
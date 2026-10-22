import { useNavigate } from "react-router-dom";
import { FiScissors } from "react-icons/fi";

import "./Hero.scss";
import { HERO_CONTENT } from "../../../constants/hero";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__container">
        {/* HERO BANNER */}

        <div className="hero__banner">
          <div className="hero__content">
            <div className="hero__badge">
              <FiScissors />

              <span>{HERO_CONTENT.badge}</span>
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

            <div className="hero__buttons">
              <button
                type="button"
                className="hero__popular-btn"
                onClick={() => navigate("/auth")}
              >
                <span className="hero__popular-dot" />
                {HERO_CONTENT.popularButton}
              </button>

              <button
                type="button"
                className="hero__AI-btn"
                onClick={() =>
                  window.open(
                    "https://tokyo-bot-seven.vercel.app",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <span className="hero__popular-dot" />
                {HERO_CONTENT.AIButton}
              </button>
            </div>
          </div>

          <div className="hero__image-wrapper">
            <div className="hero__circle hero__circle--1" />
            <div className="hero__circle hero__circle--2" />

            <img
              src={HERO_CONTENT.heroImage}
              alt="Featured hairstyle"
              className="hero__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
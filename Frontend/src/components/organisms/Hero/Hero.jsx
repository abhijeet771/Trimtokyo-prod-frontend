import { useNavigate } from "react-router-dom";
import {  FiScissors,  FiChevronLeft,  FiChevronRight,} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import "./Hero.scss";
import { HERO_CONTENT } from "../../../constants/hero";

const Hero = () => {
  const navigate = useNavigate();

  const handleTryAI = () => {
    window.open(
      HERO_CONTENT.aiCard.link,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleTryNow = () => {
    navigate(HERO_CONTENT.cutCard.route);
  };

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
              alt="Virat Kohli Hairstyle"
              className="hero__image"
            />

          </div>

        </div>

        {/* CELEBRITIES */}
        <div className="hero__celebrities-section">

          <div className="hero__section-header">

            <h2>
              {HERO_CONTENT.celebritiesHeading}
            </h2>

            <div className="hero__arrows">
              <button>
                <FiChevronLeft />
              </button>

              <button>
                <FiChevronRight />
              </button>
            </div>

          </div>

          <div className="hero__celebrities">

            {HERO_CONTENT.celebrities.map(
              (celebrity) => (
               <div
  className="hero__celeb-card"
  key={celebrity.id}
  onClick={() => navigate("/auth")}
>
  <div className="hero__celeb-image">
    <img
      src={celebrity.image}
      alt={celebrity.name}
    />

    <div className="hero__celeb-overlay">
      Try This Style
    </div>
  </div>

  <div className="hero__celeb-content">

    <div>
      <h3>{celebrity.name}</h3>

      <p>{celebrity.style}</p>
    </div>

    <div className="hero__celeb-icon">
      <FiScissors />
    </div>

  </div>
</div>
              )
            )}

          </div>

        </div>

        {/* ACTION CARDS */}
        <div className="hero__actions">

          {/* AI CARD */}
          <div className="hero__action-card">

            <div className="hero__action-image">
              <img
                src={HERO_CONTENT.aiCard.image}
                alt="AI Hairstyle"
              />
            </div>

            <div className="hero__action-content">

              <h3>
                {HERO_CONTENT.aiCard.title}
              </h3>

              <p>
                {HERO_CONTENT.aiCard.subtitle}
              </p>

              <button
                className="hero__action-btn hero__action-btn--light"
                onClick={handleTryAI}
              >
                <HiSparkles />

                <span>
                  {HERO_CONTENT.aiCard.buttonText}
                </span>
              </button>

            </div>

          </div>

          {/* CUT CARD */}
          <div className="hero__action-card hero__action-card--pink">

            <div className="hero__action-image">
              <img
                src={HERO_CONTENT.cutCard.image}
                alt="Scissors"
              />
            </div>

            <div className="hero__action-content">

              <h3>
                {HERO_CONTENT.cutCard.title}
              </h3>

              <p>
                {HERO_CONTENT.cutCard.subtitle}
              </p>

              <button
                className="hero__action-btn"
                onClick={handleTryNow}
              >
                <span>
                  {HERO_CONTENT.cutCard.buttonText}
                </span>

                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
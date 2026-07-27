import React from "react";
import "./AboutHeroSection.scss";
import { ABOUT } from "../../constants/about";
import Button from "../../components/atoms/Button/Button";
import heroImage from "../../assets/hero-barber.png";

const AboutHeroSection = () => {
  const { title, subtitle, primaryBtn, secondaryBtn } =
  ABOUT.HERO;

  return (
    <section className="about-hero">
      <div className="about-hero__container">
        
        {/* Left Content */}
        <div className="about-hero__content">
          <h1 className="about-hero__title">{title}</h1>
          <p className="about-hero__subtitle">{subtitle}</p>

          <div className="about-hero__actions">
  <Button variant="primary">{primaryBtn}</Button>
  <Button variant="secondary">{secondaryBtn}</Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="about-hero__image">
  <img src={heroImage} alt="Barber Delivery Platform" />
</div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
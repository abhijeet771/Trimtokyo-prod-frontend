import React from "react";
import {
  MdGroups,
  MdTrendingUp,
  MdFavorite,
  MdCardGiftcard,
  MdPeople,
  MdArrowForward,
} from "react-icons/md";

import "./CareerHero.scss";

const benefits = [
  {
    title: "Great Team",
    description: "Work with passionate and talented people.",
    icon: MdGroups,
    color: "green",
  },
  {
    title: "Career Growth",
    description: "Learn, grow and take your career to the next level.",
    icon: MdTrendingUp,
    color: "blue",
  },
  {
    title: "Positive Environment",
    description: "A friendly and inclusive work culture.",
    icon: MdFavorite,
    color: "pink",
  },
  {
    title: "Employee Benefits",
    description: "Competitive pay and exclusive perks.",
    icon: MdCardGiftcard,
    color: "purple",
  },
];

const CareerHero = () => {
  const handleViewRoles = () => {
    document.getElementById("open-positions")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleWhyWorkWithUs = () => {
    document.getElementById("why-work-with-us")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="career-page">
      {/* HERO BANNER */}
      <div className="career-hero">
        <div className="career-hero__content">
          <div className="career-hero__badge">
            <MdPeople />
            <span>CAREERS AT TRIMTOKYO</span>
          </div>

          <h1>
            Build Your Career
            <span>With TrimTokyo</span>
          </h1>

          <p className="career-hero__description">
            Join a team that believes in style, creativity and making
            people feel their best. Explore exciting opportunities
            and grow with us.
          </p>

          <div className="career-hero__actions">
            <button
              type="button"
              className="career-hero__button career-hero__button--primary"
              onClick={handleViewRoles}
            >
              View Open Roles
              <MdArrowForward />
            </button>

            <button
              type="button"
              className="career-hero__button career-hero__button--secondary"
              onClick={handleWhyWorkWithUs}
            >
              Why Work With Us
            </button>
          </div>
        </div>

        <div className="career-hero__visual">
          <div className="career-hero__circle career-hero__circle--outer" />
          <div className="career-hero__circle career-hero__circle--inner" />

          <div className="career-hero__team-image">
            <img
              src="/career/career-team.png"
              alt="The TrimTokyo salon team"
            />
          </div>

          <div className="career-hero__handwritten">
            Join
            <br />
            Our Team
            <span>↙</span>
          </div>
        </div>
      </div>

      {/* WHY WORK WITH US */}
      <section className="career-benefits"  id="why-work-with-us">
        <div className="career-benefits__heading">
          <h2>Why Work With Us</h2>
          <p>
            Build your future with a team that values creativity,
            growth and great service.
          </p>
        </div>

        <div className="career-benefits__grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article className="career-benefit-card" key={benefit.title}>
                <div className={`career-benefit-card__icon career-benefit-card__icon--${benefit.color}`}>
                  <Icon />
                </div>

                <div className="career-benefit-card__content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
};

export default CareerHero;

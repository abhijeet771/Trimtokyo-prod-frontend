import React from "react";
import "./AboutWhyChooseSection.scss";

import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaLock,
  FaRupeeSign,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa";

const AboutWhyChooseSection = () => {
  return (
    <section className="about-choose">
      <div className="about-choose__container">

        {/* Header */}
        <div className="about-choose__header">
          <h2 className="about-choose__title">Why TrimTokyo?</h2>
          <p className="about-choose__subtitle">
            Experience grooming with trust, convenience, and smart technology.
          </p>
        </div>

        {/* Top Highlight Cards */}
        <div className="about-choose__top">

          <div className="about-choose__card large">
            <div className="icon orange">
              <FaShieldAlt />
            </div>
            <div>
              <h3>Verified Professionals</h3>
              <p>
                All barbers are verified to ensure quality and trust.
              </p>
            </div>
          </div>

          <div className="about-choose__card large">
            <div className="icon blue">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3>Real-Time Tracking</h3>
              <p>
                Track your barber live for full transparency.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Features */}
        <div className="about-choose__bottom">

          <div className="about-choose__card small">
            <div className="icon orange">
              <FaLock />
            </div>
            <div>
              <h4>Secure Platform</h4>
              <p>Your data is protected end-to-end.</p>
            </div>
          </div>

          <div className="about-choose__card small">
            <div className="icon blue">
              <FaRupeeSign />
            </div>
            <div>
              <h4>Transparent Pricing</h4>
              <p>No hidden fees, clear pricing.</p>
            </div>
          </div>

          <div className="about-choose__card small">
            <div className="icon green">
              <FaCalendarAlt />
            </div>
            <div>
              <h4>Flexible Scheduling</h4>
              <p>Book exactly when it suits you.</p>
            </div>
          </div>

          <div className="about-choose__card small">
            <div className="icon purple">
              <FaStar />
            </div>
            <div>
              <h4>Ratings & Reviews</h4>
              <p>Choose based on real feedback.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutWhyChooseSection;
import React from "react";
import "./AboutRolesSection.scss";

const AboutRolesSection = () => {
  return (
    <section className="about-roles">
      <div className="about-roles__container">

        {/* Header */}
        <div className="about-roles__header">
          <h2 className="about-roles__title">
            How TrimTokyo Works
          </h2>
          <p className="about-roles__subtitle">
            Book skilled barbers online and get groomed at home — no travel, no waiting.
          </p>
        </div>

        {/* Steps */}
        <div className="about-roles__steps">

          {/* Step 1 */}
          <div className="step-card">
            <div className="step-number step-1">1</div>

            <h3>Choose Your Barber</h3>

            <img
              src="/about/barber-avatar.png"
              alt="choose barber"
              className="step-image"
            />

            <p>
              Browse through top-rated barbers and select your favorite.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-number step-2">2</div>

            <h3>Pick a Time Slot</h3>

            <img
              src="/about/calendar-slot.png"
              alt="time slot"
              className="step-image"
            />

            <p>
              Select an available time slot that fits your schedule.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-number step-3">3</div>

            <h3>Get Groomed at Home</h3>

            <img
              src="/about/home-service.png"
              alt="home service"
              className="step-image"
            />

            <p>
              Relax and get a professional grooming service at your doorstep.
            </p>
          </div>

        </div>

        {/* Bottom Features */}
        <div className="about-roles__features">

          <div className="feature-box">
            <img src="/about/home-icon.png" alt="home service" />
            <div>
              <h4>At-Home Barber Service</h4>
              <p>Professional barbers come to your location.</p>
            </div>
          </div>

          <div className="feature-box">
            <img src="/about/clock-icon.png" alt="booking" />
            <div>
              <h4>Smart Slot Booking</h4>
              <p>Book instantly in real-time.</p>
            </div>
          </div>

          <div className="feature-box">
            <img src="/about/timer-icon.png" alt="save time" />
            <div>
              <h4>Save Time & Effort</h4>
              <p>Skip queues and delays.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutRolesSection;
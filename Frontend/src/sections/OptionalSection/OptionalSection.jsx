import { useState } from "react";

import { OPTIONAL_SECTION_CONTENT } from "../../constants/optionalSection";

import "./OptionalSection.scss";

const OptionalSection = () => {
  const [activeTab, setActiveTab] =
    useState("homeService");

  const activeSection =
    OPTIONAL_SECTION_CONTENT[activeTab];

  return (
    <section className="optional-section">
      <div className="optional-section__container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="optional-section__header">

          <div>
            <span className="optional-section__badge">
              GROOMING OPTIONS
            </span>

            <h2 className="optional-section__title">
              Choose Your Service
            </h2>

            <p className="optional-section__subtitle">
              Get professional grooming at home or book
              a slot at your favourite salon.
            </p>
          </div>

          {/* =========================
              TABS
          ========================== */}

          <div className="optional-section__tabs">

            <button
              type="button"
              className={
                activeTab === "homeService"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("homeService")
              }
            >
              {OPTIONAL_SECTION_CONTENT.homeService.label}
            </button>

            <button
              type="button"
              className={
                activeTab === "slotBooking"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("slotBooking")
              }
            >
              {OPTIONAL_SECTION_CONTENT.slotBooking.label}
            </button>

          </div>

        </div>

        {/* =========================
            SERVICE CARDS
        ========================== */}

        <div className="optional-section__list">

          {activeSection.items.map((item) => (

            <div
              className="optional-section__card"
              key={item.id}
            >

              <div className="optional-section__image">

                <img
                  src={item.image}
                  alt={item.name}
                />

              </div>

              <div className="optional-section__content">

                <h3>
                  {item.name}
                </h3>

                <p>
                  Avg. ₹{item.avgPrice}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default OptionalSection;
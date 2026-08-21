import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {  OPTIONAL_SECTION_CONTENT,} from "../../constants/optionalSection";
import "./OptionalSection.scss";

const OptionalSection = () => {
  const [activeTab, setActiveTab] =
    useState("homeService");

  const navigate = useNavigate();

  const activeSection =
    OPTIONAL_SECTION_CONTENT.tabs[activeTab];

  const handleItemClick = () => {
    navigate("/auth");
  };

  return (
    <section className="optional-section">
      <div className="optional-section__container">

        {/* ================= HEADER ================= */}

        <div className="optional-section__header">

          <div className="optional-section__heading">

            <span className="optional-section__badge">
              GROOMING OPTIONS
            </span>

            <h2 className="optional-section__title">
              {OPTIONAL_SECTION_CONTENT.title}
            </h2>

            <p className="optional-section__subtitle">
              {OPTIONAL_SECTION_CONTENT.subtitle}
            </p>

          </div>

          {/* ================= TABS ================= */}

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
              {
                OPTIONAL_SECTION_CONTENT.tabs
                  .homeService.label
              }
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
              {
                OPTIONAL_SECTION_CONTENT.tabs
                  .slotBooking.label
              }
            </button>

          </div>

        </div>

        {/* ================= CARDS ================= */}

        <div className="optional-section__list">

          {activeSection.items.map((item) => (

            <div
              className="optional-section__card"
              key={item.id}
              onClick={handleItemClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  handleItemClick();
                }
              }}
            >

              {/* IMAGE */}

              <div className="optional-section__image">

                <img
                  src={item.image}
                  alt={item.name}
                />

              </div>

              {/* CONTENT */}

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
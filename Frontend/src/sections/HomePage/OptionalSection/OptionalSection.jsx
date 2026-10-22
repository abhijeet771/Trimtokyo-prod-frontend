import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { OPTIONAL_SECTION_CONTENT } from "../../../constants/optionalSection";
import "./OptionalSection.scss";

const OptionalSection = () => {
  const [activeTab, setActiveTab] = useState("homeService");
  const navigate = useNavigate();

  const activeSection = OPTIONAL_SECTION_CONTENT.tabs[activeTab];

  const handleItemClick = () => {
    navigate("/auth");
  };

  const handleViewAll = () => {
    navigate(
      activeTab === "homeService"
        ? "/search?q=home%20service"
        : "/search?q=slot%20booking"
    );
  };

  return (
    <section className="optional-section">
      <div className="optional-section__container">
        {/* TABS */}
        <div className="optional-section__tabs">
          <button
            type="button"
            className={activeTab === "homeService" ? "active" : ""}
            onClick={() => setActiveTab("homeService")}
          >
            {OPTIONAL_SECTION_CONTENT.tabs.homeService.label}
          </button>

          <button
            type="button"
            className={activeTab === "slotBooking" ? "active" : ""}
            onClick={() => setActiveTab("slotBooking")}
          >
            {OPTIONAL_SECTION_CONTENT.tabs.slotBooking.label}
          </button>
        </div>

        {/* CARDS */}
        <div className="optional-section__list">
          {activeSection.items.map((item) => (
            <div
              className="optional-section__card"
              key={item.id}
              onClick={handleItemClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick();
                }
              }}
            >
              <div className="optional-section__image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="optional-section__content">
                <h3>{item.name}</h3>
                <p>Avg. ₹{item.avgPrice}</p>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL */}
        <div className="optional-section__view-all">
          <button type="button" onClick={handleViewAll}>
            View All
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OptionalSection;
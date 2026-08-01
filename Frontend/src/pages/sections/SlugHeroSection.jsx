import {
  CalendarDays,
  Scissors,
} from "lucide-react";

import "./SlugHeroSection.scss";

const SlugHeroSection = ({
  details,
  images,
}) => {
  const coverImage =
    images?.find(
      (img) => img.isCover
    ) || images?.[0];

  return (
    <section
      className="slug-hero-section"
      style={{
        backgroundImage: `url(${
          coverImage?.url ||
          "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1600"
        })`,
      }}
    >
      <div className="hero-overlay" />

      <div className="slug-container hero-content">
        <span className="hero-badge">
          Premium Salon
        </span>

        <h1>
          {details?.salonName ||
            "TrimTokyo Salon"}
        </h1>

        <p>
          {details?.description ||
            "Experience premium grooming with professional barbers, modern styling and exceptional customer service."}
        </p>

        <div className="hero-actions">
          <button className="primary-btn">
            <CalendarDays
              size={18}
            />
            Book Appointment
          </button>

          <button className="secondary-btn">
            <Scissors
              size={18}
            />
            View Services
          </button>
        </div>

        <div className="hero-scroll">
          Scroll to Explore
        </div>
      </div>
    </section>
  );
};

export default SlugHeroSection;
import "./TestimonialCard.scss";

import {
  FaStar,
  FaCheckCircle,
  FaQuoteRight,
} from "react-icons/fa";

import { HiMiniCalendarDays } from "react-icons/hi2";

const TestimonialCard = ({
  name,
  image,
  description,
  location,
  rating,
  bookedCount,
  featured,
}) => {
  return (
    <div
      className={`testimonial-card ${
        featured
          ? "testimonial-card--featured"
          : ""
      }`}
    >
      <div className="testimonial-card__quote">
        <FaQuoteRight />
      </div>

      {featured && (
        <div className="testimonial-card__badge">
          Featured
        </div>
      )}

      <div className="testimonial-card__top">
        <div className="testimonial-card__image">
          <img src={image} alt={name} />
        </div>
      </div>

      <div className="testimonial-card__stars">
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} />
        ))}
      </div>

      <h4 className="testimonial-card__name">
        {name}
      </h4>

      <div className="testimonial-card__meta">
        <FaCheckCircle />

        <span>Verified Customer</span>

        <div className="testimonial-card__dot"></div>

        <span>{location}</span>
      </div>

      <p className="testimonial-card__description">
        {description}
      </p>

      <div className="testimonial-card__footer">
        <HiMiniCalendarDays />

        <span>
          Booked {bookedCount} times
        </span>
      </div>
    </div>
  );
};

export default TestimonialCard;
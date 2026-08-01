import {
  Star,
  MessageCircle,
} from "lucide-react";

import "./SlugReviewsSection.scss";

const SlugReviewsSection = ({
  rating = 0,
  totalReviews = 0,
}) => {
  return (
    <section className="slug-reviews-section">
      <div className="slug-container">
        <div className="section-header">
          <span>REVIEWS</span>

          <h2>
            What Our Customers Say
          </h2>

          <p>
            Trusted by customers for
            quality grooming and
            exceptional service.
          </p>
        </div>

        <div className="reviews-summary">
          <div className="rating-card">
            <Star
              className="star-icon"
              size={48}
              fill="currentColor"
            />

            <h3>
              {Number(rating).toFixed(1)}
            </h3>

            <p>
              Overall Rating
            </p>
          </div>

          <div className="review-card">
            <MessageCircle
              size={42}
            />

            <h3>
              {totalReviews}
            </h3>

            <p>
              Customer Reviews
            </p>
          </div>
        </div>

        <div className="coming-soon">
          <MessageCircle
            size={48}
          />

          <h3>
            Individual Reviews
            Coming Soon
          </h3>

          <p>
            Customer testimonials
            and detailed reviews
            will appear here in a
            future update.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SlugReviewsSection;
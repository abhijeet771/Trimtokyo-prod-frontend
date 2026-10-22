
import { useMemo } from "react";
import { Star, MessageSquareText, UserRound } from "lucide-react";

import "./SlugReviewsSection.scss";

const getReviewerName = (review) =>
  review?.userName ||
  review?.user?.name ||
  review?.customerName ||
  review?.name ||
  "Customer";

const getReviewerImage = (review) =>
  review?.user?.profileImage ||
  review?.profileImage ||
  review?.avatar ||
  "";

const formatReviewDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RatingStars = ({ rating = 0, size = 17 }) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <span
      className="slug-reviews__stars"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= safeRating ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
      ))}
    </span>
  );
};

const SlugReviewsSection = ({
  reviews = [],
  averageRating,
  totalReviews,
}) => {
  const reviewList = useMemo(
    () => (Array.isArray(reviews) ? reviews : []),
    [reviews]
  );

  if (reviewList.length === 0) {
    return null;
  }

  const ratings = reviewList
    .map((review) => Number(review?.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  const calculatedAverage = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : 0;

  const displayedAverage = Number(averageRating);
  const ratingValue =
    averageRating !== undefined &&
    averageRating !== null &&
    averageRating !== "" &&
    Number.isFinite(displayedAverage) &&
    displayedAverage >= 0 &&
    displayedAverage <= 5
      ? displayedAverage
      : calculatedAverage;

  const reviewCount =
    Number.isFinite(Number(totalReviews)) && Number(totalReviews) >= 0
      ? Number(totalReviews)
      : reviewList.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = ratings.filter((value) => value === rating).length;

    return {
      rating,
      count,
      percentage: ratings.length ? (count / ratings.length) * 100 : 0,
    };
  });

  return (
    <section className="slug-reviews" id="salon-reviews">
      <div className="slug-reviews__header">
        <div className="slug-reviews__heading">
          <span className="slug-reviews__heading-icon">
            <MessageSquareText size={20} />
          </span>

          <div>
            <h2>Customer Reviews</h2>
            <p>See what customers are saying about their experience.</p>
          </div>
        </div>

        <span className="slug-reviews__count">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="slug-reviews__overview">
        <div className="slug-reviews__score">
          <strong>{ratingValue.toFixed(1)}</strong>
          <RatingStars rating={Math.round(ratingValue)} size={19} />
          <span>Based on {reviewCount} reviews</span>
        </div>

        <div className="slug-reviews__distribution">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div className="slug-reviews__distribution-row" key={rating}>
              <span className="slug-reviews__distribution-label">
                {rating}
                <Star size={12} fill="currentColor" />
              </span>

              <div
                className="slug-reviews__progress"
                role="progressbar"
                aria-label={`${rating} star reviews`}
                aria-valuemin={0}
                aria-valuemax={ratings.length || 1}
                aria-valuenow={count}
              >
                <span style={{ width: `${percentage}%` }} />
              </div>

              <span className="slug-reviews__distribution-count">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="slug-reviews__list">
        {reviewList.map((review, index) => {
          const reviewId =
            review?._id || review?.id || `review-${index}`;

          const reviewerName = getReviewerName(review);
          const reviewerImage = getReviewerImage(review);
          const rating = Number(review?.rating) || 0;
          const date = formatReviewDate(
            review?.createdAt || review?.date
          );

          return (
            <article className="slug-reviews__card" key={reviewId}>
              <div className="slug-reviews__reviewer">
                {reviewerImage ? (
                  <img
                    className="slug-reviews__avatar"
                    src={reviewerImage}
                    alt={reviewerName}
                    loading="lazy"
                  />
                ) : (
                  <span className="slug-reviews__avatar slug-reviews__avatar--placeholder">
                    <UserRound size={21} />
                  </span>
                )}

                <div className="slug-reviews__reviewer-info">
                  <h3>{reviewerName}</h3>

                  {date && (
                    <time dateTime={review?.createdAt || review?.date}>
                      {date}
                    </time>
                  )}
                </div>

                <span className="slug-reviews__rating-badge">
                  <Star size={13} fill="currentColor" />
                  {rating > 0 ? rating.toFixed(1) : "—"}
                </span>
              </div>

              <RatingStars rating={rating} size={15} />

              {review?.comment && (
                <p className="slug-reviews__comment">{review.comment}</p>
              )}

              {review?.reply && (
                <div className="slug-reviews__reply">
                  <strong>Salon response</strong>
                  <p>{review.reply}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default SlugReviewsSection;

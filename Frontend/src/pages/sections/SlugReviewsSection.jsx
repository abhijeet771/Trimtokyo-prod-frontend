
import { useMemo, useState } from "react";
import {
  Star, MessageSquareText, UserRound,
  Pencil, Trash2, Send, ChevronLeft, ChevronRight
} from "lucide-react";

import useReview from "../../hooks/user/useReview";
import { useAuth } from "../../context/AuthContext";
import "./SlugReviewsSection.scss";

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id ?? value.id ?? "");
};

const getName = (review) =>
  review.userId?.name ||
  review.user?.name ||
  review.name ||
  "Customer";

const getAvatar = (review) =>
  review.userId?.avatar ||
  review.user?.avatar ||
  review.userId?.profileImage ||
  review.user?.profileImage ||
  "";

const RatingStars = ({ rating = 0, size = 17 }) => (
  <span className="slug-reviews__stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        fill={n <= Math.round(rating) ? "currentColor" : "none"}
      />
    ))}
  </span>
);

const SlugReviewsSection = ({
  barberId,
  reviews: initialReviews = [],
  averageRating: initialAverageRating = 0,
  totalReviews: initialTotalReviews = 0,
}) => {
  const { user } = useAuth();

  const {
    reviews,
    summary,
    loading,
    page,
    totalPages,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
    fetchReviews,
    mutationLoading,
    error: hookError,
  } = useReview(barberId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");

  const currentUserId = getId(user?._id ?? user?.id);

  const reviewList = Array.isArray(reviews)
    ? reviews
    : initialReviews;

  const ownReview = useMemo(
    () =>
      reviewList.find(
        (review) =>
          getId(review.userId?._id ?? review.userId ?? review.user?._id) ===
          currentUserId
      ),
    [reviewList, currentUserId]
  );

  const avgRating = Number(
    summary?.avgRating ?? initialAverageRating
  );

  const reviewCount = Number(
    summary?.totalReviews ?? initialTotalReviews
  );

  const distribution = summary?.distribution || {};

  const getDistributionCount = (star) => {
    if (Array.isArray(distribution)) {
      return Number(
        distribution.find((item) => Number(item.rating) === star)?.count || 0
      );
    }
    return Number(distribution[star] || 0);
  };

  const resetForm = () => {
    setRating(5);
    setComment("");
    setEditingReview(null);
    setFormError("");
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || "");
    setFormError("");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setFormError("");
    setFeedback("");

    if (!barberId) {
      setFormError("Shop information is missing. Please refresh the page.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setFormError("Please select a rating.");
      return;
    }

    if (comment.length > 500) {
      setFormError("Review cannot exceed 500 characters.");
      return;
    }

    try {
      if (editingReview) {
        await handleUpdateReview(editingReview._id, {
          rating,
          comment,
        });
        setFeedback("Review updated successfully.");
      } else {
        await handleCreateReview({
          barberId,
          rating,
          comment,
        });
        setFeedback("Review submitted successfully.");
      }

      resetForm();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        err.message ||
        "Unable to submit review."
      );
    }
  };

  const deleteReview = async (review) => {
    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      await handleDeleteReview(review._id);
      setFeedback("Review deleted successfully.");
      resetForm();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        err.message ||
        "Unable to delete review."
      );
    }
  };

  return (
    <section className="slug-reviews" id="customer-reviews">

      {/* Header */}
      <header className="slug-reviews__header">
        <div className="slug-reviews__header-content">
          <div className="slug-reviews__header-icon">
            <MessageSquareText size={23} />
          </div>
          <div>
            <h2 className="slug-reviews__title">Customer Reviews</h2>
            <p className="slug-reviews__subtitle">
              See what customers are saying about their experience.
            </p>
          </div>
        </div>
        <span className="slug-reviews__count-badge">
          {reviewCount} reviews
        </span>
      </header>

      {/* Summary and form */}
      <div className="slug-reviews__top-grid">

        <div className="slug-reviews__overview">
          <div className="slug-reviews__rating-main">
            <strong className="slug-reviews__average">
              {avgRating.toFixed(1)}
            </strong>
            <RatingStars rating={avgRating} size={23} />
            <span className="slug-reviews__based-on">
              Based on {reviewCount} reviews
            </span>
          </div>

          <div className="slug-reviews__distribution">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = getDistributionCount(star);
              const percentage = reviewCount
                ? (count / reviewCount) * 100
                : 0;

              return (
                <div className="slug-reviews__distribution-row" key={star}>
                  <span className="slug-reviews__distribution-star">
                    {star} <Star size={14} fill="currentColor" />
                  </span>
                  <div className="slug-reviews__bar">
                    <div
                      className="slug-reviews__bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="slug-reviews__distribution-count">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="slug-reviews__form-wrapper">
          <h3 className="slug-reviews__form-heading">
            {editingReview ? "Edit Your Review" : "Write a Review"}
          </h3>
          <p className="slug-reviews__form-description">
            Share your experience with this salon.
          </p>

          {!user ? (
            <div className="slug-reviews__login-message">
              Please log in to rate this salon and write a review.
            </div>
          ) : ownReview && !editingReview ? (
            <div className="slug-reviews__existing-note">
              You've already reviewed this salon.
              You can edit or delete your review below.
            </div>
          ) : (
            <form
              className="slug-reviews__form"
              onSubmit={submitReview}
            >
              <label className="slug-reviews__field-label">
                Your Rating
              </label>

              <div className="slug-reviews__star-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={star <= rating ? "active" : ""}
                    onClick={() => setRating(star)}
                    aria-label={`${star} stars`}
                  >
                    <Star
                      size={27}
                      fill={star <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>

              <label
                className="slug-reviews__field-label"
                htmlFor="review-comment"
              >
                Your Review
              </label>

              <textarea
                id="review-comment"
                className="slug-reviews__textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                maxLength={500}
              />

              <div className="slug-reviews__form-footer">
                <span className="slug-reviews__character-count">
                  {comment.length}/500
                </span>

                <div className="slug-reviews__form-actions">
                  {editingReview && (
                    <button
                      type="button"
                      className="slug-reviews__cancel-button"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    className="slug-reviews__submit-button"
                    disabled={mutationLoading}
                  >
                    <Send size={15} />
                    {mutationLoading
                      ? "Saving..."
                      : editingReview
                        ? "Update Review"
                        : "Submit Review"}
                  </button>
                </div>
              </div>

              {formError && (
                <p className="slug-reviews__form-error">{formError}</p>
              )}
            </form>
          )}

          {feedback && (
            <p className="slug-reviews__feedback">
              {feedback}
            </p>
          )}

          {hookError && (
            <p className="slug-reviews__form-error">
              {typeof hookError === "string"
                ? hookError
                : hookError.message}
            </p>
          )}
        </div>
      </div>

      {/* Customer feedback */}
      <div className="slug-reviews__list-heading">
        <h3>Customer Feedback</h3>
        <span>{reviewCount} total</span>
      </div>

      {loading ? (
        <div className="slug-reviews__empty">
          Loading customer reviews...
        </div>
      ) : reviewList.length === 0 ? (
        <div className="slug-reviews__empty">
          <div className="slug-reviews__empty-icon">
            <MessageSquareText size={24} />
          </div>
          <p>Be the first to share your experience at this salon.</p>
        </div>
      ) : (
        <div className="slug-reviews__list">
          {reviewList.map((review) => {
            const isOwner =
              getId(
                review.userId?._id ??
                review.userId ??
                review.user?._id
              ) === currentUserId;

            return (
              <article
                className="slug-reviews__review-card"
                key={review._id}
              >
                <div className="slug-reviews__reviewer">
                  <div className="slug-reviews__avatar">
                    {getAvatar(review) ? (
                      <img src={getAvatar(review)} alt="" />
                    ) : (
                      <UserRound size={21} />
                    )}
                  </div>

                  <div className="slug-reviews__reviewer-info">
                    <h4>{getName(review)}</h4>
                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="slug-reviews__review-content">
                  <div className="slug-reviews__review-meta">
                    <RatingStars rating={review.rating} />
                    <span>{Number(review.rating).toFixed(1)}</span>
                  </div>

                  {review.comment && (
                    <p className="slug-reviews__review-comment">
                      {review.comment}
                    </p>
                  )}
                </div>

                {isOwner && (
                  <div className="slug-reviews__owner-actions">
                    <button
                      type="button"
                      onClick={() => startEdit(review)}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReview(review)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="slug-reviews__pagination">
          <button
            disabled={page <= 1}
            onClick={() => fetchReviews(page - 1)}
          >
            <ChevronLeft size={17} />
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchReviews(page + 1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
};

export default SlugReviewsSection;
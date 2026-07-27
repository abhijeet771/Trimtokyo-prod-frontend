import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import useReview from "../../../hooks/useReview";
import { REVIEW } from "../../../constants/review";
import "./ReviewOverlay.scss";

const ReviewOverlay = ({ barberId, onClose, onBook }) => {
  const {  reviews,  summary,  loading,  page,  totalPages,  fetchReviews,  handleCreateReview, } = useReview(barberId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!rating) return alert(REVIEW.SELECT_RATING);

    try {
      await handleCreateReview({ rating, comment });
      setRating(0);
      setComment("");
    } catch (err) {
      alert("Error submitting review");
    }
  };

  return (
    <div className="review-overlay">
      <div className="overlay-container">

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="overlay-content">

          {/* LEFT - REVIEWS */}
          <div className="reviews-section">
            <h2>{REVIEW.TITLE}</h2>

            {/* SUMMARY */}
            <div className="summary">
              <div className="rating-display">
                <span className="rating-number">
                  {summary.avgRating || 0}
                </span>

                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= Math.round(summary.avgRating || 0) ? (
                      <FaStar key={star} />
                    ) : (
                      <FaRegStar key={star} />
                    )
                  )}
                </div>
              </div>

              <p>
                {summary.totalReviews || 0} {REVIEW.TOTAL_REVIEWS}
              </p>

              {/* DISTRIBUTION */}
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.distribution?.[star] || 0;
                  const total = summary.totalReviews || 1;
                  const percent = (count / total) * 100;

                  return (
                    <div key={star} className="bar-row">
                      <span>{star}</span>

                      <div className="bar">
                        <div
                          className="fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <span>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADD REVIEW */}
            <div className="add-review">
              <h3>{REVIEW.ADD_REVIEW}</h3>

              <div className="stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)}>
                    {star <= rating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

              <textarea
                placeholder={REVIEW.PLACEHOLDER}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button onClick={handleSubmit}>
                {REVIEW.SUBMIT}
              </button>
            </div>

            {/* REVIEWS */}
            <div className="review-list">
              {loading ? (
                <p>{REVIEW.LOADING}</p>
              ) : reviews.length === 0 ? (
                <p>{REVIEW.NO_REVIEWS}</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="review-card">

                    <div className="review-header">
                      <div className="avatar">
                        {rev.user?.name?.charAt(0) || "U"}
                      </div>

                      <div className="info">
                        <span className="name">
                          {rev.user?.name || "User"}
                        </span>

                        <div className="stars">
                          {[1, 2, 3, 4, 5].map((s) =>
                            s <= rev.rating ? (
                              <FaStar key={s} />
                            ) : (
                              <FaRegStar key={s} />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="comment">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => fetchReviews(i + 1)}
                  className={page === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - BOOKING */}
          <div className="booking-section">
            <div className="booking-card">
              <h3>{REVIEW.BOOK_TITLE}</h3>
              <p>{REVIEW.STARTING_FROM} ₹45</p>

              <button
                className="book-btn"
                onClick={() => onBook?.()}
              >
                {REVIEW.BOOK_NOW}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewOverlay;
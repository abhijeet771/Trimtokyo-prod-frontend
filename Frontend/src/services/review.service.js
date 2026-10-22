
import api from "./api";

/* ============================================================
   REVIEW APIs
============================================================ */

// Create a review
export const createReview = (data) =>
  api.post("/api/reviews", data);

// Get paginated reviews for a barber
export const getReviews = (
  barberId,
  page = 1,
  limit = 10
) =>
  api.get(`/api/reviews/shop/${barberId}`, {
    params: { page, limit },
  });

// Get rating summary for a barber
export const getReviewSummary = (barberId) =>
  api.get(`/api/reviews/summary/${barberId}`);

// Update a review
export const updateReview = (reviewId, data) =>
  api.put(`/api/reviews/${reviewId}`, data);

// Delete a review
export const deleteReview = (reviewId) =>
  api.delete(`/api/reviews/${reviewId}`);

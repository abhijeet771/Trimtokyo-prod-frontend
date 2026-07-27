import { useEffect, useState } from "react";
import {  createReview, getReviews, getReviewSummary, updateReview, deleteReview,} from "../services/api";

const useReview = (barberId) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    avgRating: 0,
    totalReviews: 0,
    distribution: {},
  });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  /* -------------------------------------------------------------------------- */
  /*                               FETCH REVIEWS                                */
  /* -------------------------------------------------------------------------- */

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await getReviews(barberId, pageNum, limit);

      setReviews(res.data.data.reviews);
      setTotalPages(res.data.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               FETCH SUMMARY                                */
  /* -------------------------------------------------------------------------- */

  const fetchSummary = async () => {
    try {
      const res = await getReviewSummary(barberId);
      setSummary(res.data.data);
    } catch (err) {
      console.error("Error fetching summary", err);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               CREATE REVIEW                                */
  /* -------------------------------------------------------------------------- */

  const handleCreateReview = async (data) => {
    try {
      await createReview({
        barberId,
        rating: data.rating,
        comment: data.comment,
      });

      await fetchReviews(1);
      await fetchSummary();
    } catch (err) {
      console.error("Error creating review", err);
      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               UPDATE REVIEW                                */
  /* -------------------------------------------------------------------------- */

  const handleUpdateReview = async (reviewId, data) => {
    try {
      await updateReview(reviewId, data);

      await fetchReviews(page);
      await fetchSummary();
    } catch (err) {
      console.error("Error updating review", err);
      throw err;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               DELETE REVIEW                                */
  /* -------------------------------------------------------------------------- */

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);

      await fetchReviews(page);
      await fetchSummary();
    } catch (err) {
      console.error("Error deleting review", err);
      throw err;
    }
  };

  /*                               INITIAL LOAD                                 */

  useEffect(() => {
    if (!barberId) return;

    fetchReviews(1);
    fetchSummary();
  }, [barberId]);

  return {    reviews,   summary,
    loading,
    page,
    totalPages,

    fetchReviews,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
  };
};

export default useReview;

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createReview,
  getReviews,
  getReviewSummary,
  updateReview,
  deleteReview,
} from "../../services/review.service";

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const getErrorMessage = (err) =>
  err.response?.data?.message ||
  err.message ||
  "Something went wrong. Please try again.";

const DEFAULT_SUMMARY = {
  avgRating: 0,
  totalReviews: 0,
  distribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
};

/* -------------------------------------------------------------------------- */
/*                                REVIEW HOOK                                 */
/* -------------------------------------------------------------------------- */

const useReview = (barberId) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);

  const [loading, setLoading] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  /* ------------------------------------------------------------------------ */
  /*                              FETCH REVIEWS                               */
  /* ------------------------------------------------------------------------ */

  const fetchReviews = useCallback(
    async (pageNum = 1) => {
      if (!barberId) {
        setReviews([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await getReviews(
          barberId,
          pageNum,
          limit
        );

        const result = res.data?.data;

        setReviews(
          Array.isArray(result?.reviews)
            ? result.reviews
            : []
        );

        setTotalPages(result?.totalPages || 1);
        setPage(result?.currentPage || pageNum);

        return result;
      } catch (err) {
        const message = getErrorMessage(err);

        setError(message);
        console.error("Error fetching reviews:", err);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [barberId]
  );

  /* ------------------------------------------------------------------------ */
  /*                              FETCH SUMMARY                               */
  /* ------------------------------------------------------------------------ */

  const fetchSummary = useCallback(async () => {
    if (!barberId) {
      setSummary(DEFAULT_SUMMARY);
      return;
    }

    try {
      const res = await getReviewSummary(barberId);

      setSummary({
        ...DEFAULT_SUMMARY,
        ...(res.data?.data || {}),
      });
    } catch (err) {
      console.error("Error fetching review summary:", err);
      throw err;
    }
  }, [barberId]);

  /* ------------------------------------------------------------------------ */
  /*                              REFRESH REVIEWS                             */
  /* ------------------------------------------------------------------------ */

  const refreshReviews = useCallback(
    async (pageNum = page) => {
      await Promise.all([
        fetchReviews(pageNum),
        fetchSummary(),
      ]);
    },
    [fetchReviews, fetchSummary, page]
  );

  /* ------------------------------------------------------------------------ */
  /*                              CREATE REVIEW                               */
  /* ------------------------------------------------------------------------ */

  const handleCreateReview = useCallback(
    async (data) => {
      if (!barberId) {
        throw new Error("Barber ID is required.");
      }

      try {
        setMutationLoading(true);
        setError("");

        const res = await createReview({
          barberId,
          rating: data.rating,
          comment: data.comment || "",
        });

        await refreshReviews(1);

        return {
          success: true,
          data: res.data?.data,
          message:
            res.data?.message ||
            "Review created successfully.",
        };
      } catch (err) {
        const message = getErrorMessage(err);

        setError(message);
        console.error("Error creating review:", err);

        throw new Error(message);
      } finally {
        setMutationLoading(false);
      }
    },
    [barberId, refreshReviews]
  );

  /* ------------------------------------------------------------------------ */
  /*                              UPDATE REVIEW                               */
  /* ------------------------------------------------------------------------ */

  const handleUpdateReview = useCallback(
    async (reviewId, data) => {
      try {
        setMutationLoading(true);
        setError("");

        const res = await updateReview(reviewId, {
          rating: data.rating,
          comment: data.comment || "",
        });

        await refreshReviews(page);

        return {
          success: true,
          data: res.data?.data,
          message:
            res.data?.message ||
            "Review updated successfully.",
        };
      } catch (err) {
        const message = getErrorMessage(err);

        setError(message);
        console.error("Error updating review:", err);

        throw new Error(message);
      } finally {
        setMutationLoading(false);
      }
    },
    [page, refreshReviews]
  );

  /* ------------------------------------------------------------------------ */
  /*                              DELETE REVIEW                               */
  /* ------------------------------------------------------------------------ */

  const handleDeleteReview = useCallback(
    async (reviewId) => {
      try {
        setMutationLoading(true);
        setError("");

        const res = await deleteReview(reviewId);

        // If the last review on a page is deleted,
        // move back to the previous page.
        const nextPage =
          reviews.length === 1 && page > 1
            ? page - 1
            : page;

        await refreshReviews(nextPage);

        return {
          success: true,
          message:
            res.data?.message ||
            res.data?.data?.message ||
            "Review deleted successfully.",
        };
      } catch (err) {
        const message = getErrorMessage(err);

        setError(message);
        console.error("Error deleting review:", err);

        throw new Error(message);
      } finally {
        setMutationLoading(false);
      }
    },
    [page, reviews.length, refreshReviews]
  );

  /* ------------------------------------------------------------------------ */
  /*                               INITIAL LOAD                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!barberId) {
      setReviews([]);
      setSummary(DEFAULT_SUMMARY);
      setPage(1);
      setTotalPages(1);
      return;
    }

    fetchReviews(1).catch(() => {});
    fetchSummary().catch(() => {});
  }, [barberId, fetchReviews, fetchSummary]);

  /* ------------------------------------------------------------------------ */
  /*                                  RETURN                                  */
  /* ------------------------------------------------------------------------ */

  return {
    reviews,
    summary,

    loading,
    mutationLoading,
    error,

    page,
    totalPages,
    limit,

    fetchReviews,
    fetchSummary,
    refreshReviews,

    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
  };
};

export default useReview;

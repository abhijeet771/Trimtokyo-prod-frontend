
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAdminAnalytics,
  getAdminUsersAnalytics,
  getAdminBarberAnalytics,
} from "../../services/admin/adminAnalytics.service";

/* =========================================
   ADMIN ANALYTICS HOOK
========================================= */

const useAdminAnalytics = (
  filters = {},
  type = "revenue"
) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================================
     FETCH ANALYTICS
  ========================================= */

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let getAnalytics;

      switch (type) {
        case "users":
          getAnalytics = getAdminUsersAnalytics;
          break;

        case "barbers":
          getAnalytics = getAdminBarberAnalytics;
          break;

        case "revenue":
        default:
          getAnalytics = getAdminAnalytics;
          break;
      }

      const response = await getAnalytics({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch analytics"
        );
      }

      setAnalytics(response.data);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch analytics";

      setError(message);
      setAnalytics(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, [
    filters.startDate,
    filters.endDate,
    type,
  ]);

  /* =========================================
     AUTO FETCH
  ========================================= */

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  /* =========================================
     RETURN
  ========================================= */

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export default useAdminAnalytics;

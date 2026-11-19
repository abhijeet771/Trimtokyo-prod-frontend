
import { useCallback, useEffect, useState } from "react";
import {
  getAdminAnalytics,
  getAdminUsersAnalytics,
} from "../../services/admin/adminAnalytics.service";

const useAdminAnalytics = (filters = {}, type = "revenue") => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const getAnalytics =
        type === "users"
          ? getAdminUsersAnalytics
          : getAdminAnalytics;

      const response = await getAnalytics(filters);

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
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate, type]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export default useAdminAnalytics;

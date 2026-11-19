
import { useCallback, useEffect, useState } from "react";
import { getAdminAnalytics } from "../../services/admin/adminAnalytics.service";

const useAdminAnalytics = (filters = {}) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminAnalytics(filters);

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
  }, [filters.startDate, filters.endDate]);

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

import { useCallback, useEffect, useState } from "react";
import { getAdminOrderStats } from "../../services/adminOrders.service";

const useAdminOrderStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminOrderStats();
      const result = response?.data;

      if (result?.success === false) {
        throw new Error(
          result.message || "Unable to fetch order statistics."
        );
      }

      setStats(result?.data ?? {});
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch order statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};

export default useAdminOrderStats;

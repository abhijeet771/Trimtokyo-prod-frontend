
import { useState, useCallback } from "react";
import { getAdminUserStats } from "../../services/adminUsers.service";
import { toast } from "sonner";

const useAdminUserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAdminUserStats();
      const data = res.data?.data ?? res.data;

      setStats(data);
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load user statistics.";

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    setStats,
  };
};

export default useAdminUserStats;

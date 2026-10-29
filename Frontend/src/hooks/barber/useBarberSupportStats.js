
import { useCallback, useEffect, useState } from "react";

import {
  getBarberSupportStats,
} from "../../services/barber/barberSupport.service";

const useBarberSupportStats = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBarberSupportStats();

      setStats((previous) => ({
        ...previous,
        ...(response.data ?? {}),
      }));

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch support statistics"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats().catch(() => {});
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};

export default useBarberSupportStats;

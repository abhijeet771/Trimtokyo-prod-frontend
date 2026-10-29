import { useCallback, useEffect, useState } from "react";
import { getBarberOverview } from "../../services/admin/barberOverview.service.js";

const useBarberOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBarberOverview();

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch barber overview"
        );
      }

      setOverview(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch barber overview"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    overview,
    summary: overview?.summary ?? null,
    applicationStatus: overview?.applicationStatus ?? [],
    applicationGrowth: overview?.applicationGrowth ?? [],
    loading,
    error,
    refreshOverview: fetchOverview,
  };
};

export default useBarberOverview;
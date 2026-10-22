
import { useState, useCallback } from "react";
import { getAdminOverview } from "../../services/adminOverview.service";
import { toast } from "sonner";

const useAdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAdminOverview();
      const data = res.data?.data;

      if (!data) {
        throw new Error("Invalid admin overview response.");
      }

      const normalizedOverview = {
        totalBookings: data.kpis?.totalBookings ?? 0,
        todaysBookings: data.kpis?.todaysBookings ?? 0,
        totalOrders: data.kpis?.totalOrders ?? 0,
        todaysOrders: data.kpis?.todaysOrders ?? 0,
        totalBarbers: data.platformDistribution?.barbers?.count ?? 0,
        totalUsers: data.platformDistribution?.users?.count ?? 0,
        platformDistribution: data.platformDistribution ?? {},
      };

      setOverview(normalizedOverview);
      return normalizedOverview;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load admin overview.";

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    overview,
    loading,
    error,
    fetchAdminOverview,
    setOverview,
  };
};

export default useAdminOverview;

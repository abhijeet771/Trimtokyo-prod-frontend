import { useEffect, useState } from "react";
import { getAdminKPIs } from "../services/api"; // ✅ use service layer

const useAdminKPIs = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalBarbers: 0,
    totalOrders: 0,
    todaysOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAdminKPIs();

      if (res?.data?.success) {
        setData({
          totalUsers: res.data.data.totalUsers || 0,
          totalBarbers: res.data.data.totalBarbers || 0,
          totalOrders: res.data.data.totalOrders || 0,
          todaysOrders: res.data.data.todaysOrders || 0,
        });
      } else {
        throw new Error("Invalid KPI response");
      }
    } catch (err) {
      console.error("KPI Fetch Error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch KPIs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchKPIs,
  };
};

export default useAdminKPIs;
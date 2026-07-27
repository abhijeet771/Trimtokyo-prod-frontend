import { useEffect, useState } from "react";
import { getBarberKPIs } from "../services/api";

export default function useBarberKPIs() {
  const [kpis, setKpis] = useState({
    totalOrders: 0,
    completedOrders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchKPIs = async () => {
    try {
      setLoading(true);

      const res = await getBarberKPIs();

      setKpis(res?.data?.data || {
        totalOrders: 0,
        completedOrders: 0,
        revenue: 0,
      });
    } catch (err) {
      console.error("KPI fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  return {
    ...kpis,
    loading,
    refetch: fetchKPIs,
  };
}
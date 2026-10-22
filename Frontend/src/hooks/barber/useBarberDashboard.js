import { useCallback, useEffect, useState } from "react";
import { getBarberDashboard } from "../../services/barberDashboard.service.js";

const INITIAL_DATA = {
  kpis: {
    totalOrders: 0,
    todayOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    todayRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
  },
  charts: {
    orderStatus: [
      { status: "PENDING", count: 0 },
      { status: "CONFIRMED", count: 0 },
      { status: "IN_PROGRESS", count: 0 },
      { status: "COMPLETED", count: 0 },
      { status: "CANCELLED", count: 0 },
    ],
    weeklyBookings: [],
    monthlyRevenue: [],
    revenueTrend: [],
  },
};

export default function useBarberDashboard() {
  const [dashboard, setDashboard] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getBarberDashboard();

      setDashboard({
        kpis: {
          ...INITIAL_DATA.kpis,
          ...(res?.data?.data?.kpis || {}),
        },
        charts: {
          ...INITIAL_DATA.charts,
          ...(res?.data?.data?.charts || {}),
        },
      });
    } catch (err) {
      console.error("Barber dashboard fetch error:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load barber dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    ...dashboard.kpis,
    charts: dashboard.charts,
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

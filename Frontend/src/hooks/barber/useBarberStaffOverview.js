
import { useCallback, useState } from "react";

import {
  getBarberStaffOverview as getBarberStaffOverviewApi,
} from "../../services/barberStaffOverview.service";

export default function useBarberStaffOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  /* ------------------------------------------------------------------------ */
  /*                         FETCH STAFF OVERVIEW                             */
  /* ------------------------------------------------------------------------ */

  const fetchOverview = useCallback(async (month = selectedMonth) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBarberStaffOverviewApi({ month });
      const data = response?.data?.data;

      setOverview(data || null);

      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load staff overview.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  /* ------------------------------------------------------------------------ */
  /*                           CHANGE SELECTED MONTH                           */
  /* ------------------------------------------------------------------------ */

  const changeMonth = useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                               CLEAR ERROR                                */
  /* ------------------------------------------------------------------------ */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    overview,

    summary: overview?.summary || null,
    salaryGrowthChart: overview?.salaryGrowthChart || [],
    staffDistribution: overview?.staffDistribution || [],
    comparison: overview?.comparison || null,

    selectedMonth,
    setSelectedMonth,
    changeMonth,

    loading,
    error,

    fetchOverview,
    refreshOverview: () => fetchOverview(selectedMonth),
    clearError,
  };
}

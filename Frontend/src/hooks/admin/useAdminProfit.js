
import { useCallback, useEffect, useState } from "react";

import adminProfitService from "../../services/admin/adminProfit.service";

const useAdminProfit = (initialFilters = {}) => {
  const [profits, setProfits] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // FETCH ALL PROFIT ENTRIES
  // ==========================================

  const fetchProfits = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminProfitService.getAdminProfits(
        filters
      );

      setProfits(response.data || []);

      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to fetch financial entries";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // FETCH PROFIT ANALYTICS
  // ==========================================

  const fetchAnalytics = useCallback(async (filters = {}) => {
    try {
      setAnalyticsLoading(true);
      setError(null);

      const response =
        await adminProfitService.getAdminProfitAnalytics(filters);

      setAnalytics(response.data || null);

      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to fetch profit analytics";

      setError(message);
      throw err;
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // ==========================================
  // CREATE FINANCIAL ENTRY
  // ==========================================

  const addProfit = async (profitData) => {
    try {
      setError(null);

      const response =
        await adminProfitService.createAdminProfit(profitData);

      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to create financial entry";

      setError(message);
      throw err;
    }
  };

  // ==========================================
  // GET SINGLE ENTRY
  // ==========================================

  const fetchProfitById = async (profitId) => {
    try {
      setError(null);

      const response =
        await adminProfitService.getAdminProfitById(profitId);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to fetch financial entry";

      setError(message);
      throw err;
    }
  };

  // ==========================================
  // UPDATE FINANCIAL ENTRY
  // ==========================================

  const editProfit = async (profitId, profitData) => {
    try {
      setError(null);

      const response =
        await adminProfitService.updateAdminProfit(
          profitId,
          profitData
        );

      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to update financial entry";

      setError(message);
      throw err;
    }
  };

  // ==========================================
  // DELETE FINANCIAL ENTRY
  // ==========================================

  const removeProfit = async (profitId) => {
    try {
      setError(null);

      const response =
        await adminProfitService.deleteAdminProfit(profitId);

      return response;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to delete financial entry";

      setError(message);
      throw err;
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setAnalyticsLoading(true);
        setError(null);

        const [profitsResponse, analyticsResponse] =
          await Promise.all([
            adminProfitService.getAdminProfits(initialFilters),
            adminProfitService.getAdminProfitAnalytics(
              initialFilters
            ),
          ]);

        if (!isMounted) return;

        setProfits(profitsResponse.data || []);
        setAnalytics(analyticsResponse.data || null);
      } catch (err) {
        if (!isMounted) return;

        setError(
          err.response?.data?.message ||
            "Failed to load profit dashboard"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
          setAnalyticsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    profits,
    analytics,

    loading,
    analyticsLoading,
    error,

    fetchProfits,
    fetchAnalytics,

    addProfit,
    fetchProfitById,
    editProfit,
    removeProfit,
  };
};

export default useAdminProfit;

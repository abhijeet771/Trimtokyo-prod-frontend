
import { useCallback, useEffect, useState } from "react";

import {
  getAdminExpenses,
  getAdminExpenseStats,
  createAdminExpense,
  updateAdminExpense,
  deleteAdminExpense,
} from "../../services/admin/adminExpense.service";

const INITIAL_SUMMARY = {
  totalExpenditure: 0,
  totalTransactions: 0,
  highestExpense: null,
  totalRevenue: 0,
  expenseRatio: 0,
};

const INITIAL_FILTERS = {
  startDate: "",
  endDate: "",
  category: "",
  paymentMethod: "",
};

const getResponseData = (response) => {
  return response?.data ?? {};
};

const useAdminExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [dateRange, setDateRange] = useState(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  // FETCH EXPENSES
  const fetchExpenses = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError("");

      const activeFilters = {
        ...filters,
        ...customFilters,
      };

      const response = await getAdminExpenses(activeFilters);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch expenses"
        );
      }

      const data = getResponseData(response);

      setExpenses(data.expenses || []);
      setTotal(data.total || 0);
      setDateRange(data.dateRange || null);

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch expenses";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // FETCH STATISTICS
  const fetchStats = useCallback(async (customFilters = {}) => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const activeFilters = {
        ...filters,
        ...customFilters,
      };

      const response = await getAdminExpenseStats(activeFilters);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch expense statistics"
        );
      }

      const data = getResponseData(response);

      setSummary({
        ...INITIAL_SUMMARY,
        ...(data.summary || {}),
      });

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch expense statistics";

      setStatsError(message);
      throw err;
    } finally {
      setStatsLoading(false);
    }
  }, [filters]);

  // REFRESH BOTH
  const refreshExpenses = useCallback(async (customFilters = {}) => {
    const results = await Promise.allSettled([
      fetchExpenses(customFilters),
      fetchStats(customFilters),
    ]);

    return results;
  }, [fetchExpenses, fetchStats]);

  // CREATE
  const handleCreateExpense = async (expenseData) => {
    try {
      setMutationLoading(true);
      setError("");

      const response = await createAdminExpense(expenseData);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to create expense"
        );
      }

      await refreshExpenses();

      return getResponseData(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to create expense"
      );

      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  // UPDATE
  const handleUpdateExpense = async (expenseId, expenseData) => {
    try {
      setMutationLoading(true);
      setError("");

      const response = await updateAdminExpense(
        expenseId,
        expenseData
      );

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to update expense"
        );
      }

      await refreshExpenses();

      return getResponseData(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update expense"
      );

      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  // DELETE
  const handleDeleteExpense = async (expenseId) => {
    try {
      setMutationLoading(true);
      setError("");

      const response = await deleteAdminExpense(expenseId);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to delete expense"
        );
      }

      await refreshExpenses();

      return getResponseData(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete expense"
      );

      throw err;
    } finally {
      setMutationLoading(false);
    }
  };

  // UPDATE FILTERS
  const updateFilters = (newFilters) => {
    setFilters((previous) => ({
      ...previous,
      ...newFilters,
    }));
  };

  // RESET FILTERS
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // INITIAL FETCH AND FILTER REFRESH
  useEffect(() => {
    refreshExpenses().catch(() => {});
  }, [refreshExpenses]);

  return {
    expenses,
    summary,
    dateRange,
    total,

    filters,
    setFilters: updateFilters,
    resetFilters,

    loading,
    statsLoading,
    mutationLoading,

    error,
    statsError,

    fetchExpenses,
    fetchStats,
    refreshExpenses,

    handleCreateExpense,
    handleUpdateExpense,
    handleDeleteExpense,
  };
};

export default useAdminExpense;

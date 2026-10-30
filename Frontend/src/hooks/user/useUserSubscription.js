
import { useCallback, useEffect, useState } from "react";

import {
  getActiveSubscriptions,
  initiateSubscriptionPurchase,
  submitSubscriptionPayment,
  getCurrentUserSubscription,
  getUserSubscriptionHistory,
} from "../../services/shared/subscription.service";

export default function useUserSubscription() {
  /* ============================================================
     STATES
  ============================================================ */

  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  /* ============================================================
     ERROR HANDLER
  ============================================================ */

  const getErrorMessage = (err, fallback) =>
    err.response?.data?.message || fallback;

  /* ============================================================
     1. FETCH ACTIVE SUBSCRIPTION PLANS
  ============================================================ */

  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    setError("");

    try {
      const response = await getActiveSubscriptions();

      const data = response.data.data || [];

      setPlans(data);

      return data;
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to fetch subscription plans.")
      );
      throw err;
    } finally {
      setPlansLoading(false);
    }
  }, []);

  /* ============================================================
     2. INITIATE SUBSCRIPTION PURCHASE
  ============================================================ */

  const initiatePurchase = async (subscriptionId) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await initiateSubscriptionPurchase(
        subscriptionId
      );

      return response.data.data;
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to initiate subscription purchase.")
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     3. SUBMIT UPI PAYMENT CONFIRMATION
  ============================================================ */

  const confirmPayment = async (purchaseId) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await submitSubscriptionPayment(purchaseId);

      // Refresh purchase history after confirmation.
      await fetchHistory(1, pagination.limit);

      return response.data.data;
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to submit payment confirmation.")
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     4. FETCH CURRENT USER SUBSCRIPTION
  ============================================================ */

  const fetchCurrentSubscription = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCurrentUserSubscription();

      const data = response.data.data || {};

      setCurrentSubscription(data.subscription || null);
      setSubscriptionStatus(data.subscriptionStatus || "none");

      return data;
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to fetch current subscription.")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ============================================================
     5. FETCH SUBSCRIPTION HISTORY
  ============================================================ */

  const fetchHistory = useCallback(
    async (page = 1, limit = 10) => {
      setHistoryLoading(true);
      setError("");

      try {
        const response = await getUserSubscriptionHistory({
          page,
          limit,
        });

        const data = response.data.data || {};

        setHistory(data.subscriptions || []);
        setPagination(
          data.pagination || {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNextPage: false,
          }
        );

        return data;
      } catch (err) {
        setError(
          getErrorMessage(err, "Failed to fetch subscription history.")
        );
        throw err;
      } finally {
        setHistoryLoading(false);
      }
    },
    []
  );

  /* ============================================================
     6. REFRESH ALL USER SUBSCRIPTION DATA
  ============================================================ */

  const refreshSubscription = useCallback(async () => {
    await Promise.all([
      fetchCurrentSubscription(),
      fetchHistory(1, pagination.limit),
    ]);
  }, [fetchCurrentSubscription, fetchHistory, pagination.limit]);

  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {
    fetchPlans().catch(() => {});
    fetchCurrentSubscription().catch(() => {});
    fetchHistory(1, 10).catch(() => {});
  }, [fetchPlans, fetchCurrentSubscription, fetchHistory]);

  /* ============================================================
     RETURN
  ============================================================ */

  return {
    // Plans
    plans,
    plansLoading,
    fetchPlans,

    // Purchase
    initiatePurchase,
    confirmPayment,

    // Current subscription
    currentSubscription,
    subscriptionStatus,
    loading,
    fetchCurrentSubscription,

    // History
    history,
    pagination,
    historyLoading,
    fetchHistory,

    // General
    submitting,
    error,
    refreshSubscription,
  };
}

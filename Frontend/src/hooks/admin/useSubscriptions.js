
import { useCallback, useEffect, useState } from "react";

import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getPendingSubscriptionPayments,
  approveSubscriptionPayment,
  rejectSubscriptionPayment,
} from "../../services/shared/subscription.service";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  /* ============================================================
     FETCH ALL SUBSCRIPTION PLANS
  ============================================================ */

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllSubscriptions();
      setSubscriptions(response.data.data || []);

      return response.data.data || [];
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch subscriptions."
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ============================================================
     CREATE SUBSCRIPTION
  ============================================================ */

  const create = async (data) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await createSubscription(data);

      await fetchSubscriptions();

      return response.data.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create subscription."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     UPDATE SUBSCRIPTION
  ============================================================ */

  const update = async (id, data) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await updateSubscription(id, data);

      await fetchSubscriptions();

      return response.data.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update subscription."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     DELETE SUBSCRIPTION
  ============================================================ */

  const remove = async (id) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await deleteSubscription(id);

      await fetchSubscriptions();

      return response.data.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete subscription."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     FETCH PENDING PAYMENT REQUESTS
  ============================================================ */

  const fetchPendingPayments = useCallback(async (params = {}) => {
    setPaymentsLoading(true);
    setPaymentError("");

    try {
      const response = await getPendingSubscriptionPayments(params);

      const result = response.data.data || {};

      setPendingPayments(result.requests || []);

      return result;
    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
          "Failed to fetch pending payment requests."
      );
      throw err;
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  /* ============================================================
     APPROVE SUBSCRIPTION PAYMENT
  ============================================================ */

  const approvePayment = async (purchaseId) => {
    setSubmitting(true);
    setPaymentError("");

    try {
      const response = await approveSubscriptionPayment(purchaseId);

      await fetchPendingPayments();

      return response.data.data;
    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
          "Failed to approve subscription payment."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     REJECT SUBSCRIPTION PAYMENT
  ============================================================ */

  const rejectPayment = async (purchaseId, rejectionReason) => {
    setSubmitting(true);
    setPaymentError("");

    try {
      const response = await rejectSubscriptionPayment(
        purchaseId,
        rejectionReason
      );

      await fetchPendingPayments();

      return response.data.data;
    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
          "Failed to reject subscription payment."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {
    fetchSubscriptions().catch(() => {});
  }, [fetchSubscriptions]);

  return {
    // Subscription plans
    subscriptions,
    loading,
    submitting,
    error,
    fetchSubscriptions,
    create,
    update,
    remove,

    // Manual payment approval
    pendingPayments,
    paymentsLoading,
    paymentError,
    fetchPendingPayments,
    approvePayment,
    rejectPayment,
  };
}

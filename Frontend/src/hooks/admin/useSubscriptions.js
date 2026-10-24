
import { useCallback, useEffect, useState } from "react";

import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../../services/subscription.service";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllSubscriptions();
      setSubscriptions(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch subscriptions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

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

  const remove = async (id) => {
    setError("");

    try {
      await deleteSubscription(id);
      await fetchSubscriptions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete subscription."
      );
      throw err;
    }
  };

  return {
    subscriptions,
    loading,
    submitting,
    error,
    fetchSubscriptions,
    create,
    update,
    remove,
  };
}

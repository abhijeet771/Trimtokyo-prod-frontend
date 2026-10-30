
import { useCallback, useEffect, useState } from "react";

import {
  getActiveSubscriptions,
} from "../../services/shared/subscription.service";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getActiveSubscriptions();
      setSubscriptions(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load subscription plans."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
  };
}

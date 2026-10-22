import { useState, useCallback } from "react";
import { createOrder } from "../../api/order.api";

export default function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createOrder(orderData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to place order";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submitOrder,
    loading,
    error,
  };
}

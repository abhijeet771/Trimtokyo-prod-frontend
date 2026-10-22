import { useState, useCallback } from "react";
import { updateOrderStatus } from "../../services/order.service.js";

export default function useCancelOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateOrderStatus(
        orderId,
        "CANCELLED"
      );

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to cancel order";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cancelOrder,
    loading,
    error,
  };
}

import { useCallback, useState } from "react";
import { updateBarberOrderStatus } from "../../services/order.service";

const useBarberOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = useCallback(async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateBarberOrderStatus(
        orderId,
        status
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to update order status"
        );
      }

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateStatus,
    loading,
    error,
  };
};

export default useBarberOrderStatus;

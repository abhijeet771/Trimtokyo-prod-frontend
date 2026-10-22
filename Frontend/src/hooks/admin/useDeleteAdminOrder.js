import { useState } from "react";
import { deleteAdminOrder } from "../../services/adminOrders.service";

const useDeleteAdminOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeOrder = async (id) => {
    if (!id) {
      const message = "Order ID is required.";
      setError(message);
      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await deleteAdminOrder(id);

      if (response?.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to delete order."
        );
      }

      return {
        success: true,
        id,
        data: response.data,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to delete order.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    removeOrder,
    loading,
    error,
  };
};

export default useDeleteAdminOrder;

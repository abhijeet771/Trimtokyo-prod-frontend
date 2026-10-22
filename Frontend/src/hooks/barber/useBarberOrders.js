
import { useCallback, useEffect, useState } from "react";

import {
  getBarberOrders,
  updateOrderStatus,
} from "../../services/order.service.js";

const useBarberOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getBarberOrders();
      setOrders(res?.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to fetch orders."
      );
      console.error("Barber orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeOrderStatus = useCallback(
    async (orderId, status) => {
      try {
        setUpdating(true);
        setError(null);

        await updateOrderStatus(orderId, status);
        await fetchOrders();

        return true;
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to update order status."
        );
        console.error("Order status update error:", err);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [fetchOrders]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    updating,
    refresh: fetchOrders,
    changeOrderStatus,
  };
};

export default useBarberOrders;

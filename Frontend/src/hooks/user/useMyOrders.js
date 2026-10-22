import { useState, useCallback } from "react";
import { getMyOrders } from "../../api/order.api";

export default function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (type = "all") => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyOrders(type);
      const result = response.data?.data;

      const orderList = Array.isArray(result) ? result : [];
      setOrders(orderList);

      return orderList;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch orders";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    setOrders,
    fetchOrders,
    loading,
    error,
  };
}

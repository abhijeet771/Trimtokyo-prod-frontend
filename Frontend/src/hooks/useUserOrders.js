import { useEffect, useState } from "react";
import { getMyOrders } from "../services/api";

const useUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
  };
};

export default useUserOrders;
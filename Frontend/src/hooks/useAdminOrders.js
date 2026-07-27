// hooks/useAdminOrders.js

import { useEffect, useState } from "react";
import { getAdminOrders } from "../services/api";

const useAdminOrders = (page = 1, limit = 10) => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdminOrders(page, limit);

        setOrders(response.data.data);
        setTotalPages(response.data.pages);
        setTotalOrders(response.data.total);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  return {
    orders,
    totalPages,
    totalOrders,
    loading,
    error,
  };
};

export default useAdminOrders;
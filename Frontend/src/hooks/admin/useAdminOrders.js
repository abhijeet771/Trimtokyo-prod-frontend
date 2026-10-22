
import { useCallback, useEffect, useState } from "react";
import { getAdminOrders } from "../../services/adminOrders.service";

const useAdminOrders = (page = 1, limit = 5) => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(
    async (requestedPage = page) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAdminOrders(requestedPage, limit);
        const result = response?.data;

        if (result?.success === false) {
          throw new Error(
            result.message || "Unable to fetch orders."
          );
        }

        // Backend returns { success, orders, pagination }.
        const fetchedOrders = Array.isArray(result?.orders)
          ? result.orders
          : [];

        const pagination = result?.pagination ?? {};

        setOrders(fetchedOrders);
        setTotalOrders(Number(pagination.total) || 0);
        setTotalPages(Number(pagination.totalPages) || 0);
        setCurrentPage(Number(pagination.page) || requestedPage);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to fetch orders."
        );

        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  useEffect(() => {
    fetchOrders(page);
  }, [fetchOrders, page]);

  const refresh = useCallback(() => {
    return fetchOrders(page);
  }, [fetchOrders, page]);

  return {
    orders,
    loading,
    error,
    totalOrders,
    totalPages,
    currentPage,
    refresh,
  };
};

export default useAdminOrders;

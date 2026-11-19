
import { useCallback, useEffect, useState } from "react";
import {
  getAdminOrders,
  createManualOrder,
} from "../../services/admin/adminOrders.service";

const useAdminOrders = (page = 1, limit = 5) => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // ================= FETCH ORDERS =================

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

  // ================= INITIAL FETCH =================

  useEffect(() => {
    fetchOrders(page);
  }, [fetchOrders, page]);

  // ================= REFRESH ORDERS =================

  const refresh = useCallback(() => {
    return fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  // ================= CREATE MANUAL ORDER =================

  const addManualOrder = useCallback(
    async (orderData) => {
      setCreating(true);
      setError(null);

      try {
        const response = await createManualOrder(orderData);
        const result = response?.data;

        if (!result?.success) {
          throw new Error(
            result?.message || "Unable to create manual order."
          );
        }

        // Refresh current order listing after successful creation.
        await fetchOrders(currentPage);

        return {
          success: true,
          data: result.data,
          message: result.message || "Manual order created successfully.",
        };
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to create manual order.";

        setError(message);

        return {
          success: false,
          message,
        };
      } finally {
        setCreating(false);
      }
    },
    [fetchOrders, currentPage]
  );

  return {
    orders,
    loading,
    creating,
    error,
    totalOrders,
    totalPages,
    currentPage,
    fetchOrders,
    refresh,
    addManualOrder,
  };
};

export default useAdminOrders;

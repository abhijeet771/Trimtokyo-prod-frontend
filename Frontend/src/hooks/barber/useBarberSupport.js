
import { useCallback, useEffect, useState } from "react";

import {
  getBarberSupportTickets,
  createBarberSupportTicket,
  updateBarberSupportTicket,
  deleteBarberSupportTicket,
} from "../../services/barber/barberSupport.service";

const useBarberSupport = (initialParams = {}) => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [params, setParams] = useState({
    page: initialParams.page ?? 1,
    limit: initialParams.limit ?? 10,
    search: initialParams.search ?? "",
    status: initialParams.status ?? "ALL",
    priority: initialParams.priority ?? "ALL",
  });

  // Fetch tickets
  const fetchTickets = useCallback(
    async (overrides = {}) => {
      try {
        setLoading(true);
        setError("");

        const query = {
          ...params,
          ...overrides,
        };

        const response = await getBarberSupportTickets(query);

        setTickets(response.data ?? []);
        setPagination(
          response.pagination ?? {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          }
        );

        return response;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to fetch support tickets";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  // Automatically refetch when query parameters change
  useEffect(() => {
    fetchTickets().catch(() => {});
  }, [fetchTickets]);

  // Update search, filters, or pagination
  const updateParams = useCallback((updates) => {
    setParams((previous) => {
      const next = {
        ...previous,
        ...updates,
      };

      if (
        updates.search !== undefined ||
        updates.status !== undefined ||
        updates.priority !== undefined ||
        updates.limit !== undefined
      ) {
        next.page = 1;
      }

      return next;
    });
  }, []);

  // Create ticket
  const createTicket = useCallback(async (data) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await createBarberSupportTicket(data);

      setParams((previous) => ({
        ...previous,
        page: 1,
      }));

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create support ticket"
      );
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // Update ticket
  const updateTicket = useCallback(
    async (ticketId, data) => {
      try {
        setActionLoading(true);
        setError("");

        const response = await updateBarberSupportTicket(
          ticketId,
          data
        );

        await fetchTickets();

        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to update support ticket"
        );
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTickets]
  );

  // Delete ticket
  const deleteTicket = useCallback(
    async (ticketId) => {
      try {
        setActionLoading(true);
        setError("");

        const response =
          await deleteBarberSupportTicket(ticketId);

        await fetchTickets();

        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to delete support ticket"
        );
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTickets]
  );

  return {
    tickets,
    pagination,
    params,
    loading,
    actionLoading,
    error,
    updateParams,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};

export default useBarberSupport;

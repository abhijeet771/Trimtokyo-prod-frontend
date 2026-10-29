
import { useCallback, useEffect, useState } from "react";

import {
  getAdminBarberSupportTickets,
  getAdminBarberSupportStats,
  getAdminBarberSupportTicketById,
  updateAdminBarberSupportTicket,
  deleteAdminBarberSupportTicket,
} from "../../services/admin/barberSupport.service.js";

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const useAdminBarberSupport = (initialParams = {}) => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });

  const [params, setParams] = useState({
    page: initialParams.page ?? 1,
    limit: initialParams.limit ?? 10,
    search: initialParams.search ?? "",
    status: initialParams.status ?? "ALL",
    priority: initialParams.priority ?? "ALL",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(
    async (overrides = {}) => {
      try {
        setLoading(true);
        setError("");

        const query = { ...params, ...overrides };
        const response = await getAdminBarberSupportTickets(query);

        setTickets(response.data ?? []);
        setPagination(response.pagination ?? DEFAULT_PAGINATION);

        return response;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to fetch barber support tickets.";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  const fetchStats = useCallback(async () => {
    try {
      const response = await getAdminBarberSupportStats();
      setStats(response.data ?? {});
      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch barber support statistics."
      );
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTickets().catch(() => {});
  }, [fetchTickets]);

  useEffect(() => {
    fetchStats().catch(() => {});
  }, [fetchStats]);

  const updateParams = useCallback((updates) => {
    setParams((previous) => {
      const next = { ...previous, ...updates };

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

  const fetchTicketById = useCallback(async (ticketId) => {
    try {
      setError("");
      const response =
        await getAdminBarberSupportTicketById(ticketId);

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch ticket details."
      );
      throw err;
    }
  }, []);

  const updateTicket = useCallback(
    async (ticketId, data) => {
      try {
        setActionLoading(true);
        setError("");

        const response = await updateAdminBarberSupportTicket(
          ticketId,
          data
        );

        await Promise.all([fetchTickets(), fetchStats()]);

        return response.data;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to update barber support ticket."
        );
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTickets, fetchStats]
  );

  const deleteTicket = useCallback(
    async (ticketId) => {
      try {
        setActionLoading(true);
        setError("");

        const response =
          await deleteAdminBarberSupportTicket(ticketId);

        const isLastTicketOnPage =
          tickets.length === 1 && params.page > 1;

        if (isLastTicketOnPage) {
          setParams((previous) => ({
            ...previous,
            page: previous.page - 1,
          }));
        } else {
          await fetchTickets();
        }

        await fetchStats();

        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to delete barber support ticket."
        );
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [tickets.length, params.page, fetchTickets, fetchStats]
  );

  return {
    tickets,
    pagination,
    stats,
    params,
    loading,
    actionLoading,
    error,
    setError,
    updateParams,
    fetchTickets,
    fetchStats,
    fetchTicketById,
    updateTicket,
    deleteTicket,
  };
};

export default useAdminBarberSupport;

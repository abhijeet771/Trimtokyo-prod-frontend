import { useCallback, useState } from "react";

import {
  createUserSupportTicket,
  getMyUserSupportTickets,
  getMyUserSupportTicketById,
} from "../../services/user/userSupport.service.js";

const PAGE_SIZE = 5;

const useUserSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMyTickets = useCallback(async (params = {}) => {
    setLoading(true);
    setError("");

    try {
      const page = params.page || 1;
      const limit = params.limit || PAGE_SIZE;

      const response = await getMyUserSupportTickets({
        ...params,
        page,
        limit,
      });

      const data = response?.data;
      const nextTickets = Array.isArray(data)
        ? data
        : data?.tickets || response?.tickets || [];

      const meta = response?.pagination || data?.pagination || {};

      setTickets(nextTickets);
      setPagination({
        page: Number(meta.page) || page,
        limit: Number(meta.limit) || limit,
        total: Number(meta.total ?? meta.totalTickets) || 0,
        totalPages:
          Number(meta.totalPages) ||
          Math.ceil(
            Number(meta.total ?? meta.totalTickets ?? 0) / limit
          ),
      });

      return { success: true, data: nextTickets };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch your support tickets.";

      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const submitTicket = useCallback(async (payload) => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await createUserSupportTicket(payload);

      setSuccess(
        response?.message || "Your support ticket was submitted successfully."
      );

      await fetchMyTickets({ page: 1, limit: PAGE_SIZE });

      return { success: true, data: response?.data ?? response };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit your support ticket.";

      setError(message);
      return { success: false, message };
    } finally {
      setSubmitting(false);
    }
  }, [fetchMyTickets]);

  const fetchTicketById = useCallback(async (ticketId) => {
    setDetailsLoading(true);
    setError("");

    try {
      const response = await getMyUserSupportTicketById(ticketId);
      const ticket = response?.data?.ticket || response?.data;

      setSelectedTicket(ticket);

      return { success: true, data: ticket };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch support ticket details.";

      setError(message);
      return { success: false, message };
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const clearSelectedTicket = useCallback(() => {
    setSelectedTicket(null);
  }, []);

  const resetMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    tickets,
    selectedTicket,
    pagination,
    loading,
    detailsLoading,
    submitting,
    error,
    success,
    fetchMyTickets,
    submitTicket,
    fetchTicketById,
    clearSelectedTicket,
    resetMessages,
  };
};

export default useUserSupport;
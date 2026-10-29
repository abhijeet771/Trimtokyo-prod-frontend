import { useCallback, useState } from "react";

import apik from "../../services/apik.js";

const USER_SUPPORT_URL = "/api/user-support";
const PAGE_SIZE = 5;

const useAdminUserSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [summary, setSummary] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTickets = useCallback(async (params = {}) => {
    setLoading(true);
    setError("");

    try {
      const page = params.page || 1;
      const limit = params.limit || PAGE_SIZE;

      const response = await apik.get(USER_SUPPORT_URL, {
        params: {
          ...params,
          page,
          limit,
        },
      });

      const data = response.data?.data;
      const nextTickets = Array.isArray(data)
        ? data
        : data?.tickets || response.data?.tickets || [];

      const meta = response.data?.pagination || data?.pagination || {};

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
        "Failed to fetch user support tickets.";

      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await apik.get(`${USER_SUPPORT_URL}/summary`);
      const data = response.data?.data;

      setSummary(data || null);

      return { success: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch support summary.";

      setError(message);
      return { success: false, message };
    }
  }, []);

  const fetchTicketById = useCallback(async (ticketId) => {
    setDetailsLoading(true);
    setError("");

    try {
      const response = await apik.get(
        `${USER_SUPPORT_URL}/${ticketId}`
      );

      const ticket =
        response.data?.data?.ticket ||
        response.data?.data;

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

  const updateTicket = useCallback(async (ticketId, payload) => {
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apik.patch(
        `${USER_SUPPORT_URL}/${ticketId}`,
        payload
      );

      const updatedTicket =
        response.data?.data?.ticket ||
        response.data?.data;

      if (updatedTicket?._id) {
        setTickets((previous) =>
          previous.map((ticket) =>
            ticket._id === ticketId
              ? { ...ticket, ...updatedTicket }
              : ticket
          )
        );

        setSelectedTicket((previous) =>
          previous?._id === ticketId
            ? { ...previous, ...updatedTicket }
            : previous
        );
      }

      setSuccess(
        response.data?.message || "Support ticket updated successfully."
      );

      return { success: true, data: updatedTicket };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update support ticket.";

      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeTicket = useCallback(async (ticketId) => {
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apik.delete(
        `${USER_SUPPORT_URL}/${ticketId}`
      );

      setTickets((previous) =>
        previous.filter((ticket) => ticket._id !== ticketId)
      );

      setSelectedTicket((previous) =>
        previous?._id === ticketId ? null : previous
      );

      setSuccess(
        response.data?.message || "Support ticket deleted successfully."
      );

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete support ticket.";

      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
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
    summary,
    pagination,
    loading,
    detailsLoading,
    actionLoading,
    error,
    success,
    fetchTickets,
    fetchSummary,
    fetchTicketById,
    updateTicket,
    removeTicket,
    clearSelectedTicket,
    resetMessages,
  };
};

export default useAdminUserSupport;
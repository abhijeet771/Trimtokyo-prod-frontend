
import { useState, useCallback } from "react";

import {
  getAllGuestSupportTickets,
  getGuestSupportTicketById,
  updateGuestSupportTicket,
  deleteGuestSupportTicket,
  getGuestSupportSummary,
} from "../../services/shared/guestSupport.services.js";

const useAdminGuestSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async (params = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllGuestSupportTickets(params);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to fetch guest support tickets."
        );
      }

      const ticketData = response?.data;
      const nextTickets = Array.isArray(ticketData)
        ? ticketData
        : ticketData?.tickets || [];

      setTickets(nextTickets);

      if (response?.pagination) {
        setPagination((previous) => ({
          ...previous,
          ...response.pagination,
        }));
      }

      return nextTickets;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch guest support tickets.";

      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await getGuestSupportSummary();

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to fetch support summary."
        );
      }

      const data = response?.data || {};

      setSummary({
        total: data.total ?? 0,
        pending: data.pending ?? 0,
        inProgress: data.inProgress ?? 0,
        resolved: data.resolved ?? 0,
        closed: data.closed ?? 0,
      });

      return data;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch support summary."
      );

      return null;
    }
  }, []);

  const fetchTicketById = useCallback(async (ticketId) => {
    setDetailsLoading(true);
    setError("");

    try {
      const response = await getGuestSupportTicketById(ticketId);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to fetch support ticket."
        );
      }

      const ticket = response?.data;
      setSelectedTicket(ticket || null);

      return ticket;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch support ticket."
      );

      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const updateTicket = useCallback(async (ticketId, payload) => {
    setActionLoading(true);
    setError("");

    try {
      const response = await updateGuestSupportTicket(ticketId, payload);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to update support ticket."
        );
      }

      const updatedTicket = response?.data;

      if (updatedTicket) {
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

      return {
        success: true,
        data: updatedTicket,
        message: response?.message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update support ticket.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeTicket = useCallback(async (ticketId) => {
    setActionLoading(true);
    setError("");

    try {
      const response = await deleteGuestSupportTicket(ticketId);

      if (response?.success === false) {
        throw new Error(
          response?.message || "Failed to delete support ticket."
        );
      }

      setTickets((previous) =>
        previous.filter((ticket) => ticket._id !== ticketId)
      );

      setSelectedTicket((previous) =>
        previous?._id === ticketId ? null : previous
      );

      return {
        success: true,
        message: response?.message,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete support ticket.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const clearSelectedTicket = useCallback(() => {
    setSelectedTicket(null);
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
    fetchTickets,
    fetchSummary,
    fetchTicketById,
    updateTicket,
    removeTicket,
    clearSelectedTicket,
  };
};

export default useAdminGuestSupport;

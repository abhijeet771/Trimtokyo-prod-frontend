
import { useCallback, useEffect, useState } from "react";
import {  getAllEventRequests,  updateEventRequestStatus,  deleteEventRequest,} from "../../services/shared/eventRequest.service.js";

const useAdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEventRequests = useCallback(async (status = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllEventRequests(status);
      const requests = response.data;

      setEventRequests(
        Array.isArray(requests)
          ? requests
          : Array.isArray(requests?.eventRequests)
            ? requests.eventRequests
            : []
      );

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch event requests"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatus = useCallback(async (id, status) => {
    setActionLoading(true);
    setError("");

    try {
      const response = await updateEventRequestStatus(id, status);
      const updatedRequest = response.data;

      if (updatedRequest?._id) {
        setEventRequests((previous) =>
          previous.map((request) =>
            request._id === updatedRequest._id
              ? updatedRequest
              : request
          )
        );
      } else {
        await fetchEventRequests();
      }

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update event request"
      );
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchEventRequests]);

  const approveEventRequest = useCallback(
    (id) => changeStatus(id, "APPROVED"),
    [changeStatus]
  );

  const rejectEventRequest = useCallback(
    (id) => changeStatus(id, "REJECTED"),
    [changeStatus]
  );

  const removeEventRequest = useCallback(async (id) => {
    setActionLoading(true);
    setError("");

    try {
      const response = await deleteEventRequest(id);

      setEventRequests((previous) =>
        previous.filter((request) => request._id !== id)
      );

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete event request"
      );
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventRequests().catch(() => {});
  }, [fetchEventRequests]);

  return {
    eventRequests,
    loading,
    actionLoading,
    error,
    fetchEventRequests,
    approveEventRequest,
    rejectEventRequest,
    removeEventRequest,
  };
};

export default useAdminEventRequests;

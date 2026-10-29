
import { useCallback, useEffect, useState } from "react";
import {
  getAllBarberRequests,
  approveBarberRequest,
  rejectBarberRequest,
  deleteBarberRequest,
} from "../../services/shared/barberRequest.service.js";

const useAdminBarberRequests = () => {
  const [barberRequests, setBarberRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBarberRequests = useCallback(async (status = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllBarberRequests(status);
      const requests = response.data;

      setBarberRequests(
        Array.isArray(requests)
          ? requests
          : Array.isArray(requests?.barberRequests)
            ? requests.barberRequests
            : []
      );

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch barber requests"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatus = useCallback(
    async (id, action) => {
      setActionLoading(true);
      setError("");

      try {
        const response =
          action === "APPROVED"
            ? await approveBarberRequest(id)
            : await rejectBarberRequest(id);

        const updatedRequest = response.data;

        if (updatedRequest?._id) {
          setBarberRequests((previous) =>
            previous.map((request) =>
              request._id === updatedRequest._id
                ? updatedRequest
                : request
            )
          );
        } else {
          await fetchBarberRequests();
        }

        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to update barber request"
        );
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchBarberRequests]
  );

  const approveRequest = useCallback(
    (id) => changeStatus(id, "APPROVED"),
    [changeStatus]
  );

  const rejectRequest = useCallback(
    (id) => changeStatus(id, "REJECTED"),
    [changeStatus]
  );

  const removeRequest = useCallback(async (id) => {
    setActionLoading(true);
    setError("");

    try {
      const response = await deleteBarberRequest(id);

      setBarberRequests((previous) =>
        previous.filter((request) => request._id !== id)
      );

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete barber request"
      );
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarberRequests().catch(() => {});
  }, [fetchBarberRequests]);

  return {
    barberRequests,
    loading,
    actionLoading,
    error,
    fetchBarberRequests,
    approveRequest,
    rejectRequest,
    removeRequest,
  };
};

export default useAdminBarberRequests;

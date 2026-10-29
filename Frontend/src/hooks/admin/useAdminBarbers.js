import { useCallback, useEffect, useRef, useState } from "react";

import {
  getAllBarbers,
  updateBarberStatus,
} from "../../services/admin/barberManagement.service.js";

const DEFAULT_PARAMS = {};

const useAdminBarbers = (initialParams = DEFAULT_PARAMS) => {
  const [barbers, setBarbers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Keep the latest params without making fetchBarbers change identity
  // whenever the caller passes a new object.
  const paramsRef = useRef(initialParams);

  useEffect(() => {
    paramsRef.current = initialParams;
  }, [initialParams]);

  const fetchBarbers = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);

      const requestParams = params ?? paramsRef.current ?? DEFAULT_PARAMS;
      const response = await getAllBarbers(requestParams);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch barbers"
        );
      }

      // Supports both response formats:
      // { success, data: [...], total, totalPages, currentPage }
      // { success, data: { barbers: [...], total, ... } }
      const payload = response.data;

      const barberList = Array.isArray(response.barbers)
        ? response.barbers
        : Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.barbers)
            ? payload.barbers
            : [];

      setBarbers(barberList);
      setTotal(
        response.total ??
          payload?.total ??
          barberList.length
      );
      setTotalPages(
        response.totalPages ??
          payload?.totalPages ??
          1
      );
      setCurrentPage(
        response.currentPage ??
          payload?.currentPage ??
          1
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch barbers";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount. fetchBarbers has a stable identity.
  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const changeBarberStatus = useCallback(
    async (barberId, status) => {
      try {
        setActionLoading(true);
        setError(null);

        const response = await updateBarberStatus(
          barberId,
          status
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to update barber status"
          );
        }

        await fetchBarbers();

        return response;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to update barber status";

        setError(message);
        throw new Error(message);
      } finally {
        setActionLoading(false);
      }
    },
    [fetchBarbers]
  );

  const refreshBarbers = useCallback(
    (params) => fetchBarbers(params),
    [fetchBarbers]
  );

  return {
    barbers,
    total,
    totalPages,
    currentPage,
    loading,
    error,
    actionLoading,
    refreshBarbers,
    changeBarberStatus,
  };
};

export default useAdminBarbers;
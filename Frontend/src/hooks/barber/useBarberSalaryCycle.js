
import { useCallback, useState } from "react";

import {
  createBarberSalaryCycle as createSalaryCycleApi,
  getBarberSalaryCycles as getSalaryCyclesApi,
  getBarberSalaryCycleById as getSalaryCycleByIdApi,
  updateBarberSalaryCycle as updateSalaryCycleApi,
  deleteBarberSalaryCycle as deleteSalaryCycleApi,
} from "../../services/barberSalaryCycle.service";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export default function useBarberSalaryCycle() {
  const [salaryCycles, setSalaryCycles] = useState([]);
  const [selectedSalaryCycle, setSelectedSalaryCycle] = useState(null);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  /* ------------------------------------------------------------------------ */
  /*                         FETCH SALARY CYCLES                             */
  /* ------------------------------------------------------------------------ */

  const fetchSalaryCycles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getSalaryCyclesApi(params);
      const data = response?.data?.data;

      setSalaryCycles(Array.isArray(data) ? data : []);

      if (response?.data?.pagination) {
        setPagination((previous) => ({
          ...previous,
          ...response.data.pagination,
        }));
      }

      return response.data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                        FETCH SALARY CYCLE BY ID                         */
  /* ------------------------------------------------------------------------ */

  const fetchSalaryCycleById = useCallback(async (salaryCycleId) => {
    setLoadingDetails(true);
    setError(null);

    try {
      const response = await getSalaryCycleByIdApi(salaryCycleId);
      const salaryCycle = response?.data?.data ?? null;

      setSelectedSalaryCycle(salaryCycle);

      return salaryCycle;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         CREATE SALARY CYCLE                             */
  /* ------------------------------------------------------------------------ */

  const createSalaryCycle = useCallback(async (data) => {
    setCreating(true);
    setError(null);

    try {
      const response = await createSalaryCycleApi(data);
      const createdCycle = response?.data?.data;

      if (createdCycle) {
        setSalaryCycles((previous) => {
          const alreadyExists = previous.some(
            (cycle) => cycle._id === createdCycle._id
          );

          return alreadyExists
            ? previous
            : [createdCycle, ...previous];
        });

        setPagination((previous) => ({
          ...previous,
          total: previous.total + 1,
        }));

        setSelectedSalaryCycle(createdCycle);
      }

      return createdCycle;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                         UPDATE SALARY CYCLE                             */
  /* ------------------------------------------------------------------------ */

  const updateSalaryCycle = useCallback(
    async (salaryCycleId, data) => {
      setUpdating(true);
      setError(null);

      try {
        const response = await updateSalaryCycleApi(
          salaryCycleId,
          data
        );

        const updatedCycle = response?.data?.data;

        if (updatedCycle) {
          setSalaryCycles((previous) =>
            previous.map((cycle) =>
              cycle._id === salaryCycleId ? updatedCycle : cycle
            )
          );

          setSelectedSalaryCycle((previous) =>
            previous?._id === salaryCycleId
              ? updatedCycle
              : previous
          );
        }

        return updatedCycle;
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /*                         DELETE SALARY CYCLE                             */
  /* ------------------------------------------------------------------------ */

  const removeSalaryCycle = useCallback(async (salaryCycleId) => {
    setDeletingId(salaryCycleId);
    setError(null);

    try {
      const response = await deleteSalaryCycleApi(salaryCycleId);

      setSalaryCycles((previous) =>
        previous.filter((cycle) => cycle._id !== salaryCycleId)
      );

      setSelectedSalaryCycle((previous) =>
        previous?._id === salaryCycleId ? null : previous
      );

      setPagination((previous) => ({
        ...previous,
        total: Math.max(0, previous.total - 1),
      }));

      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setDeletingId(null);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                              UTILITIES                                   */
  /* ------------------------------------------------------------------------ */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelectedSalaryCycle = useCallback(() => {
    setSelectedSalaryCycle(null);
  }, []);

  return {
    salaryCycles,
    selectedSalaryCycle,
    pagination,

    loading,
    loadingDetails,
    creating,
    updating,
    deletingId,
    error,

    fetchSalaryCycles,
    fetchSalaryCycleById,
    createSalaryCycle,
    updateSalaryCycle,
    removeSalaryCycle,

    clearError,
    clearSelectedSalaryCycle,
  };
}

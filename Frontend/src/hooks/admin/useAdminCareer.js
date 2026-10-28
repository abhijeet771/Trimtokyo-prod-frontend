import { useCallback, useEffect, useState } from "react";

import {
  createAdminCareer,
  getAdminCareers,
  getAdminCareerById,
  updateAdminCareer,
  deleteAdminCareer,
  updateAdminCareerStatus,
  getAdminCareerStats,
  getDeletedAdminCareers,
  restoreAdminCareer,
} from "../../services/career/adminCareer.services.js";

/* -------------------------------------------------------------------------- */
/*                             ADMIN CAREER HOOK                              */
/* -------------------------------------------------------------------------- */

export const useAdminCareer = (initialParams = {}) => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialParams);

  const fetchCareers = useCallback(
    async (params = filters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAdminCareers(params);

        setJobs(response.data || []);
        setPagination((previous) => ({
          ...previous,
          ...(response.pagination || {}),
        }));

        return response;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch career postings";

        setError(message);
        setJobs([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchCareers().catch(() => {});
  }, [fetchCareers]);

  const createCareer = useCallback(
    async (payload) => {
      setError(null);

      try {
        const response = await createAdminCareer(payload);
        await fetchCareers();
        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create career posting"
        );
        throw err;
      }
    },
    [fetchCareers]
  );

  const updateCareer = useCallback(
    async (id, payload) => {
      setError(null);

      try {
        const response = await updateAdminCareer(id, payload);
        await fetchCareers();
        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to update career posting"
        );
        throw err;
      }
    },
    [fetchCareers]
  );

  const deleteCareer = useCallback(
    async (id) => {
      setError(null);

      try {
        const response = await deleteAdminCareer(id);
        await fetchCareers();
        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete career posting"
        );
        throw err;
      }
    },
    [fetchCareers]
  );

  const changeCareerStatus = useCallback(
    async (id, status) => {
      setError(null);

      try {
        const response = await updateAdminCareerStatus(id, status);
        await fetchCareers();
        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to update career status"
        );
        throw err;
      }
    },
    [fetchCareers]
  );

  const applyFilters = useCallback(
    async (newFilters = {}) => {
      const updatedFilters = {
        ...filters,
        ...newFilters,
        page: 1,
      };

      setFilters(updatedFilters);
      return fetchCareers(updatedFilters);
    },
    [filters, fetchCareers]
  );

  const changePage = useCallback(
    async (page) => {
      const updatedFilters = {
        ...filters,
        page,
      };

      setFilters(updatedFilters);
      return fetchCareers(updatedFilters);
    },
    [filters, fetchCareers]
  );

  const refreshCareers = useCallback(
    () => fetchCareers(filters),
    [fetchCareers, filters]
  );

  return {
    jobs,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    fetchCareers,
    createCareer,
    updateCareer,
    deleteCareer,
    changeCareerStatus,
    applyFilters,
    changePage,
    refreshCareers,
  };
};

/* -------------------------------------------------------------------------- */
/*                            ADMIN CAREER DETAILS                            */
/* -------------------------------------------------------------------------- */

export const useAdminCareerDetails = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchCareerDetails = useCallback(async () => {
    if (!id) {
      setJob(null);
      setLoading(false);
      setError(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAdminCareerById(id);
      setJob(response.data || null);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch career details"
      );
      setJob(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCareerDetails().catch(() => {});
  }, [fetchCareerDetails]);

  return {
    job,
    loading,
    error,
    refreshCareer: fetchCareerDetails,
  };
};

/* -------------------------------------------------------------------------- */
/*                          ADMIN CAREER DASHBOARD                            */
/* -------------------------------------------------------------------------- */

export const useAdminCareerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminCareerStats();
      setStats(response.data ?? null);
      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch career statistics"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats().catch(() => {});
  }, [fetchStats]);

  return { stats, loading, error, refreshStats: fetchStats };
};

/* -------------------------------------------------------------------------- */
/*                            DELETED CAREER JOBS                             */
/* -------------------------------------------------------------------------- */

export const useDeletedAdminCareers = (initialParams = {}) => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialParams);

  const fetchDeletedCareers = useCallback(
    async (params = filters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await getDeletedAdminCareers(params);

        setJobs(response.data || []);
        setPagination((previous) => ({
          ...previous,
          ...(response.pagination || {}),
        }));

        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch deleted career postings"
        );
        setJobs([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchDeletedCareers().catch(() => {});
  }, [fetchDeletedCareers]);

  const restoreCareer = useCallback(
    async (id) => {
      setError(null);

      try {
        const response = await restoreAdminCareer(id);
        await fetchDeletedCareers();
        return response;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to restore career posting"
        );
        throw err;
      }
    },
    [fetchDeletedCareers]
  );

  const refreshDeletedCareers = useCallback(
    () => fetchDeletedCareers(filters),
    [fetchDeletedCareers, filters]
  );

  return {
    jobs,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    fetchDeletedCareers,
    restoreCareer,
    refreshDeletedCareers,
  };
};

export default useAdminCareer;

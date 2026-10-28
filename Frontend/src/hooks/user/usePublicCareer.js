import { useCallback, useEffect, useState } from "react";

import {
  getPublicCareers,
  getPublicCareerById,
} from "../../services/career/publicCareer.services.js";

/* -------------------------------------------------------------------------- */
/*                            PUBLIC CAREER HOOK                              */
/* -------------------------------------------------------------------------- */

export const usePublicCareer = (initialParams = {}) => {
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
        const response = await getPublicCareers(params);

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
          "Failed to fetch career opportunities";

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
    applyFilters,
    changePage,
    refreshCareers,
  };
};

/* -------------------------------------------------------------------------- */
/*                          PUBLIC CAREER DETAILS                             */
/* -------------------------------------------------------------------------- */

export const usePublicCareerDetails = (id) => {
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
      const response = await getPublicCareerById(id);
      setJob(response.data || null);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch career details";

      setError(message);
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

export default usePublicCareer;

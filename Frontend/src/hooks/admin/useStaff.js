
import { useCallback, useEffect, useState } from "react";
import { getAllStaff } from "../../services/adminStaff.service";

const useStaff = ({
  page = 1,
  limit = 10,
  search = "",
  designation = "",
} = {}) => {
  const [staff, setStaff] = useState([]);

  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllStaff({
        page,
        limit,
        search,
        designation,
      });

      // Backend response:
      // { success, data: [...staff], pagination: {...} }
      const result = response.data;

      setStaff(
        Array.isArray(result.data) ? result.data : []
      );

      setPagination({
        page: result.pagination?.page ?? page,
        limit: result.pagination?.limit ?? limit,
        total: result.pagination?.total ?? 0,
        totalPages: result.pagination?.totalPages ?? 0,
        hasNext: result.pagination?.hasNext ?? false,
        hasPrev: result.pagination?.hasPrev ?? false,
      });
    } catch (err) {
      setStaff([]);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch staff"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, designation]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    pagination,
    loading,
    error,
    refresh: fetchStaff,
  };
};

export default useStaff;

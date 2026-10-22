import { useCallback, useEffect, useState } from "react";
import { getAllEventCategories } from "../../services/adminEventCategory.services";

const useEventCategories = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAllEventCategories({
        page,
        limit,
        search,
        status,
      });

      setCategories(
        Array.isArray(result.data) ? result.data : []
      );

      if (result.pagination) {
        setPagination(result.pagination);
      } else {
        setPagination({
          page,
          limit,
          total: Array.isArray(result.data)
            ? result.data.length
            : 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err) {
      setCategories([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch event categories."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    pagination,
    loading,
    error,
    refresh: fetchCategories,
  };
};

export default useEventCategories;

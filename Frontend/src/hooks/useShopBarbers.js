import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

// Fetch shop barbers with filters
const useShopBarbers = (
  { city = "", search = "", sort = "" } = {}
) => {
  const [barbers, setBarbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBarbers = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 8);

        if (city) params.append("city", city);
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);

        const res = await api.get(
          `/api/v1/shop?${params.toString()}`
        );

        setBarbers(res.data.barbers || []);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      } catch (err) {
        setError("Failed to load shop");
        setBarbers([]);
      } finally {
        setLoading(false);
      }
    },
    [city, search, sort]
  );

  // Refetch when filters change
  useEffect(() => {
    fetchBarbers(1);
  }, [fetchBarbers]);

  return {
    barbers,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage: fetchBarbers,
  };
};

export default useShopBarbers;
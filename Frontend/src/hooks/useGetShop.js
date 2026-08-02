import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getAdminBarbers } from "../services/api";

const useGetShop = () => {
  const [barbers, setBarbers] = useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fetchBarbers = useCallback(
    async (
      page = pagination.page,
      searchText = search
    ) => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminBarbers({
            page,
            limit: pagination.limit,
            search: searchText,
          });

        setBarbers(
          response.data.data.barbers
        );

        setPagination(
          response.data.data.pagination
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to fetch barbers."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      pagination.limit,
      pagination.page,
      search,
    ]
  );

  useEffect(() => {
    fetchBarbers(1, "");
  }, []);

  const changePage = (page) => {
    fetchBarbers(page, search);
  };

  const handleSearch = (value) => {
    setSearch(value);
    fetchBarbers(1, value);
  };

  return {
    barbers,

    loading,

    error,

    search,

    setSearch: handleSearch,

    pagination,

    changePage,

    refresh: fetchBarbers,
  };
};

export default useGetShop;
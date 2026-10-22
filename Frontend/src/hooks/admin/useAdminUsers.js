
import { useState, useCallback } from "react";
import { getAdminUsers } from "../../services/adminUsers.service";
import { toast } from "sonner";

const useAdminUsers = (initialPage = 1, initialLimit = 10) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(
    async (options = {}) => {
      const nextPage = options.page ?? page;
      const nextLimit = options.limit ?? limit;
      const nextSearch = options.search ?? search;

      setLoading(true);
      setError(null);

      try {
        const res = await getAdminUsers({
          page: nextPage,
          limit: nextLimit,
          search: nextSearch,
        });

        const responseData = res.data?.data ?? res.data;

        const userList = Array.isArray(responseData)
          ? responseData
          : responseData?.users ?? [];

        setUsers(userList);
        setPage(nextPage);
        setLimit(nextLimit);
        setSearch(nextSearch);

        setTotal(
          responseData?.total ??
            responseData?.totalUsers ??
            responseData?.pagination?.total ??
            userList.length
        );

        setTotalPages(
          responseData?.totalPages ??
            responseData?.pagination?.totalPages ??
            0
        );

        return responseData;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load users.";

        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search]
  );

  return {
    users,
    page,
    limit,
    search,
    total,
    totalPages,
    loading,
    error,
    setPage,
    setLimit,
    setSearch,
    fetchUsers,
  };
};

export default useAdminUsers;

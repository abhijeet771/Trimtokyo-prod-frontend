import { useCallback, useEffect, useState } from "react";
import {  getAdminUsers,  exportAdminUsersCSV,} from "../services/api";

const useUserDetails = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchUsers = useCallback(
    async (page = pagination.page, searchText = search) => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminUsers({
          page,
          limit: pagination.limit,
          search: searchText,
        });

        setUsers(response.data.data.users);

        setPagination(response.data.data.pagination);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to fetch users."
        );
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, pagination.page, search]
  );

  useEffect(() => {
    fetchUsers(1, "");
  }, []);

  const changePage = (page) => {
    fetchUsers(page, search);
  };

  const handleSearch = (value) => {
    setSearch(value);
    fetchUsers(1, value);
  };

  const exportCSV = async () => {
    try {
      const response = await exportAdminUsersCSV(search);

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "users.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      alert("Failed to export CSV.");
    }
  };

  return {
    users,

    loading,

    error,

    search,

    setSearch: handleSearch,

    pagination,

    changePage,

    exportCSV,

    refresh: fetchUsers,
  };
};

export default useUserDetails;
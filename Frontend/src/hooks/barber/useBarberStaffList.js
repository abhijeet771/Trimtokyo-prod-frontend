
import { useCallback, useEffect, useState } from "react";
import { getBarberStaff } from "../../services/barberStaff.service";

const useBarberStaffList = (initialParams = {}) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStaffList = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBarberStaff({
        ...initialParams,
        ...params,
        page: params.page ?? 1,
        limit: params.limit ?? 100,
      });

      const data = response?.data;

      const staffList = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.staff)
          ? data.staff
          : Array.isArray(data)
            ? data
            : [];

      setStaff(staffList);
      return staffList;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch staff list.";

      setError(message);
      setStaff([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchStaffList();
  }, [fetchStaffList]);

  return {
    staff,
    loading,
    error,
    fetchStaffList,
    refreshStaffList: fetchStaffList,
  };
};

export default useBarberStaffList;

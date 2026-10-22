
import { useCallback, useEffect, useState } from "react";
import { getStaffById } from "../../services/adminStaff.service";

const useStaffById = (id) => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    if (!id) {
      setStaff(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getStaffById(id);
      const result = response.data;

      setStaff(result.data ?? result.staff ?? result);
    } catch (err) {
      setStaff(null);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch staff details"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    loading,
    error,
    refresh: fetchStaff,
  };
};

export default useStaffById;

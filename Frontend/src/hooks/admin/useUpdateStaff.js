
import { useCallback, useState } from "react";
import { updateStaff } from "../../services/adminStaff.service";

const useUpdateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editStaff = useCallback(async (id, staffData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateStaff(id, staffData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update staff";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    editStaff,
    loading,
    error,
  };
};

export default useUpdateStaff;

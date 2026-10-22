
import { useCallback, useState } from "react";
import { deleteStaff } from "../../services/adminStaff.service";

const useDeleteStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeStaff = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteStaff(id);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete staff";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    removeStaff,
    loading,
    error,
  };
};

export default useDeleteStaff;

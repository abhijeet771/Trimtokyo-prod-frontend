
import { useState, useCallback } from "react";
import { createStaff } from "../../services/adminStaff.service";

const useCreateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addStaff = useCallback(async (staffData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createStaff(staffData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create staff";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addStaff,
    loading,
    error,
  };
};

export default useCreateStaff;

import { useState } from "react";
import { updateEventCategory } from "../../services/adminEventCategory.services";

const useUpdateEventCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editEventCategory = async (id, categoryData) => {
    setLoading(true);
    setError("");

    try {
      const result = await updateEventCategory(id, categoryData);
      return result;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to update event category.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    editEventCategory,
    loading,
    error,
  };
};

export default useUpdateEventCategory;

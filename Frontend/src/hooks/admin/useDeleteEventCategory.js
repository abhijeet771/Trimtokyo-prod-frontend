
import { useState } from "react";
import { deleteEventCategory } from "../../services/adminEventCategory.services";

const useDeleteEventCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const removeEventCategory = async (id) => {
    setLoading(true);
    setError("");

    try {
      const result = await deleteEventCategory(id);
      return result;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to delete event category.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    removeEventCategory,
    loading,
    error,
  };
};

export default useDeleteEventCategory;

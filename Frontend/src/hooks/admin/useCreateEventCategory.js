
import { useState } from "react";
import { createEventCategory } from "../../services/adminEventCategory.services";

const useCreateEventCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addEventCategory = async (categoryData) => {
    setLoading(true);
    setError("");

    try {
      const result = await createEventCategory(categoryData);
      return result;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to create event category.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addEventCategory,
    loading,
    error,
  };
};

export default useCreateEventCategory;

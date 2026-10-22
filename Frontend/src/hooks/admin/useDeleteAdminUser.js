
import { useState, useCallback } from "react";
import { deleteAdminUser } from "../../services/adminUsers.service";
import { toast } from "sonner";

const useDeleteAdminUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = useCallback(async (id) => {
    if (!id) {
      const message = "A valid user ID is required.";
      setError(message);
      toast.error(message);
      throw new Error(message);
    }

    setLoading(true);
    setError(null);

    try {
      await deleteAdminUser(id);

      toast.success("User deleted successfully.");

      return id;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete user.";

      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteUser,
    loading,
    error,
  };
};

export default useDeleteAdminUser;

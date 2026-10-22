import { useState } from "react";
import { deleteSocialMedia } from "../../services/adminSocialMedia.services";

const useDeleteSocialMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const removeSocialMedia = async (id) => {
    setLoading(true);
    setError("");

    try {
      return await deleteSocialMedia(id);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to delete social media account.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    removeSocialMedia,
    loading,
    error,
  };
};

export default useDeleteSocialMedia;

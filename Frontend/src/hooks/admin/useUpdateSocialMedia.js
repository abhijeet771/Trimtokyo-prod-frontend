
import { useState } from "react";
import { updateSocialMedia } from "../../services/adminSocialMedia.services";

const useUpdateSocialMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editSocialMedia = async (id, socialMediaData) => {
    setLoading(true);
    setError("");

    try {
      return await updateSocialMedia(id, socialMediaData);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to update social media account.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    editSocialMedia,
    loading,
    error,
  };
};

export default useUpdateSocialMedia;

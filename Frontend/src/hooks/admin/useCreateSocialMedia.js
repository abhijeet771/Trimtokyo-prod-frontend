import { useState } from "react";
import { createSocialMedia } from "../../services/adminSocialMedia.services";

const useCreateSocialMedia = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSocialMedia = async (socialMediaData) => {
    setLoading(true);
    setError("");

    try {
      return await createSocialMedia(socialMediaData);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to create social media account.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addSocialMedia,
    loading,
    error,
  };
};

export default useCreateSocialMedia;

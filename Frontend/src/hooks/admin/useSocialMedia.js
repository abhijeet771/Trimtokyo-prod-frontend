
import { useCallback, useEffect, useState } from "react";
import { getAllSocialMedia } from "../../services/adminSocialMedia.services";

const useSocialMedia = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  platform = "",
} = {}) => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSocialMedia = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAllSocialMedia({
        page,
        limit,
        search,
        status,
        platform,
      });

      setSocialMedia(
        Array.isArray(result.data) ? result.data : []
      );

      if (result.pagination) {
        setPagination(result.pagination);
      } else {
        setPagination({
          page,
          limit,
          total: Array.isArray(result.data)
            ? result.data.length
            : 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err) {
      setSocialMedia([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch social media accounts."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, platform]);

  useEffect(() => {
    fetchSocialMedia();
  }, [fetchSocialMedia]);

  return {
    socialMedia,
    pagination,
    loading,
    error,
    refresh: fetchSocialMedia,
  };
};

export default useSocialMedia;

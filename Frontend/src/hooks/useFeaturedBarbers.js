import { useEffect, useState } from "react";

import {
  getFeaturedBarbers,
} from "../services/api";

const useFeaturedBarbers = ({
  businessType,
  limit = 6,
}) => {
  const [
    featuredBarbers,
    setFeaturedBarbers,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    const fetchFeaturedBarbers =
      async () => {
        try {
          setLoading(true);

          setError(null);

          const res =
            await getFeaturedBarbers({
              businessType,
              limit,
            });

          setFeaturedBarbers(
            res.data
              .featuredBarbers || []
          );
        } catch (err) {
          setError(
            "Failed to load featured barbers"
          );

          setFeaturedBarbers([]);
        } finally {
          setLoading(false);
        }
      };

    fetchFeaturedBarbers();
  }, [businessType, limit]);

  return {
    featuredBarbers,

    loading,

    error,
  };
};

export default useFeaturedBarbers;
import { useEffect, useState } from "react";
import { getOrderRoute } from "../services/api";

const useOrderRoute = (orderId) => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchRoute = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getOrderRoute(orderId);
        setRoute(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch route"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [orderId]);

  return { route, loading, error };
};

export default useOrderRoute;
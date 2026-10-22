
import { useCallback, useEffect, useState } from "react";
import { getBarberShopBySlug } from "../../services/barberShop.service";

const useBarberShop = (slug) => {
  const [barberShop, setBarberShop] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState("");

  const fetchBarberShop = useCallback(async () => {
    if (!slug || !slug.trim()) {
      setBarberShop(null);
      setError("Barber shop slug is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getBarberShopBySlug(slug);

      setBarberShop(data);
    } catch (err) {
      setBarberShop(null);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load barber shop details."
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBarberShop();
  }, [fetchBarberShop]);

  return {
    barberShop,
    profile: barberShop?.profile ?? null,
    gallery: barberShop?.gallery ?? [],
    services: barberShop?.services ?? [],
    team: barberShop?.team ?? [],
    reviews: barberShop?.reviews ?? {
      summary: null,
      items: [],
    },
    loading,
    error,
    refetch: fetchBarberShop,
  };
};

export default useBarberShop;

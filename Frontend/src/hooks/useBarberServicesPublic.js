import { useEffect, useState } from "react";
import api from "../services/api";

// Fetch approved services for a barber
const useBarberServicesPublic = (barberId) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!barberId) return;

    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/v1/services/approved/${barberId}`
        );
        setServices(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [barberId]);

  return { services, loading };
};

export default useBarberServicesPublic;
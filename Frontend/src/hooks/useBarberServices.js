import { useEffect, useState, useCallback } from "react";
import {
  addBarberService,
  getMyBarberServices,
} from "../services/api";

const useBarberServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch my services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyBarberServices();
      setServices(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load services"
      );
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new service
  const createService = async (data) => {
    try {
      setError(null);

      // ✅ Frontend validation (prevents backend error)
      if (!data.gender) {
        throw new Error("Please select gender");
      }

      const res = await addBarberService(data);

      await fetchServices(); // refresh after create

      return res;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create service"
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    createService,
    refresh: fetchServices,
  };
};

export default useBarberServices;
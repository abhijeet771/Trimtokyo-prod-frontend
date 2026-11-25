
import { useEffect, useState, useCallback } from "react";

import {
  addBarberService,
  getMyBarberServices,
  deleteMyBarberService,
} from "../../services/barber/barberService.service";

const useBarberServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch services
  const fetchServices = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyBarberServices(params);

      setServices(res.data.data || []);

      return res;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load services"
      );

      setServices([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create service
  const createService = useCallback(async (data) => {
    try {
      setCreating(true);
      setError(null);

      if (!data.gender) {
        throw new Error("Please select gender");
      }

      const res = await addBarberService(data);

      await fetchServices();

      return res;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create service"
      );

      throw err;
    } finally {
      setCreating(false);
    }
  }, [fetchServices]);

  // Search services by name
  const searchServices = useCallback(async (search = "") => {
    return fetchServices({
      search: search.trim(),
    });
  }, [fetchServices]);

  // Delete service
  const deleteService = useCallback(async (serviceId) => {
    try {
      setDeletingId(serviceId);
      setError(null);

      const res = await deleteMyBarberService(serviceId);

      return res;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete service"
      );

      throw err;
    } finally {
      setDeletingId(null);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchServices().catch(() => {});
  }, [fetchServices]);

  return {
    services,
    loading,
    creating,
    deletingId,
    error,
    createService,
    deleteService,
    searchServices,
    refresh: fetchServices,
  };
};

export default useBarberServices;

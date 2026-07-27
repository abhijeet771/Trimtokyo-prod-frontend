import { useEffect, useState } from "react";
import {
  getPendingServices,
  approveService,
  rejectService,
} from "../services/api";

const useAdminServiceApprovals = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getPendingServices();
      setServices(res.data.data);
    } catch (err) {
      setError("Failed to load pending services");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await approveService(id);
    fetchServices();
  };

  const reject = async (id) => {
    await rejectService(id);
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    approve,
    reject,
  };
};

export default useAdminServiceApprovals;
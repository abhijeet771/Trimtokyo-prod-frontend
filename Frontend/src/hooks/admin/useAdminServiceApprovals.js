import { useCallback, useEffect, useState } from "react";

import {
  getPendingServices,
  approveService as approveServiceAPI,
  rejectService as rejectServiceAPI,
} from "../../services/adminServiceApproval.service";

const useAdminServiceApprovals = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH PENDING SERVICES ================= */

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getPendingServices();
      const data = res.data?.data;

      setServices(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to load pending services";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= APPROVE SERVICE ================= */

  const approve = async (id) => {
    try {
      await approveServiceAPI(id);
      await fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to approve service"
      );

      throw err;
    }
  };

  /* ================= REJECT SERVICE ================= */

  const reject = async (id) => {
    try {
      await rejectServiceAPI(id);
      await fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reject service"
      );

      throw err;
    }
  };

  useEffect(() => {
    fetchServices().catch(() => {});
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    approve,
    reject,
    refresh: fetchServices,
  };
};

export default useAdminServiceApprovals;
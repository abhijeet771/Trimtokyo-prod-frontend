import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getPendingApprovals,
  approveBarber as approveBarberAPI,
  declineBarber as declineBarberAPI,
  featureBarber,
} from "../../services/adminApproval.service";

const useAdminApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH BARBER APPROVALS ================= */

  const fetchApprovals = useCallback(async () => {
    try {
      setError(null);

      const res = await getPendingApprovals();
      const data = res.data?.data;

      setApprovals(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to load approvals";

      setError(message);
      throw err;
    }
  }, []);

  /* ================= INITIAL FETCH ================= */

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await fetchApprovals();
    } catch {
      // Error is stored by fetchApprovals.
    } finally {
      setLoading(false);
    }
  }, [fetchApprovals]);

  /* ================= APPROVE BARBER ================= */

  const approveBarber = async (id) => {
    const loadingToast = toast.loading("Approving barber...");

    try {
      await approveBarberAPI(id);

      toast.success("Barber Approved Successfully", {
        id: loadingToast,
      });

      await fetchApprovals();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Approval Failed",
        { id: loadingToast }
      );

      setError(
        err.response?.data?.message || "Approval failed"
      );
    }
  };

  /* ================= DECLINE BARBER ================= */

  const declineBarber = async (id) => {
    const loadingToast = toast.loading("Declining barber...");

    try {
      await declineBarberAPI(id);

      toast.success("Barber Declined Successfully", {
        id: loadingToast,
      });

      await fetchApprovals();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Decline Failed",
        { id: loadingToast }
      );

      setError(
        err.response?.data?.message || "Decline failed"
      );
    }
  };

  /* ================= FEATURE TOGGLE ================= */

  const toggleFeatureBarber = async (id, isFeatured) => {
    const loadingToast = toast.loading(
      "Updating featured status..."
    );

    try {
      await featureBarber(id, isFeatured);

      toast.success(
        isFeatured
          ? "Barber Added To Featured"
          : "Barber Removed From Featured",
        { id: loadingToast }
      );

      await fetchApprovals();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Feature Update Failed",
        { id: loadingToast }
      );

      setError(
        err.response?.data?.message ||
          "Feature update failed"
      );
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    approvals,
    loading,
    error,
    approveBarber,
    declineBarber,
    toggleFeatureBarber,
    refresh: fetchAll,
  };
};

export default useAdminApprovals;
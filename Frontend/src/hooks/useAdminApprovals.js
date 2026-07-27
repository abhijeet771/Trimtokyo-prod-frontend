import {  useEffect,  useState,} from "react";
import api from "../services/api";
import { toast } from "sonner";

const useAdminApprovals = () => {
  const [  approvals,    setApprovals, ] = useState([]);
  const [  pendingServices,    setPendingServices,  ] = useState([]);
  const [  loading,  setLoading, ] = useState(true);

  const [error, setError] =
    useState(null);

  /* ================= FETCH BARBER APPROVALS ================= */

  const fetchApprovals =
    async () => {
      try {
        const res =
          await api.get(
            "/api/v1/admin/approvals"
          );

        setApprovals(
          res.data.data || []
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Failed to load approvals"
        );
      }
    };

  /* ================= FETCH SERVICE APPROVALS ================= */

  const fetchPendingServices =
    async () => {
      try {
        const res =
          await api.get(
            "/api/v1/services/admin/pending"
          );

        setPendingServices(
          res.data.data || []
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Failed to load services"
        );
      }
    };

  /* ================= INITIAL FETCH ================= */

  const fetchAll = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchApprovals(),
        fetchPendingServices(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPROVE BARBER ================= */

  const approveBarber =
    async (id) => {
      const loadingToast =
        toast.loading(
          "Approving barber..."
        );

      try {
        await api.patch(
          `/api/v1/admin/approve/${id}`
        );

        toast.dismiss(
          loadingToast
        );

        toast.success(
          "Barber Approved Successfully"
        );

        fetchApprovals();
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          "Approval Failed"
        );

        setError(
          "Approval failed"
        );
      }
    };

  /* ================= DECLINE BARBER ================= */

  const declineBarber =
    async (id) => {
      const loadingToast =
        toast.loading(
          "Declining barber..."
        );

      try {
        await api.patch(
          `/api/v1/admin/decline/${id}`
        );

        toast.dismiss(
          loadingToast
        );

        toast.success(
          "Barber Declined Successfully"
        );

        fetchApprovals();
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          "Decline Failed"
        );

        setError(
          "Decline failed"
        );
      }
    };

  /* ================= APPROVE SERVICE ================= */

  const approveService =
    async (id) => {
      const loadingToast =
        toast.loading(
          "Approving service..."
        );

      try {
        await api.patch(
          `/api/v1/services/admin/approve/${id}`
        );

        toast.dismiss(
          loadingToast
        );

        toast.success(
          "Service Approved Successfully"
        );

        fetchPendingServices();
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          "Service Approval Failed"
        );

        setError(
          "Service approval failed"
        );
      }
    };

  /* ================= REJECT SERVICE ================= */

  const rejectService =
    async (id) => {
      const loadingToast =
        toast.loading(
          "Rejecting service..."
        );

      try {
        await api.patch(
          `/api/v1/services/admin/reject/${id}`
        );

        toast.dismiss(
          loadingToast
        );

        toast.success(
          "Service Rejected Successfully"
        );

        fetchPendingServices();
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          "Service Rejection Failed"
        );

        setError(
          "Service rejection failed"
        );
      }
    };

  /* ================= FEATURE TOGGLE ================= */

  const toggleFeatureBarber =
    async (
      id,
      isFeatured
    ) => {
      const loadingToast =
        toast.loading(
          "Updating featured status..."
        );

      try {
        await api.patch(
          `/api/v1/admin/feature/${id}`,
          {
            isFeatured,
          }
        );

        toast.dismiss(
          loadingToast
        );

        toast.success(
          isFeatured  ? "Barber Added To Featured" : "Barber Removed From Featured"
        );

        fetchApprovals();
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          "Feature Update Failed"
        );

        setError(
          "Feature update failed"
        );
      }
    };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    approvals,
    pendingServices,
    loading,
    error,
    approveBarber,
    declineBarber,
    approveService,
    rejectService,
    toggleFeatureBarber,
    refresh: fetchAll,
  };
};

export default useAdminApprovals;
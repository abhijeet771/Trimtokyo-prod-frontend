
import { useCallback, useEffect, useState } from "react";
import {
  getAllReferrals,
  getReferralStats,
  reviewReferral,
} from "../../services/shared/refferal.service.js";

const INITIAL_STATS = {
  totalRequests: 0,
  pending: 0,
  approved: 0,
  declined: 0,
};

const useAdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("pending");

  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ----------------------------------------------------------
     FETCH REFERRAL KPI STATS
  ---------------------------------------------------------- */

  const fetchReferralStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");

    try {
      const response = await getReferralStats();
      const data = response.data || {};

      setStats({
        totalRequests: Number(data.totalRequests) || 0,
        pending: Number(data.pending) || 0,
        approved: Number(data.approved) || 0,
        declined: Number(data.declined) || 0,
      });

      return data;
    } catch (err) {
      setStatsError(
        err.response?.data?.message ||
          "Failed to load referral statistics."
      );

      return null;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* ----------------------------------------------------------
     FETCH REFERRALS
  ---------------------------------------------------------- */

  const fetchReferrals = useCallback(
    async (status = statusFilter) => {
      setLoading(true);
      setError("");

      try {
        const response = await getAllReferrals(
          status && status !== "all" ? status : undefined
        );

        const data = response.data || {};

        setReferrals(data.referrals || []);
        setTotal(Number(data.total) || 0);

        return data;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load referral requests."
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  /* ----------------------------------------------------------
     INITIAL LOAD AND STATUS FILTER
  ---------------------------------------------------------- */

  const changeStatusFilter = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  useEffect(() => {
    fetchReferrals(statusFilter);
  }, [statusFilter, fetchReferrals]);

  useEffect(() => {
    fetchReferralStats();
  }, [fetchReferralStats]);

  /* ----------------------------------------------------------
     APPROVE OR DECLINE REFERRAL
  ---------------------------------------------------------- */

  const reviewReferralRequest = useCallback(
    async (referralId, status, reviewNote = "") => {
      if (!referralId) {
        setError("Referral ID is required.");
        return false;
      }

      if (!["approved", "declined"].includes(status)) {
        setError("Status must be approved or declined.");
        return false;
      }

      setReviewingId(referralId);
      setError("");
      setStatsError("");
      setSuccessMessage("");

      try {
        const response = await reviewReferral(
          referralId,
          status,
          reviewNote
        );

        setSuccessMessage(
          response.message || `Referral ${status} successfully.`
        );

        // Refresh both the referral list and the KPI cards.
        await Promise.all([
          fetchReferrals(statusFilter),
          fetchReferralStats(),
        ]);

        return true;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            `Failed to ${status} referral.`
        );

        return false;
      } finally {
        setReviewingId(null);
      }
    },
    [fetchReferrals, fetchReferralStats, statusFilter]
  );

  return {
    referrals,
    total,
    statusFilter,
    setStatusFilter: changeStatusFilter,

    // KPI statistics
    stats,
    statsLoading,
    statsError,
    fetchReferralStats,

    // Referral list and review state
    loading,
    reviewingId,
    error,
    successMessage,
    fetchReferrals,
    reviewReferralRequest,
  };
};

export default useAdminReferrals;

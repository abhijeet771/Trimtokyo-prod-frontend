
import { useCallback, useEffect, useState } from "react";
import {
  getMyReferralCode,
  getMyReferrals,
  applyReferralCode,
} from "../../services/shared/refferal.service.js";

const useUserReferral = () => {
  const [referralCode, setReferralCode] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referrals, setReferrals] = useState([]);

  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ----------------------------------------------------------
     FETCH REFERRAL CODE
  ---------------------------------------------------------- */

  const fetchReferralCode = useCallback(async () => {
    const response = await getMyReferralCode();
    const data = response.data || {};

    setReferralCode(data.referralCode || "");
    setTotalPoints(data.totalPoints || 0);

    return data;
  }, []);

  /* ----------------------------------------------------------
     FETCH REFERRAL HISTORY
  ---------------------------------------------------------- */

  const fetchMyReferrals = useCallback(async () => {
    const response = await getMyReferrals();
    const data = response.data || {};

    setReferrals(data.referrals || []);
    setTotalReferrals(data.totalReferrals || 0);
    setTotalPoints(data.totalPoints || 0);

    return data;
  }, []);

  /* ----------------------------------------------------------
     FETCH ALL USER REFERRAL DATA
  ---------------------------------------------------------- */

  const fetchReferralData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        fetchReferralCode(),
        fetchMyReferrals(),
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load referral information."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchReferralCode, fetchMyReferrals]);

  /* ----------------------------------------------------------
     APPLY REFERRAL CODE
  ---------------------------------------------------------- */

  const submitReferralCode = useCallback(
    async (code) => {
      if (!code?.trim()) {
        setError("Please enter a referral code.");
        return false;
      }

      setApplying(true);
      setError("");
      setSuccessMessage("");

      try {
        const response = await applyReferralCode(code.trim());

        setSuccessMessage(
          response.message ||
            "Referral code submitted successfully."
        );

        await fetchMyReferrals();

        return true;
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to submit referral code."
        );

        return false;
      } finally {
        setApplying(false);
      }
    },
    [fetchMyReferrals]
  );

  /* ----------------------------------------------------------
     INITIAL LOAD
  ---------------------------------------------------------- */

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  return {
    referralCode,
    totalPoints,
    totalReferrals,
    referrals,
    loading,
    applying,
    error,
    successMessage,
    fetchReferralCode,
    fetchMyReferrals,
    fetchReferralData,
    submitReferralCode,
  };
};

export default useUserReferral;

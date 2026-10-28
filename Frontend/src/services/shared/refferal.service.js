
import apik from "../apik.js";

/* -------------------------------------------------------------------------- */
/*                              REFERRAL SERVICE                              */
/* -------------------------------------------------------------------------- */

const REFERRAL_BASE_URL = "/api/referrals";

/* -------------------------------------------------------------------------- */
/*                         1. GET MY REFERRAL CODE                            */
/*                         GET /api/referrals/my-code                         */
/* -------------------------------------------------------------------------- */

export const getMyReferralCode = async () => {
  const response = await apik.get(
    `${REFERRAL_BASE_URL}/my-code`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         2. APPLY REFERRAL CODE                             */
/*                         POST /api/referrals/apply                          */
/* -------------------------------------------------------------------------- */

export const applyReferralCode = async (referralCode) => {
  const response = await apik.post(
    `${REFERRAL_BASE_URL}/apply`,
    { referralCode }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         3. GET MY REFERRALS                                */
/*                         GET /api/referrals/my-referrals                    */
/* -------------------------------------------------------------------------- */

export const getMyReferrals = async () => {
  const response = await apik.get(
    `${REFERRAL_BASE_URL}/my-referrals`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         4. ADMIN: GET ALL REFERRALS                        */
/*                         GET /api/referrals/admin                           */
/* -------------------------------------------------------------------------- */

export const getAllReferrals = async (status) => {
  const response = await apik.get(
    `${REFERRAL_BASE_URL}/admin`,
    {
      params: status ? { status } : {},
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         5. ADMIN: GET REFERRAL KPI STATS                   */
/*                         GET /api/referrals/admin/stats                     */
/* -------------------------------------------------------------------------- */

export const getReferralStats = async () => {
  const response = await apik.get(
    `${REFERRAL_BASE_URL}/admin/stats`
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         6. ADMIN: REVIEW REFERRAL                          */
/*                         PATCH /api/referrals/admin/:id/review              */
/* -------------------------------------------------------------------------- */

export const reviewReferral = async (
  referralId,
  status,
  reviewNote = ""
) => {
  const response = await apik.patch(
    `${REFERRAL_BASE_URL}/admin/${referralId}/review`,
    {
      status,
      reviewNote,
    }
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

const referralService = {
  getMyReferralCode,
  applyReferralCode,
  getMyReferrals,
  getAllReferrals,
  getReferralStats,
  reviewReferral,
};

export default referralService;

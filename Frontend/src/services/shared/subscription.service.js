
import apik from "../apik";

/* -------------------------------------------------------------------------- */
/*                         SUBSCRIPTION ADMIN                                 */
/* -------------------------------------------------------------------------- */

// Create subscription plan
export const createSubscription = (data) =>
  apik.post("/api/subscription", data);

// Get all subscriptions (including inactive)
export const getAllSubscriptions = () =>
  apik.get("/api/subscription");

// Get subscription by ID
export const getSubscriptionById = (id) =>
  apik.get(`/api/subscription/${id}`);

// Update subscription
export const updateSubscription = (id, data) =>
  apik.put(`/api/subscription/${id}`, data);

// Delete subscription
export const deleteSubscription = (id) =>
  apik.delete(`/api/subscription/${id}`);

/* -------------------------------------------------------------------------- */
/*                         PUBLIC SUBSCRIPTIONS                               */
/* -------------------------------------------------------------------------- */

// Get active subscriptions for the website
export const getActiveSubscriptions = () =>
  apik.get("/api/subscription/active");

// Get one active subscription by ID
export const getActiveSubscriptionById = (id) =>
  apik.get(`/api/subscription/active/${id}`);

/* -------------------------------------------------------------------------- */
/*                         USER SUBSCRIPTIONS                                 */
/* -------------------------------------------------------------------------- */

// Create subscription purchase request
export const initiateSubscriptionPurchase = (subscriptionId) =>
  apik.post("/api/subscription/user/subscribe", {
    subscriptionId,
  });

// Submit UPI payment confirmation
export const submitSubscriptionPayment = (purchaseId) =>
  apik.post("/api/subscription/user/submit-payment", {
    purchaseId,
  });

// Get current or upcoming subscription
export const getCurrentUserSubscription = () =>
  apik.get("/api/subscription/user/current");

// Get user subscription purchase history
export const getUserSubscriptionHistory = (params = {}) =>
  apik.get("/api/subscription/user/history", {
    params,
  });

/* -------------------------------------------------------------------------- */
/*                         ADMIN PAYMENT MANAGEMENT                           */
/* -------------------------------------------------------------------------- */

// Get pending subscription payment requests
export const getPendingSubscriptionPayments = (params = {}) =>
  apik.get("/api/subscription/admin/pending-payments", {
    params,
  });

// Approve subscription payment
export const approveSubscriptionPayment = (purchaseId) =>
  apik.patch(
    `/api/subscription/admin/approve/${purchaseId}`
  );

// Reject subscription payment
export const rejectSubscriptionPayment = (
  purchaseId,
  rejectionReason
) =>
  apik.patch(
    `/api/subscription/admin/reject/${purchaseId}`,
    {
      rejectionReason,
    }
  );

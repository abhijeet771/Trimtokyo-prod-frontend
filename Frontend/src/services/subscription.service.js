
import apik from "./apik";

/* -------------------------------------------------------------------------- */
/*                         SUBSCRIPTION ADMIN                                 */
/* -------------------------------------------------------------------------- */

// Create subscription
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

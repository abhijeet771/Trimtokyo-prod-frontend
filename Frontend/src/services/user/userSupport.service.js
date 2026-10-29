import apik from "../apik.js";

const USER_SUPPORT_URL = "/api/user-support";

/**
 * Create a support ticket for the logged-in user.
 * POST /api/user-support
 */
export const createUserSupportTicket = async (payload) => {
  const response = await apik.post(USER_SUPPORT_URL, {
    subject: payload.subject,
    category: payload.category || "Other",
    message: payload.message,
  });

  return response.data;
};

/**
 * Get support tickets belonging to the logged-in user.
 * GET /api/user-support/my
 */
export const getMyUserSupportTickets = async (params = {}) => {
  const response = await apik.get(`${USER_SUPPORT_URL}/my`, {
    params: {
      page: params.page || 1,
      limit: params.limit || 5,
      ...(params.status ? { status: params.status } : {}),
    },
  });

  return response.data;
};

/**
 * Get a specific ticket belonging to the logged-in user.
 * GET /api/user-support/my/:ticketId
 */
export const getMyUserSupportTicketById = async (ticketId) => {
  const response = await apik.get(
    `${USER_SUPPORT_URL}/my/${ticketId}`
  );

  return response.data;
};

export default {
  createUserSupportTicket,
  getMyUserSupportTickets,
  getMyUserSupportTicketById,
};
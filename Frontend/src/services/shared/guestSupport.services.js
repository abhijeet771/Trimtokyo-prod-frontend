
import apik from "../apik.js";

const GUEST_SUPPORT_URL = "/api/guest-support";

/**
 * Submit a guest support request.
 * POST /api/guest-support
 */
export const createGuestSupportTicket = async (payload) => {
  const response = await apik.post(GUEST_SUPPORT_URL, {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    title: payload.title,
    message: payload.message,
  });

  return response.data;
};

/**
 * Get all guest support tickets.
 * GET /api/guest-support
 * Admin only.
 */
export const getAllGuestSupportTickets = async (params = {}) => {
  const response = await apik.get(GUEST_SUPPORT_URL, {
    params,
  });

  return response.data;
};

/**
 * Get a guest support ticket by ID.
 * GET /api/guest-support/:ticketId
 * Admin only.
 */
export const getGuestSupportTicketById = async (ticketId) => {
  const response = await apik.get(
    `${GUEST_SUPPORT_URL}/${ticketId}`
  );

  return response.data;
};

/**
 * Update ticket status or admin response.
 * PATCH /api/guest-support/:ticketId
 * Admin only.
 */
export const updateGuestSupportTicket = async (
  ticketId,
  payload
) => {
  const response = await apik.patch(
    `${GUEST_SUPPORT_URL}/${ticketId}`,
    payload
  );

  return response.data;
};

/**
 * Delete a guest support ticket.
 * DELETE /api/guest-support/:ticketId
 * Admin only.
 */
export const deleteGuestSupportTicket = async (ticketId) => {
  const response = await apik.delete(
    `${GUEST_SUPPORT_URL}/${ticketId}`
  );

  return response.data;
};

/**
 * Get guest support dashboard summary.
 * GET /api/guest-support/summary
 * Admin only.
 */
export const getGuestSupportSummary = async () => {
  const response = await apik.get(
    `${GUEST_SUPPORT_URL}/summary`
  );

  return response.data;
};

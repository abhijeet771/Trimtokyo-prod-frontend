
import apik from "./apik";

const SUPPORT_URL = "/api/barber/support";

/* -------------------------------------------------------------------------- */
/*                              GET SUPPORT STATS                             */
/* -------------------------------------------------------------------------- */

export const getBarberSupportStats = async () => {
  const response = await apik.get(`${SUPPORT_URL}/stats`);  return response.data;};

/* -------------------------------------------------------------------------- */
/*                              GET SUPPORT TICKETS                           */
/* -------------------------------------------------------------------------- */

export const getBarberSupportTickets = async (params = {}) => {
  const response = await apik.get(SUPPORT_URL, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search ?? "",
      status: params.status,
      priority: params.priority,
    },
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                              CREATE SUPPORT TICKET                         */
/* -------------------------------------------------------------------------- */

export const createBarberSupportTicket = async (data) => {
  const response = await apik.post(SUPPORT_URL, {
    title: data.title,
    category: data.category,
    description: data.description,
    priority: data.priority ?? "MEDIUM",
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                              UPDATE SUPPORT TICKET                         */
/* -------------------------------------------------------------------------- */

export const updateBarberSupportTicket = async (
  ticketId,
  data
) => {
  const response = await apik.patch(
    `${SUPPORT_URL}/${ticketId}`,
    data
  );

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                              DELETE SUPPORT TICKET                         */
/* -------------------------------------------------------------------------- */

export const deleteBarberSupportTicket = async (ticketId) => {
  const response = await apik.delete(
    `${SUPPORT_URL}/${ticketId}`
  );

  return response.data;
};


import apik from "../apik";

const SUPPORT_URL = "/api/admin/barber-support";

export const getAdminBarberSupportTickets = async (params = {}) => {
  const response = await apik.get(SUPPORT_URL, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search ?? "",
      status: params.status ?? "ALL",
      priority: params.priority ?? "ALL",
    },
  });

  return response.data;
};

export const getAdminBarberSupportStats = async () => {
  const response = await apik.get(`${SUPPORT_URL}/stats`);
  return response.data;
};

export const getAdminBarberSupportTicketById = async (ticketId) => {
  const response = await apik.get(`${SUPPORT_URL}/${ticketId}`);
  return response.data;
};

export const updateAdminBarberSupportTicket = async (
  ticketId,
  data
) => {
  const response = await apik.patch(
    `${SUPPORT_URL}/${ticketId}`,
    data
  );

  return response.data;
};

export const deleteAdminBarberSupportTicket = async (ticketId) => {
  const response = await apik.delete(`${SUPPORT_URL}/${ticketId}`);
  return response.data;
};

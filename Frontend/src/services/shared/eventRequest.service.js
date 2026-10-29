import apik from "../apik.js";

const BASE_URL = "/api/event-requests";

/* -------------------------------------------------------------------------- */
/*                         CREATE EVENT REQUEST                               */
/* -------------------------------------------------------------------------- */

export const createEventRequest = async (data) => {
  const response = await apik.post(BASE_URL, data);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         GET ALL EVENT REQUESTS                             */
/* -------------------------------------------------------------------------- */

export const getAllEventRequests = async (status = "") => {
  const response = await apik.get(BASE_URL, {
    params: status ? { status } : {},
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         GET EVENT REQUEST BY ID                            */
/* -------------------------------------------------------------------------- */

export const getEventRequestById = async (id) => {
  const response = await apik.get(`${BASE_URL}/${id}`);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         APPROVE / REJECT REQUEST                           */
/* -------------------------------------------------------------------------- */

export const updateEventRequestStatus = async (id, status) => {
  const response = await apik.patch(`${BASE_URL}/${id}/status`, {
    status,
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         DELETE EVENT REQUEST                               */
/* -------------------------------------------------------------------------- */

export const deleteEventRequest = async (id) => {
  const response = await apik.delete(`${BASE_URL}/${id}`);
  return response.data;
};
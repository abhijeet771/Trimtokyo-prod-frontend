
import apik from "../apik.js";

const BASE_URL = "/api/barber-requests";

/* -------------------------------------------------------------------------- */
/*                         CREATE BARBER REQUEST                              */
/*                         POST /api/barber-requests                         */
/* -------------------------------------------------------------------------- */

export const createBarberRequest = async (data) => {
  const response = await apik.post(BASE_URL, {
    ownerName: data.ownerName,
    shopName: data.shopName,
    mobileNumber: data.mobileNumber,
    email: data.email,
    city: data.city,
    shopAddress: data.shopAddress,
    description: data.description || "",
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         GET ALL BARBER REQUESTS                            */
/*                         GET /api/barber-requests                           */
/* -------------------------------------------------------------------------- */

export const getAllBarberRequests = async (status = "") => {
  const response = await apik.get(BASE_URL, {
    params: status ? { status } : {},
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         GET BARBER REQUEST BY ID                           */
/*                         GET /api/barber-requests/:id                       */
/* -------------------------------------------------------------------------- */

export const getBarberRequestById = async (id) => {
  const response = await apik.get(`${BASE_URL}/${id}`);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         APPROVE BARBER REQUEST                             */
/* -------------------------------------------------------------------------- */

export const approveBarberRequest = async (id) => {
  const response = await apik.patch(`${BASE_URL}/${id}/status`, {
    status: "APPROVED",
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         REJECT BARBER REQUEST                              */
/* -------------------------------------------------------------------------- */

export const rejectBarberRequest = async (id) => {
  const response = await apik.patch(`${BASE_URL}/${id}/status`, {
    status: "REJECTED",
  });

  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                         DELETE BARBER REQUEST                              */
/* -------------------------------------------------------------------------- */

export const deleteBarberRequest = async (id) => {
  const response = await apik.delete(`${BASE_URL}/${id}`);
  return response.data;
};

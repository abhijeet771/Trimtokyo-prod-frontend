import apik from "../apik.js";

const BARBER_ADMIN_URL = "/api/barber/admin";

export const getAllBarbers = async (params = {}) => {
  const response = await apik.get(`${BARBER_ADMIN_URL}/all`, { params });
  return response.data;
};

export const getBarberById = async (barberId) => {
  const response = await apik.get(`${BARBER_ADMIN_URL}/${barberId}`);
  return response.data;
};

export const updateBarberStatus = async (barberId, status) => {
  const response = await apik.patch(
    `${BARBER_ADMIN_URL}/${barberId}/status`,
    { status }
  );

  return response.data;
};
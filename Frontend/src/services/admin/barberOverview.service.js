import apik from "../apik.js";

const BARBER_OVERVIEW_URL = "/api/admin/barber-overview";

// GET BARBER OVERVIEW
export const getBarberOverview = async () => {
  const response = await apik.get(BARBER_OVERVIEW_URL);
  return response.data;
};

export default {
  getBarberOverview,
};
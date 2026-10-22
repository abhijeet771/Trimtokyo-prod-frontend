
import apik from "./apik";

const BASE_URL = "/api/barber-staff-overview";

/* -------------------------------------------------------------------------- */
/*                         GET STAFF OVERVIEW                                 */
/* -------------------------------------------------------------------------- */

export const getBarberStaffOverview = (params = {}) => {
  return apik.get(BASE_URL, { params });
};

export default {
  getBarberStaffOverview,
};

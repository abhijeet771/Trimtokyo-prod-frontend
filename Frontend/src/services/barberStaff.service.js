
import apik from "./apik";

/* -------------------------------------------------------------------------- */
/*                           CREATE STAFF                                     */
/* -------------------------------------------------------------------------- */

export const createBarberStaff = (data) =>
  apik.post("/api/barber-staff", data);

/* -------------------------------------------------------------------------- */
/*                           GET ALL STAFF                                    */
/* -------------------------------------------------------------------------- */

export const getBarberStaff = (params = {}) =>
  apik.get("/api/barber-staff", { params });

/* -------------------------------------------------------------------------- */
/*                           GET STAFF BY ID                                  */
/* -------------------------------------------------------------------------- */

export const getBarberStaffById = (staffId) =>
  apik.get(`/api/barber-staff/${staffId}`);

/* -------------------------------------------------------------------------- */
/*                           UPDATE STAFF                                     */
/* -------------------------------------------------------------------------- */

export const updateBarberStaff = (staffId, data) =>
  apik.put(`/api/barber-staff/${staffId}`, data);

/* -------------------------------------------------------------------------- */
/*                           DELETE STAFF                                     */
/* -------------------------------------------------------------------------- */

export const deleteBarberStaff = (staffId) =>
  apik.delete(`/api/barber-staff/${staffId}`);

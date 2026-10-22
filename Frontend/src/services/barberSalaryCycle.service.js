
import apik from "./apik";

const BASE_URL = "/api/barber-salary-cycles";

/* -------------------------------------------------------------------------- */
/*                           CREATE SALARY CYCLE                              */
/* -------------------------------------------------------------------------- */

export const createBarberSalaryCycle = (data) => {
  return apik.post(BASE_URL, data);
};

/* -------------------------------------------------------------------------- */
/*                           GET ALL SALARY CYCLES                            */
/* -------------------------------------------------------------------------- */

export const getBarberSalaryCycles = (params = {}) => {
  return apik.get(BASE_URL, { params });
};

/* -------------------------------------------------------------------------- */
/*                          GET SALARY CYCLE BY ID                            */
/* -------------------------------------------------------------------------- */

export const getBarberSalaryCycleById = (salaryCycleId) => {
  return apik.get(`${BASE_URL}/${salaryCycleId}`);
};

/* -------------------------------------------------------------------------- */
/*                           UPDATE SALARY CYCLE                              */
/* -------------------------------------------------------------------------- */

export const updateBarberSalaryCycle = (salaryCycleId, data) => {
  return apik.put(`${BASE_URL}/${salaryCycleId}`, data);
};

/* -------------------------------------------------------------------------- */
/*                           DELETE SALARY CYCLE                              */
/* -------------------------------------------------------------------------- */

export const deleteBarberSalaryCycle = (salaryCycleId) => {
  return apik.delete(`${BASE_URL}/${salaryCycleId}`);
};

export default {
  createBarberSalaryCycle,
  getBarberSalaryCycles,
  getBarberSalaryCycleById,
  updateBarberSalaryCycle,
  deleteBarberSalaryCycle,
};

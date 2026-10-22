
import apik from "./apik";

const STAFF_BASE_URL = "/api/admin/staff";

/* ============================================================
   STAFF CRUD APIs
============================================================ */

// Create staff
export const createStaff = (staffData) => {
  return apik.post(STAFF_BASE_URL, staffData);
};

// Get all staff: pagination, search, designation filter
export const getAllStaff = ({  page = 1,  limit = 10,  search = "",  designation = "",} = {}) => {
  return apik.get(STAFF_BASE_URL, {
    params: {
      page,
      limit,
      search,
      designation,
    },
  });
};

// Get staff by ID
export const getStaffById = (id) => {
  return apik.get(`${STAFF_BASE_URL}/${id}`);
};

// Update staff
// Backend route: PUT /api/admin/staff/:id
export const updateStaff = (id, staffData) => {
  return apik.put(`${STAFF_BASE_URL}/${id}`, staffData);
};

// Delete staff
export const deleteStaff = (id) => {
  return apik.delete(`${STAFF_BASE_URL}/${id}`);
};

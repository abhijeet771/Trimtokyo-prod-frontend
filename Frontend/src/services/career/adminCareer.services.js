import apik from "../apik.js";

/* -------------------------------------------------------------------------- */
/*                              ADMIN CAREER APIs                             */
/* -------------------------------------------------------------------------- */

const BASE_PATH = "/api/admin/careers";

/**  * Create a career posting.  */

export const createAdminCareer = async (payload) => {
  const response = await apik.post(BASE_PATH, payload);
  return response.data;
};

/**  * Get career postings with pagination and filters.  */

export const getAdminCareers = async (params = {}) => {
  const response = await apik.get(BASE_PATH, { params });
  return response.data;
};

/** * Get a career posting by ID.  */
export const getAdminCareerById = async (id) => {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apik.get(
    `${BASE_PATH}/${encodeURIComponent(id)}`
  );

  return response.data;
};

/**
 * Update a career posting.
 */
export const updateAdminCareer = async (id, payload) => {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apik.put(
    `${BASE_PATH}/${encodeURIComponent(id)}`,
    payload
  );

  return response.data;
};

/**
 * Soft-delete a career posting.
 */
export const deleteAdminCareer = async (id) => {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apik.delete(
    `${BASE_PATH}/${encodeURIComponent(id)}`
  );

  return response.data;
};

/**
 * Update posting status: Active, Draft, or Closed.
 */
export const updateAdminCareerStatus = async (id, status) => {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apik.patch(
    `${BASE_PATH}/${encodeURIComponent(id)}/status`,
    { status }
  );

  return response.data;
};

/**
 * Get career dashboard statistics.
 */
export const getAdminCareerStats = async () => {
  const response = await apik.get(`${BASE_PATH}/stats`);
  return response.data;
};

/**
 * Get soft-deleted career postings.
 */
export const getDeletedAdminCareers = async (params = {}) => {
  const response = await apik.get(`${BASE_PATH}/deleted`, { params });
  return response.data;
};

/**
 * Restore a deleted career posting.
 */
export const restoreAdminCareer = async (id) => {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apik.patch(
    `${BASE_PATH}/${encodeURIComponent(id)}/restore`
  );

  return response.data;
};

export default {
  createAdminCareer,
  getAdminCareers,
  getAdminCareerById,
  updateAdminCareer,
  deleteAdminCareer,
  updateAdminCareerStatus,
  getAdminCareerStats,
  getDeletedAdminCareers,
  restoreAdminCareer,
};

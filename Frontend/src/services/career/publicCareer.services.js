import apik from "../apik.js";

/* -------------------------------------------------------------------------- */
/*                             PUBLIC CAREER APIs                             */
/* -------------------------------------------------------------------------- */

const BASE_PATH = "/api/careers";

/**
 * Get active career opportunities.
 *
 * Supported params:
 * page, limit, search, department, employmentType,
 * workplaceType, location
 */
export const getPublicCareers = async (params = {}) => {
  const response = await apik.get(BASE_PATH, { params });
  return response.data;
};

/**
 * Get active career details by MongoDB ID.
 */
export const getPublicCareerById = async (id) => {
  if (!id) {
    throw new Error("Job ID is required");
  }

  const response = await apik.get(
    `${BASE_PATH}/${encodeURIComponent(id)}`
  );

  return response.data;
};

export default {
  getPublicCareers,
  getPublicCareerById,
};

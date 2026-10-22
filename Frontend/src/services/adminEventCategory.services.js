import apik from "./apik";

const EVENT_CATEGORY_BASE_URL = "/api/admin/event-categories";

/** * Create an event category * POST /api/admin/event-categories */
export const createEventCategory = async (categoryData) => {
  const response = await apik.post(
    EVENT_CATEGORY_BASE_URL,
    categoryData
  );

  return response.data;
};

/** * Get all event categories * GET /api/admin/event-categories */
export const getAllEventCategories = async ({ page = 1, limit = 10, search = "", status = "",} = {}) => {
  const response = await apik.get(EVENT_CATEGORY_BASE_URL, {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
};

/** * Get one event category by ID * GET /api/admin/event-categories/:id */
export const getEventCategoryById = async (id) => {
  const response = await apik.get(
    `${EVENT_CATEGORY_BASE_URL}/${id}`
  );

  return response.data;
};

/** * Update an event category */
export const updateEventCategory = async (id, categoryData) => {
  const response = await apik.put(
    `${EVENT_CATEGORY_BASE_URL}/${id}`,
    categoryData
  );

  return response.data;
};

/** * Delete an event category */
export const deleteEventCategory = async (id) => {
  const response = await apik.delete(
    `${EVENT_CATEGORY_BASE_URL}/${id}`
  );

  return response.data;
};


import apik from "../apik";

// Get revenue analytics
export const getAdminAnalytics = async (filters = {}) => {
  const params = {};

  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  const response = await apik.get("/api/admin/analytics", {
    params,
  });

  return response.data;
};

// Get users analytics
export const getAdminUsersAnalytics = async (filters = {}) => {
  const params = {};

  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  const response = await apik.get("/api/admin/analytics/users", {
    params,
  });

  return response.data;
};

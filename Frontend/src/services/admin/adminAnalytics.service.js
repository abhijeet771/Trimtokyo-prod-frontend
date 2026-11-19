
import apik from "../apik";

// Get admin analytics
export const getAdminAnalytics = async (filters = {}) => {
  const params = {};

  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  const response = await apik.get("/api/admin/analytics", { params });

  return response.data;
};

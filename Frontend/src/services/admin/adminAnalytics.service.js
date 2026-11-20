
import apik from "../apik";

/* =========================================
   HELPER
========================================= */

const buildAnalyticsParams = (filters = {}) => {
  const params = {};

  if (filters.startDate) {
    params.startDate = filters.startDate;
  }

  if (filters.endDate) {
    params.endDate = filters.endDate;
  }

  return params;
};

/* =========================================
   REVENUE & SALES ANALYTICS
========================================= */

// GET /api/admin/analytics
export const getAdminAnalytics = async (filters = {}) => {
  const response = await apik.get("/api/admin/analytics", {
    params: buildAnalyticsParams(filters),
  });

  return response.data;
};

/* =========================================
   USERS ANALYTICS
========================================= */

// GET /api/admin/analytics/users
export const getAdminUsersAnalytics = async (
  filters = {}
) => {
  const response = await apik.get("/api/admin/analytics/users", {
    params: buildAnalyticsParams(filters),
  });

  return response.data;
};

/* =========================================
   BARBER ANALYTICS
========================================= */

// GET /api/admin/analytics/barbers
export const getAdminBarberAnalytics = async (
  filters = {}
) => {
  const response = await apik.get("/api/admin/analytics/barbers", {
    params: buildAnalyticsParams(filters),
  });

  return response.data;
};

/* =========================================
   DEFAULT EXPORT
========================================= */

const adminAnalyticsService = {
  getAdminAnalytics,
  getAdminUsersAnalytics,
  getAdminBarberAnalytics,
};

export default adminAnalyticsService;

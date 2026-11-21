
import api from "../apik";

const BASE_URL = "/api/admin-profit";

// GET ALL PROFIT ENTRIES
export const getAdminProfits = async (filters = {}) => {
  const response = await api.get(BASE_URL, {
    params: filters,
  });

  return response.data;
};

// GET SINGLE PROFIT ENTRY
export const getAdminProfitById = async (profitId) => {
  const response = await api.get(`${BASE_URL}/${profitId}`);

  return response.data;
};

// GET PROFIT & LOSS ANALYTICS
export const getAdminProfitAnalytics = async (filters = {}) => {
  const response = await api.get(`${BASE_URL}/analytics`, {
    params: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      category: filters.category,
    },
  });

  return response.data;
};

// CREATE FINANCIAL ENTRY
export const createAdminProfit = async (profitData) => {
  const response = await api.post(BASE_URL, profitData);

  return response.data;
};

// UPDATE FINANCIAL ENTRY
export const updateAdminProfit = async (profitId, profitData) => {
  const response = await api.put(
    `${BASE_URL}/${profitId}`,
    profitData
  );

  return response.data;
};

// DELETE FINANCIAL ENTRY
export const deleteAdminProfit = async (profitId) => {
  const response = await api.delete(`${BASE_URL}/${profitId}`);

  return response.data;
};

const adminProfitService = {
  getAdminProfits,
  getAdminProfitById,
  getAdminProfitAnalytics,
  createAdminProfit,
  updateAdminProfit,
  deleteAdminProfit,
};

export default adminProfitService;

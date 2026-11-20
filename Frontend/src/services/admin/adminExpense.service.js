
import api from "../apik";

const BASE_URL = "/api/admin/expenses";

// GET ALL EXPENSES
export const getAdminExpenses = async (filters = {}) => {
  const response = await api.get(BASE_URL, {
    params: filters,
  });

  return response.data;
};

// GET EXPENDITURE STATISTICS
export const getAdminExpenseStats = async (filters = {}) => {
  const response = await api.get(`${BASE_URL}/stats`, {
    params: {
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
  });

  return response.data;
};

// CREATE EXPENSE
export const createAdminExpense = async (expenseData) => {
  const response = await api.post(BASE_URL, expenseData);
  return response.data;
};

// UPDATE EXPENSE
export const updateAdminExpense = async (expenseId, expenseData) => {
  const response = await api.put(
    `${BASE_URL}/${expenseId}`,
    expenseData
  );

  return response.data;
};

// DELETE EXPENSE
export const deleteAdminExpense = async (expenseId) => {
  const response = await api.delete(`${BASE_URL}/${expenseId}`);
  return response.data;
};

const adminExpenseService = {
  getAdminExpenses,
  getAdminExpenseStats,
  createAdminExpense,
  updateAdminExpense,
  deleteAdminExpense,
};

export default adminExpenseService;

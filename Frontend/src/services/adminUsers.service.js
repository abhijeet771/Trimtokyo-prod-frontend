
import apik from "./apik";

/* ============================================================
   ADMIN USER MANAGEMENT APIs
============================================================ */

// Get paginated users
export const getAdminUsers = ({  page = 1,  limit = 10,  search = "",
} = {}) =>
  apik.get("/api/admin/users", {
    params: { page, limit, search },
  });

// Get user statistics
export const getAdminUserStats = () =>
  apik.get("/api/admin/users/stats");

// Delete a user
export const deleteAdminUser = (id) =>
  apik.delete(`/api/admin/users/${id}`);


import apik from "../apik";

/* ============================================================
   ADMIN ORDER MANAGEMENT APIs
============================================================ */

// Get paginated admin orders
export const getAdminOrders = (page = 1, limit = 5) =>
  apik.get("/api/admin/orders", {
    params: { page, limit },
  });

// Get admin order statistics
export const getAdminOrderStats = () =>
  apik.get("/api/admin/orders/stats");

// Create manual order
export const createManualOrder = (orderData) =>
  apik.post("/api/admin/orders/manual", orderData);

// Delete an order
export const deleteAdminOrder = (id) =>
  apik.delete(`/api/admin/orders/${id}`);

import apik from "./apik";

/* ============================================================
   ORDER APIs — TRIMTOKYO
============================================================ */

// Create an order (Book Now / Schedule)
export const createOrder = (data) =>
  apik.post("/api/orders", data);

// Get current user's orders
// Supported types: all, upcoming, past, completed, cancelled
export const getMyOrders = (type) =>
  apik.get("/api/orders/my", {
    params: type ? { type } : {},
  });

// Get orders belonging to the authenticated barber
// Supported types: all, upcoming, past, completed, cancelled
export const getBarberOrders = (type) =>
  apik.get("/api/orders/barber", {
    params: type ? { type } : {},
  });

// Update order status
export const updateOrderStatus = (id, status) =>
  apik.patch(`/api/orders/${id}/status`, { status });

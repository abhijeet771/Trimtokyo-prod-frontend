
import api from "./api";

/* ============================================================
   MAP APIs
============================================================ */

// Get route details for an order
export const getOrderRoute = (orderId) =>
  api.get(`/api/map/order/${orderId}`);

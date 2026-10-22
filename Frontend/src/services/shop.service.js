
import api from "./api";

/* ============================================================
   SHOP APIs
============================================================ */

export const getShopBarbers = (query = "") =>
  api.get(`/api/shops${query ? `?${query}` : ""}`);


import api from "./api";

/* ============================================================
   FEATURED BARBERS APIs
============================================================ */

export const getFeaturedBarbers = ({
  businessType,
  limit = 6,
} = {}) =>
  api.get("/api/featured-barbers", {
    params: {
      businessType,
      limit,
    },
  });

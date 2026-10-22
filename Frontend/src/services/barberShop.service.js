
import apik from "./apik";

/* -------------------------------------------------------------------------- */
/*                              GET BARBER SHOP                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetch public salon/barber details by slug.
 *
 * Backend endpoint:
 * GET /api/barber-shop/:slug
 *
 * @param {string} slug
 * @returns {Promise<object>} BarberShop response data
 */
export const getBarberShopBySlug = async (slug) => {
  if (!slug || typeof slug !== "string" || !slug.trim()) {
    throw new Error("A valid barber shop slug is required.");
  }

  const normalizedSlug = slug.trim().toLowerCase();

  const response = await apik.get(
    `/api/barber-shop/${encodeURIComponent(normalizedSlug)}`
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message || "Failed to fetch barber shop details."
    );
  }

  return response.data.data;
};

export default {
  getBarberShopBySlug,
};

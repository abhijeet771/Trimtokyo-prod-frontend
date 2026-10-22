
import apik from "./apik";

/* ============================================================
   BARBER / SHOP SEARCH APIs
============================================================ */

/**
 * Search shops and matching services.
 *
 * GET /api/search
 *
 * Supported params:
 * - search
 * - city
 * - businessType
 * - featured
 * - delivery
 * - rating
 * - sort
 * - page
 * - limit
 */
export const searchBarbers = (params = {}) =>
  apik.get("/api/search", {
    params: {
      ...params,
      search:
        typeof params.search === "string"
          ? params.search.trim()
          : "",
    },
  });

/* ============================================================
   SEARCH FILTERS
============================================================ */

/** * GET /api/search/filters */
export const getSearchFilters = () =>
  apik.get("/api/search/filters");

/* ============================================================
   SEARCH SUGGESTIONS
============================================================ */

/** * GET /api/search/suggestions?query=haircut */

export const getSearchSuggestions = (query = "") =>
  apik.get("/api/search/suggestions", {
    params: {
      query:
        typeof query === "string"
          ? query.trim()
          : "",
    },
  });
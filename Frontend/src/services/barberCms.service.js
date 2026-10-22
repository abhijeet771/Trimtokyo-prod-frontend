
import api from "./api";

/* ============================================================
   BARBER CMS APIs
============================================================ */

// Create barber CMS
export const createBarberCms = () =>
  api.post("/api/barber/cms");

// Get current barber CMS
export const getBarberCms = () =>
  api.get("/api/barber/cms");

// Get public barber CMS by slug
export const getPublicBarberCms = (slug) =>
  api.get(`/api/barber/cms/public/${slug}`);

// Update CMS images
export const updateBarberCmsImages = (images) =>
  api.put("/api/barber/cms/images", { images });

// Update CMS details
export const updateBarberCmsDetails = (details) =>
  api.put("/api/barber/cms/details", { details });

// Update CMS services
export const updateBarberCmsServices = (services) =>
  api.put("/api/barber/cms/services", { services });

// Update CMS barbers
export const updateBarberCmsBarbers = (barbers) =>
  api.put("/api/barber/cms/barbers", { barbers });

// Update CMS other content
export const updateBarberCmsOthers = (others) =>
  api.put("/api/barber/cms/others", { others });

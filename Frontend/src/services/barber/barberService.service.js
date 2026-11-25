
import apik from "../apik";

/* ============================================================
   BARBER SERVICE APIs
============================================================ */

// Add a service
export const addBarberService = (data) =>
  apik.post("/api/barber/services", data);

// Get the current barber's services
// Optional search by service title
export const getMyBarberServices = (params = {}) =>
  apik.get("/api/barber/services/me", {
    params,
  });

// Delete a service belonging to the authenticated barber
export const deleteMyBarberService = (serviceId) =>
  apik.delete(`/api/barber/services/me/${serviceId}`);

// Get approved services for a specific barber
export const getApprovedServicesByBarber = (id) =>
  apik.get(`/api/services/approved/${id}`);

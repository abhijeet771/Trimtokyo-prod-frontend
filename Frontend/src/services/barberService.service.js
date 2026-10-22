
import apik from "./apik";

/* ============================================================
   BARBER SERVICE APIs
============================================================ */

// Add a service
export const addBarberService = (data) =>
  apik.post("/api/barber/services", data);

// Get the current barber's services
export const getMyBarberServices = () =>
  apik.get("/api/barber/services/me");

// Get approved services for a specific barber
export const getApprovedServicesByBarber = (id) =>
  apik.get(`/api/services/approved/${id}`);

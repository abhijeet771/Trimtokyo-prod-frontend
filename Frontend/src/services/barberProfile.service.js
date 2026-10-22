
import apik from "./apik";

/* ============================================================
   BARBER PROFILE APIs
============================================================ */

// Get the logged-in barber's profile
export const getMyProfile = () =>
  apik.get("/api/barber/me");

// Create barber profile
export const addProfile = (data) =>
  apik.post("/api/barber/add", data);

// Update barber profile
export const updateProfile = (data) =>
  apik.put("/api/barber/update", data);

// Delete barber profile
export const deleteProfile = () =>
  apik.delete("/api/barber/delete");

// Get approved barbers
export const getApprovedBarbers = () =>
  apik.get("/api/barber/approved");

// Enable or disable automatic order confirmation
export const toggleAutoConfirm = (autoConfirmOrders) =>
  apik.patch("/api/barber/auto-confirm", {
    autoConfirmOrders,
  });

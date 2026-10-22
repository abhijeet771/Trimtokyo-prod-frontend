
import apik from "./apik";

/* ============================================================
   PUBLIC REELS APIs
============================================================ */

// Get public reels
export const getReels = () =>
  apik.get("/api/admin/reels");

/* ============================================================
   ADMIN REELS APIs
============================================================ */

// Get all reels for admin management
export const getAdminReels = () =>
  apik.get("/api/admin/reels");

// Get a reel by ID
export const getReelById = (id) =>
  apik.get(`/api/admin/reels/${id}`);

// Create a reel
export const createReel = (data) =>
  apik.post("/api/admin/reels", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Update a reel
export const updateReel = (id, data) =>
  apik.put(`/api/admin/reels/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete a reel
export const deleteReel = (id) =>
  apik.delete(`/api/admin/reels/${id}`);

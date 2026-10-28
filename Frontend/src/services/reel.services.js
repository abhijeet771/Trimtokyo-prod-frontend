
import apik from "./apik";

/* ============================================================
   PUBLIC REELS APIs
============================================================ */

// Get publicly available reels
export const getReels = () =>
  apik.get("/api/admin/reels");

/* ============================================================
   ADMIN REELS APIs
============================================================ */

// Get all reels for admin management
export const getAdminReels = () =>
  apik.get("/api/admin/reels/admin");

// Get a reel by ID
export const getReelById = (id) =>
  apik.get(`/api/admin/reels/admin/${id}`);

// Create a reel
export const createReel = (data) =>
  apik.post("/api/admin/reels/admin", data);

// Update a reel
export const updateReel = (id, data) =>
  apik.put(`/api/admin/reels/admin/${id}`, data);

// Delete a reel
export const deleteReel = (id) =>
  apik.delete(`/api/admin/reels/admin/${id}`);

import apik from "./apik";

/* ============================================================
   USER PROFILE APIs
============================================================ */

// Get the logged-in user's profile
export const getMyProfile = () =>
  apik.get("/api/user/profile");

// Update the logged-in user's profile
export const updateMyProfile = (data) =>
  apik.put("/api/user/profile", data);

// Update the logged-in user's avatar
export const updateMyAvatar = (imageUrl) =>
  apik.put("/api/user/profile/avatar", { imageUrl });


import apik from "./apik";

/* -------------------------------------------------------------------------- */
/*                              AUTHENTICATION                                */
/* -------------------------------------------------------------------------- */

export const registerUser = (data) =>
  apik.post("/api/auth/register", data);

export const loginUser = (data) =>
  apik.post("/api/auth/login", data);

export const logoutUser = () =>
  apik.post("/api/auth/logout");

export const getCurrentUser = () =>
  apik.get("/api/auth/me");

/* -------------------------------------------------------------------------- */
/*                              FCM TOKEN                                     */
/* -------------------------------------------------------------------------- */

export const saveFCMToken = (token) =>
  apik.post("/api/auth/save-token", { token });
